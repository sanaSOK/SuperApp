<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Tabs: 'email' | 'phone'
const activeTab = ref<'email' | 'phone'>('email')

// Inputs
const email = ref('')
const phone = ref('')
const password = ref('')
const selectedChannel = ref<'telegram' | 'sms'>('telegram')

const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const telegramLinked = ref(false)
const checkingTelegram = ref(false)
const showPassword = ref(false)

// Bot poll
let timerId: ReturnType<typeof setInterval> | null = null;

// Normalize phone
function normalizePhone(num: string) {
  return num.replace(/\D/g, '')
}

async function checkTelegramStatus() {
  const currentPhone = normalizePhone(phone.value)
  if (!currentPhone) return
  checkingTelegram.value = true
  try {
    const response = await fetch(`http://localhost:3000/api/telegram-status/${currentPhone}`)
    const data = await response.json()
    telegramLinked.value = data.isLinked
  } catch (err) {
    console.error('Failed to check Telegram link:', err)
  } finally {
    checkingTelegram.value = false
  }
}

function startTelegramPolling() {
  checkTelegramStatus()
  if (timerId) clearInterval(timerId)
  timerId = setInterval(checkTelegramStatus, 3000)
}

function stopTelegramPolling() {
  if (timerId) {
    clearInterval(timerId)
    timerId = null
  }
}

onUnmounted(() => {
  stopTelegramPolling()
})

// Email password sign in
async function loginWithPassword() {
  errorMessage.value = ''
  successMessage.value = ''
  
  if (!email.value || !password.value) {
    errorMessage.value = 'Please enter your email and password.'
    return
  }

  isSubmitting.value = true

  try {
    const response = await fetch('http://localhost:3000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: email.value, password: password.value })
    })

    const data = await response.json()

    if (data.success) {
      successMessage.value = 'Login successful! Redirecting...'
      localStorage.setItem('user', JSON.stringify(data.user))
      setTimeout(() => {
        router.push('/profile')
      }, 1500)
    } else {
      errorMessage.value = data.error || 'Incorrect email or password.'
    }
  } catch (err) {
    errorMessage.value = 'Failed to connect to authentication server. Ensure backend is running.'
  } finally {
    isSubmitting.value = false
  }
}

