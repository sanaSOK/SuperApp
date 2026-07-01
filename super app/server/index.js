import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import nodemailer from 'nodemailer';
import twilio from 'twilio';
import TelegramBot from 'node-telegram-bot-api';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Temporary in-memory databases
const otps = new Map(); // key: email/phone, value: { code, expiresAt }
const phoneToChatIdMap = new Map(); // key: normalized phone number, value: telegram chatId
const users = new Map(); // key: email/phone, value: password

// Prepopulate default citizens
users.set('citizen@egov.portal', 'password123');
users.set('60123456789', 'password123');

// Initialize Telegram Bot if token is provided
let bot = null;
if (process.env.TELEGRAM_BOT_TOKEN && process.env.TELEGRAM_BOT_TOKEN !== 'your-telegram-bot-token-here') {
  try {
    bot = new TelegramBot(process.env.TELEGRAM_BOT_TOKEN, { polling: true });
    console.log('🤖 Telegram Bot initialized and polling...');

    bot.onText(/\/start/, (msg) => {
      const chatId = msg.chat.id;
      bot.sendMessage(chatId, "🏛️ *Welcome to the e-Gov Portal Verification Bot!*\n\nPlease click the button below to link your Telegram account with your phone number.", {
        parse_mode: 'Markdown',
        reply_markup: {
          keyboard: [[{
            text: "📞 Share Contact",
            request_contact: true
          }]],
          resize_keyboard: true,
          one_time_keyboard: true
        }
      });
    });

    bot.on('contact', (msg) => {
      const chatId = msg.chat.id;
      if (msg.contact && msg.contact.phone_number) {
        let phone = msg.contact.phone_number.replace(/\D/g, '');
        // Normalize common country formats (e.g. ensure starting country code is handled)
        phoneToChatIdMap.set(phone, chatId);
        console.log(`🔗 Linked Telegram Chat ID ${chatId} to Phone: ${phone}`);
        bot.sendMessage(chatId, "✅ *Account successfully linked!*\n\nYou will now receive security OTP codes directly in this chat when accessing your e-Gov services.", {
          parse_mode: 'Markdown',
          reply_markup: {
            remove_keyboard: true
          }
        });
      } else {
        bot.sendMessage(chatId, "❌ Failed to link account. Please share your official phone number contact.");
      }
    });
  } catch (error) {
    console.error('❌ Failed to initialize Telegram Bot:', error.message);
  }
} else {
  console.log('⚠️ TELEGRAM_BOT_TOKEN not configured. Telegram OTP sending will log to console.');
}