// Phone OTP Sign In
async function sendPhoneOTP() {
  errorMessage.value = ''
  successMessage.value = ''

  const rawPhone = normalizePhone(phone.value)
  if (!rawPhone) {
    errorMessage.value = 'Please enter your mobile number.'
    return
  }

  if (selectedChannel.value === 'telegram' && !telegramLinked.value) {
    await checkTelegramStatus()
    if (!telegramLinked.value) {
      errorMessage.value = 'Your Telegram is not paired. Send /start to bot first.'
      startTelegramPolling()
      return
    }
  }

  isSubmitting.value = true

  try {
    const response = await fetch('http://localhost:3000/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'phone',
        identifier: rawPhone,
        phoneOption: selectedChannel.value
      })
    })

    const data = await response.json()

    if (data.success) {
      successMessage.value = 'Verification code sent!'
      stopTelegramPolling()
      
      // Redirect to verification view with 'login' context
      setTimeout(() => {
        router.push({
          path: '/verify',
          query: {
            type: 'login',
            id: rawPhone,
            channel: selectedChannel.value
          }
        })
      }, 1200)
    } else {
      if (data.error === 'telegram_not_linked') {
        telegramLinked.value = false
        errorMessage.value = data.message
        startTelegramPolling()
      } else {
        errorMessage.value = data.message || 'Failed to dispatch verification OTP.'
      }
    }
  } catch (err) {
    errorMessage.value = 'Failed to connect to verification server. Ensure backend is running.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="auth-view container">
    <div class="auth-box glass-card animate-fade-in-up">
      <!-- Header -->
      <div class="auth-header">
        <div class="auth-seal">
          <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle cx="32" cy="32" r="30" stroke="url(#goldAuth)" stroke-width="2"/>
            <polygon points="32,10 36,24 50,24 39,33 43,47 32,38 21,47 25,33 14,24 28,24" fill="url(#goldAuth)"/>
            <defs>
              <linearGradient id="goldAuth" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stop-color="#FFD700"/>
                <stop offset="100%" stop-color="#B8960C"/>
              </linearGradient>
            </defs>
          </svg>
        </div>
        <h1 class="auth-title">e-Gov <span class="gold-text">Portal Login</span></h1>
        <p class="auth-desc">Secure gateway to official digital services</p>
      </div>

      <!-- Messages -->
      <transition name="fade">
        <div v-if="errorMessage" class="banner error-banner">
          <span>⚠️</span>
          <p>{{ errorMessage }}</p>
        </div>
      </transition>
      <transition name="fade">
        <div v-if="successMessage" class="banner success-banner">
          <span>✅</span>
          <p>{{ successMessage }}</p>
        </div>
      </transition>

      <!-- Tabs -->
      <div class="auth-tabs" role="tablist">
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'email' }"
          role="tab"
          @click="activeTab = 'email'; errorMessage = ''; successMessage = ''; stopTelegramPolling()"
        >
          📧 Email Login
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'phone' }"
          role="tab"
          @click="activeTab = 'phone'; errorMessage = ''; successMessage = ''; checkTelegramStatus()"
        >
          📱 Phone Login
        </button>
      </div>

      <!-- EMAIL LOGIN FORM (PASSWORD NEEDED) -->
      <form v-if="activeTab === 'email'" @submit.prevent="loginWithPassword" class="auth-form">
        <!-- Email Field -->
        <div class="form-group">
          <label for="email" class="form-label">Official Email</label>
          <div class="input-wrap">
            <span class="input-icon">📧</span>
            <input
              id="email"
              v-model="email"
              type="email"
              placeholder="name@email.com"
              required
              class="form-input"
            />
          </div>
        </div>

        <!-- Password Field -->
        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <div class="input-wrap">
            <span class="input-icon">🔒</span>
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              placeholder="••••••••"
              required
              class="form-input"
            />
            <button type="button" class="eye-btn" @click="showPassword = !showPassword" :title="showPassword ? 'Hide Password' : 'Show Password'">
              <svg v-if="showPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
                <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                <line x1="1" y1="1" x2="23" y2="23"/>
              </svg>
              <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
                <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                <circle cx="12" cy="12" r="3"/>
              </svg>
            </button>
          </div>
          <div class="form-actions-row">
            <router-link to="/forgot-password" class="forgot-link">
              Forgot Password?
            </router-link>
          </div>
        </div>

        <button type="submit" :disabled="isSubmitting" class="gold-btn submit-btn" id="login-submit-btn">
          <span v-if="isSubmitting" class="spinner"></span>
          Sign In Securely
        </button>
        
        <div class="switch-mode-row">
          <span>Don't have an account? </span>
          <router-link to="/signup" class="mode-switch-btn">Sign Up</router-link>
        </div>

        <p class="help-text" style="text-align: center; margin-top: 10px;">
          Default Email: <strong>citizen@egov.portal</strong> / <strong>password123</strong>
        </p>
      </form>

      <!-- PHONE LOGIN FORM (PASSWORDLESS / OTP-ONLY) -->
      <form v-else @submit.prevent="sendPhoneOTP" class="auth-form">
        <!-- Phone Field -->
        <div class="form-group">
          <label for="phone" class="form-label">Mobile Number</label>
          <div class="input-wrap">
            <span class="input-icon">📞</span>
            <input
              id="phone"
              v-model="phone"
              type="tel"
              placeholder="60123456789"
              required
              class="form-input"
              @input="checkTelegramStatus"
            />
          </div>

          <!-- Dispatch Channel -->
          <label class="form-label" style="margin-top: 16px;">OTP Delivery Channel</label>
          <div class="channel-options">
            <label class="channel-card" :class="{ selected: selectedChannel === 'telegram' }">
              <input type="radio" v-model="selectedChannel" value="telegram" name="login-channel" class="channel-radio" @change="startTelegramPolling" />
              <span class="channel-icon">🔵</span>
              <div class="channel-details">
                <span class="channel-name">Telegram App</span>
                <span class="channel-desc">Send code to paired Telegram</span>
              </div>
            </label>

            <label class="channel-card" :class="{ selected: selectedChannel === 'sms' }">
              <input type="radio" v-model="selectedChannel" value="sms" name="login-channel" class="channel-radio" @change="stopTelegramPolling" />
              <span class="channel-icon">💬</span>
              <div class="channel-details">
                <span class="channel-name">SMS Message</span>
                <span class="channel-desc">Direct text carrier network</span>
              </div>
            </label>
          </div>

          <!-- Telegram Link Status -->
          <div v-if="selectedChannel === 'telegram'" class="telegram-link-box glass-card">
            <div class="tel-status">
              <span>Telegram Link Status:</span>
              <span v-if="checkingTelegram" class="status-badge checking">Verifying...</span>
              <span v-else-if="telegramLinked" class="status-badge linked">CONNECTED ✓</span>
              <span v-else class="status-badge unlinked">NOT LINKED</span>
            </div>
            <div v-if="!telegramLinked" class="tel-instructions">
              <p>1. Open Telegram Bot to link:</p>
              <a href="https://t.me/egov_otp_bot" target="_blank" class="gold-btn tel-btn" style="margin: 8px 0; justify-content: center;">
                ✈️ Connect Bot
              </a>
              <p>2. Send <strong>/start</strong>, then click <strong>Share Contact</strong>.</p>
            </div>
          </div>
        </div>

        <button type="submit" :disabled="isSubmitting" class="gold-btn submit-btn" id="phone-login-btn">
          <span v-if="isSubmitting" class="spinner"></span>
          Send Login OTP Code
        </button>

        <div class="switch-mode-row">
          <span>Don't have an account? </span>
          <router-link to="/signup" class="mode-switch-btn">Sign Up</router-link>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.auth-view {
  min-height: calc(100vh - var(--header-height));
  display: flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-xl) var(--space-md);
}

@media (min-width: 1024px) {
  .auth-view {
    min-height: 100vh;
  }
}

.auth-box {
  width: 100%;
  max-width: 480px;
  padding: var(--space-2xl) var(--space-xl);
}

.auth-header {
  text-align: center;
  margin-bottom: var(--space-xl);
}

.auth-seal {
  width: 52px;
  height: 52px;
  margin: 0 auto 12px;
  filter: drop-shadow(var(--gold-glow));
}

.auth-title {
  font-family: 'Outfit', sans-serif;
  font-size: 1.6rem;
  font-weight: 800;
  color: var(--text-primary);
}

.auth-desc {
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-top: 4px;
}

/* Tabs */
.auth-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: var(--navy-900);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-full);
  padding: 4px;
  margin-bottom: var(--space-xl);
}

.tab-btn {
  padding: 10px;
  border-radius: var(--radius-full);
  font-family: 'Outfit', sans-serif;
  font-size: 0.85rem;
  font-weight: 700;
  color: var(--text-muted);
  transition: all var(--transition-base);
}

.tab-btn.active {
  background: var(--gold-gradient);
  color: var(--navy-800);
}

/* Forms */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-family: 'Outfit', sans-serif;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.input-wrap {
  display: flex;
  align-items: center;
  background: var(--navy-900);
  border: 1.5px solid var(--glass-border);
  border-radius: var(--radius-xl);
  padding: 12px 16px;
  transition: border-color var(--transition-base);
}

.input-wrap:focus-within {
  border-color: var(--gold-500);
}

.input-icon {
  font-size: 1.1rem;
  margin-right: 12px;
}

.form-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-family: 'Inter', sans-serif;
  font-size: 0.92rem;
  color: var(--text-primary);
}

.form-input::placeholder {
  color: var(--text-muted);
}

.form-actions-row {
  display: flex;
  justify-content: flex-end;
}

.forgot-link {
  font-size: 0.8rem;
  color: var(--gold-400);
  font-weight: 600;
  cursor: pointer;
  background: none;
  border: none;
}

.forgot-link:hover {
  color: var(--gold-300);
  text-decoration: underline;
}

.switch-mode-row {
  text-align: center;
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 8px;
}

.mode-switch-btn {
  background: none;
  border: none;
  color: var(--gold-400);
  font-family: 'Outfit', sans-serif;
  font-weight: 700;
  cursor: pointer;
  padding: 0;
  margin-left: 4px;
}

.mode-switch-btn:hover {
  color: var(--gold-300);
  text-decoration: underline;
}

.help-text {
  font-size: 0.72rem;
  color: var(--text-muted);
  line-height: 1.4;
}

.submit-btn {
  width: 100%;
  justify-content: center;
  padding: 14px;
}

.banner {
  display: flex;
  gap: 10px;
  padding: 12px 16px;
  border-radius: var(--radius-lg);
  margin-bottom: var(--space-lg);
  font-size: 0.8rem;
  line-height: 1.4;
}

.error-banner {
  background: rgba(239, 68, 68, 0.12);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #FCA5A5;
}

.success-banner {
  background: rgba(34, 197, 94, 0.12);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #86EFAC;
}

.spinner {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin-slow 1s ease-in-out infinite;
  margin-right: 8px;
}

.eye-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0 4px;
  transition: color var(--transition-fast);
  margin-left: 8px;
  background: none;
  border: none;
}

.eye-btn:hover {
  color: var(--gold-400);
}

.channel-options {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.channel-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px var(--space-md);
  border-radius: var(--radius-xl);
  background: var(--glass-bg);
  border: 1.5px solid var(--glass-border);
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
}

.channel-radio {
  position: absolute;
  opacity: 0;
}

.channel-card.selected {
  border-color: var(--gold-500);
  background: rgba(212, 175, 55, 0.08);
}

.channel-icon {
  font-size: 1.3rem;
}

.channel-details {
  display: flex;
  flex-direction: column;
}

.channel-name {
  font-family: 'Outfit', sans-serif;
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-primary);
}

.channel-desc {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.telegram-link-box {
  padding: 16px;
  border-radius: var(--radius-lg);
  margin-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.tel-status {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
}

.status-badge {
  font-family: 'Outfit', sans-serif;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 3px 8px;
  border-radius: var(--radius-full);
}

.status-badge.linked {
  background: rgba(34, 197, 94, 0.15);
  color: #86EFAC;
}

.status-badge.unlinked {
  background: rgba(239, 68, 68, 0.15);
  color: #FCA5A5;
}

.status-badge.checking {
  background: rgba(212, 175, 55, 0.15);
  color: #FFE599;
}

.tel-instructions {
  font-size: 0.78rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