// Generate a 6-digit OTP code
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send Email OTP
async function sendEmailOTP(email, otp) {
  const isConfigured = process.env.EMAIL_USER && process.env.EMAIL_PASS && 
                       process.env.EMAIL_USER !== 'your-email@gmail.com';

  console.log(`[EMAIL OTP] Code for ${email}: ${otp}`);

  if (isConfigured) {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
    });

    const mailOptions = {
      from: `"e-Gov Secure Services" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'e-Gov Portal Login Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #d4af37; border-radius: 12px; overflow: hidden; background-color: #04090f; color: #ffffff;">
          <div style="background-color: #0a1628; padding: 24px; text-align: center; border-bottom: 2px solid #d4af37;">
            <h1 style="color: #d4af37; margin: 0; font-size: 24px; letter-spacing: 1px;">🏛️ e-Gov Digital Portal</h1>
          </div>
          <div style="padding: 30px 24px; text-align: center;">
            <p style="font-size: 16px; color: #a0aec0; margin-bottom: 24px;">Please use the secure OTP code below to complete your login or registration request. The code is valid for 5 minutes.</p>
            <div style="display: inline-block; background: linear-gradient(135deg, #ffd700 0%, #d4af37 100%); color: #0a1628; font-size: 32px; font-weight: bold; padding: 12px 36px; border-radius: 8px; letter-spacing: 4px; box-shadow: 0 4px 12px rgba(212,175,55,0.3); margin-bottom: 24px;">
              ${otp}
            </div>
            <p style="font-size: 12px; color: #718096;">If you did not request this code, please ignore this email or contact support.</p>
          </div>
          <div style="background-color: #0a1628; padding: 12px; text-align: center; font-size: 11px; color: #718096;">
            &copy; 2026 e-Gov Digital Services Portal. All rights reserved.
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
  }
}

// Send Telegram OTP
async function sendTelegramOTP(chatId, otp) {
  if (bot) {
    const text = `🏛️ *e-Gov Secure Verification*\n\nYour 6-digit login OTP code is:\n\n*${otp}*\n\nDo not share this code with anyone. It will expire in 5 minutes.`;
    await bot.sendMessage(chatId, text, { parse_mode: 'Markdown' });
  } else {
    console.log(`[TELEGRAM SIMULATED] Sending ${otp} to chat ID ${chatId}`);
  }
}

// Send SMS OTP (Twilio)
async function sendSMSOTP(phone, otp) {
  const isConfigured = process.env.TWILIO_ACCOUNT_SID && process.env.TWILIO_AUTH_TOKEN && process.env.TWILIO_PHONE_NUMBER &&
                       process.env.TWILIO_ACCOUNT_SID !== 'your-twilio-sid-here';

  console.log(`[SMS OTP] Code for ${phone}: ${otp}`);

  if (isConfigured) {
    const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    await client.messages.create({
      body: `e-Gov Secure Portal Verification Code: ${otp}. Valid for 5 minutes.`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: `+${phone}`
    });
  }
}

// Endpoints

// 1a. User Registration Endpoint
app.post('/api/register', (req, res) => {
  const { identifier, password, name } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ success: false, error: 'Identifier and password are required' });
  }

  const normalized = identifier.includes('@') ? identifier : identifier.replace(/\D/g, '');

  if (users.has(normalized)) {
    return res.status(400).json({ success: false, error: 'Account already exists. Please login.' });
  }

  users.set(normalized, password);
  console.log(`👤 Registered new user: ${normalized}`);

  const isEmail = normalized.includes('@');
  res.json({
    success: true,
    user: {
      identifier: normalized,
      name: name || (isEmail ? normalized.split('@')[0] : 'Citizen Zone'),
      role: 'Citizen',
      id: `GOV-2026-${Math.floor(100 + Math.random() * 900)}`,
      verifiedAt: new Date().toISOString()
    }
  });
});

// 1b. Password Login Endpoint
app.post('/api/login', (req, res) => {
  const { identifier, password } = req.body;
  if (!identifier || !password) {
    return res.status(400).json({ success: false, error: 'Identifier and password are required' });
  }

  const normalized = identifier.includes('@') ? identifier : identifier.replace(/\D/g, '');

  // Check if user exists
  if (!users.has(normalized)) {
    return res.status(400).json({ success: false, error: 'Account not found. Please click Sign Up to register first.' });
  }

  const savedPassword = users.get(normalized);
  if (savedPassword !== password) {
    return res.status(400).json({ success: false, error: 'Incorrect password. Click Forgot Password to reset using OTP.' });
  }

  const isEmail = normalized.includes('@');
  res.json({
    success: true,
    user: {
      identifier: normalized,
      name: isEmail ? normalized.split('@')[0] : 'Citizen Zone',
      role: 'Citizen',
      id: `GOV-2026-${Math.floor(100 + Math.random() * 900)}`,
      verifiedAt: new Date().toISOString()
    }
  });
});

// 2. Send OTP Endpoint
app.post('/api/send-otp', async (req, res) => {
  const { type, identifier, phoneOption } = req.body; // type: 'email' or 'phone', identifier: email address or phone number

  if (!identifier) {
    return res.status(400).json({ success: false, error: 'Identifier is required' });
  }

  const normalized = type === 'email' ? identifier : identifier.replace(/\D/g, '');
  const otp = generateOTP();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes

  otps.set(normalized, { code: otp, expiresAt });

  try {
    if (type === 'email') {
      await sendEmailOTP(normalized, otp);
      return res.json({ success: true, message: 'OTP sent to Gmail successfully!' });
    } else if (type === 'phone') {
      // Determine delivery channel (Telegram vs SMS)
      // Check if Telegram is requested/available
      const chatId = phoneToChatIdMap.get(normalized);
      
      if (phoneOption === 'telegram') {
        if (chatId) {
          await sendTelegramOTP(chatId, otp);
          return res.json({ success: true, channel: 'telegram', message: 'OTP sent directly to Telegram!' });
        } else {
          return res.status(400).json({ 
            success: false, 
            error: 'telegram_not_linked',
            message: 'Your Telegram is not connected to this phone number yet. Please link it or choose SMS option.' 
          });
        }
      } else {
        // Fallback to SMS
        await sendSMSOTP(normalized, otp);
        return res.json({ success: true, channel: 'sms', message: 'OTP sent via SMS successfully!' });
      }
    }

    res.status(400).json({ success: false, error: 'Invalid verification type' });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, error: error.message, message: 'Failed to send OTP code. Please verify credentials.' });
  }
});

// 3. Verify OTP Endpoint
app.post('/api/verify-otp', (req, res) => {
  const { identifier, code } = req.body;

  if (!identifier || !code) {
    return res.status(400).json({ success: false, error: 'Identifier and OTP code are required' });
  }

  const normalized = identifier.includes('@') ? identifier : identifier.replace(/\D/g, '');
  const record = otps.get(normalized);

  if (!record) {
    return res.status(400).json({ success: false, error: 'No OTP requested for this account' });
  }

  if (Date.now() > record.expiresAt) {
    otps.delete(normalized);
    return res.status(400).json({ success: false, error: 'OTP code has expired. Please request a new one.' });
  }

  if (record.code !== code) {
    return res.status(400).json({ success: false, error: 'Invalid OTP code. Please try again.' });
  }

  // Clear verification session on success
  otps.delete(normalized);

  const isEmail = normalized.includes('@');
  res.json({
    success: true,
    message: 'OTP verified successfully!',
    user: {
      identifier: normalized,
      name: isEmail ? normalized.split('@')[0] : 'Citizen Zone',
      role: 'Citizen',
      id: `GOV-2026-${Math.floor(100 + Math.random() * 900)}`,
      verifiedAt: new Date().toISOString()
    }
  });
});

// 4. Reset Password Endpoint
app.post('/api/reset-password', (req, res) => {
  const { identifier, newPassword } = req.body;
  if (!identifier || !newPassword) {
    return res.status(400).json({ success: false, error: 'Identifier and new password are required' });
  }

  const normalized = identifier.includes('@') ? identifier : identifier.replace(/\D/g, '');
  
  users.set(normalized, newPassword);
  console.log(`🔑 Reset password for user: ${normalized}`);

  const isEmail = normalized.includes('@');
  res.json({
    success: true,
    message: 'Password reset successfully! Logging you in...',
    user: {
      identifier: normalized,
      name: isEmail ? normalized.split('@')[0] : 'Citizen Zone',
      role: 'Citizen',
      id: `GOV-2026-${Math.floor(100 + Math.random() * 900)}`,
      verifiedAt: new Date().toISOString()
    }
  });
});

// 5. Check Telegram Connection Status
app.get('/api/telegram-status/:phone', (req, res) => {
  const phone = req.params.phone.replace(/\D/g, '');
  const isLinked = phoneToChatIdMap.has(phone);
  res.json({ isLinked });
});

app.listen(PORT, () => {
  console.log(`🚀 Express e-Gov OTP Backend server running on http://localhost:${PORT}`);
});
