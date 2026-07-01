<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Tabs: 'email' | 'phone'
const activeTab = ref<'email' | 'phone'>('email')

// Inputs
const name = ref('')
const email = ref('')
const phone = ref('')
const password = ref('')
const confirmPassword = ref('')
const selectedChannel = ref<'telegram' | 'sms'>('telegram')

const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const telegramLinked = ref(false)
const checkingTelegram = ref(false)
const showPassword = ref(false)
const showConfirmPassword = ref(false)

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

async function handleSignup() {
  errorMessage.value = ''
  successMessage.value = ''

  const identifier = activeTab.value === 'email' ? email.value : normalizePhone(phone.value)

  if (!name.value) {
    errorMessage.value = 'Please enter your full name.'
    return
  }
  if (!identifier) {
    errorMessage.value = 'Please enter a valid email or phone number.'
    return
  }

  // Password validation (only for Email Sign Up)
  if (activeTab.value === 'email') {
    if (password.value.length < 6) {
      errorMessage.value = 'Password must be at least 6 characters.'
      return
    }
    if (password.value !== confirmPassword.value) {
      errorMessage.value = 'Passwords do not match.'
      return
    }
  }

  // If using Telegram, verify linking
  if (activeTab.value === 'phone' && selectedChannel.value === 'telegram' && !telegramLinked.value) {
    await checkTelegramStatus()
    if (!telegramLinked.value) {
      errorMessage.value = 'Your Telegram is not paired. Send /start to bot first.'
      startTelegramPolling()
      return
    }
  }

  isSubmitting.value = true

  try {
    // Send OTP request first
    const response = await fetch('http://localhost:3000/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: activeTab.value,
        identifier,
        phoneOption: activeTab.value === 'phone' ? selectedChannel.value : undefined
      })
    })

    const data = await response.json()

    if (data.success) {
      successMessage.value = 'OTP sent! Redirecting to verification page...'
      stopTelegramPolling()
      
      // Redirect to verification view
      setTimeout(() => {
        router.push({
          path: '/verify',
          query: {
            type: activeTab.value === 'email' ? 'signup' : 'signup-phone',
            id: identifier,
            name: name.value,
            pwd: activeTab.value === 'email' ? password.value : 'PASSWORDLESS', // dummy password for phone login
            tab: activeTab.value,
            channel: activeTab.value === 'phone' ? selectedChannel.value : undefined
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
        <h1 class="auth-title">e-Gov <span class="gold-text">Sign Up</span></h1>
        <p class="auth-desc">Create your official citizen portal account</p>
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
          📧 Email Signup
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'phone' }"
          role="tab"
          @click="activeTab = 'phone'; errorMessage = ''; successMessage = ''; checkTelegramStatus()"
        >
          📱 Phone Signup
        </button>
      </div>

      <!-- SIGN UP FORM -->
      <form @submit.prevent="handleSignup" class="auth-form">
        <!-- Full Name (Always needed) -->
        <div class="form-group">
          <label for="signup-name" class="form-label">Full Name</label>
          <div class="input-wrap">
            <span class="input-icon">👤</span>
            <input
              id="signup-name"
              v-model="name"
              type="text"
              placeholder="John Doe"
              required
              class="form-input"
            />
          </div>
        </div>

        <!-- EMAIL SIGN UP (REQUIRES PASSWORD) -->
        <div v-if="activeTab === 'email'" class="auth-form" style="gap: inherit;">
          <!-- Email Field -->
          <div class="form-group">
            <label for="signup-email" class="form-label">Official Email</label>
            <div class="input-wrap">
              <span class="input-icon">📧</span>
              <input
                id="signup-email"
                v-model="email"
                type="email"
                placeholder="name@email.com"
                required
                class="form-input"
              />
            </div>
          </div>

          <!-- Password -->
          <div class="form-group">
            <label for="signup-password" class="form-label">Password</label>
            <div class="input-wrap">
              <span class="input-icon">🔒</span>
              <input
                id="signup-password"
                v-model="password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="Min 6 characters"
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
          </div>

          <div class="form-group">
            <label for="signup-confirm-password" class="form-label">Confirm Password</label>
            <div class="input-wrap">
              <span class="input-icon">🔒</span>
              <input
                id="signup-confirm-password"
                v-model="confirmPassword"
                :type="showConfirmPassword ? 'text' : 'password'"
                placeholder="Verify password"
                required
                class="form-input"
              />
              <button type="button" class="eye-btn" @click="showConfirmPassword = !showConfirmPassword" :title="showConfirmPassword ? 'Hide Password' : 'Show Password'">
                <svg v-if="showConfirmPassword" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
                <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- PHONE SIGN UP (PASSWORDLESS / OTP-ONLY) -->
        <div v-else class="auth-form" style="gap: inherit; width: 100%;">
          <!-- Phone Field -->
          <div class="form-group">
            <label for="signup-phone" class="form-label">Mobile Number</label>
            <div class="input-wrap">
              <span class="input-icon">📞</span>
              <input
                id="signup-phone"
                v-model="phone"
                type="tel"
                placeholder="60123456789"
                required
                class="form-input"
                @input="checkTelegramStatus"
              />
            </div>

            <!-- OTP Dispatch Channel -->
            <label class="form-label" style="margin-top: 16px;">OTP Dispatch Channel</label>
            <div class="channel-options">
              <label class="channel-card" :class="{ selected: selectedChannel === 'telegram' }">
                <input type="radio" v-model="selectedChannel" value="telegram" name="signup-channel" class="channel-radio" @change="startTelegramPolling" />
                <span class="channel-icon">🔵</span>
                <div class="channel-details">
                  <span class="channel-name">Telegram App</span>
                  <span class="channel-desc">Send code to paired Telegram</span>
                </div>
              </label>

              <label class="channel-card" :class="{ selected: selectedChannel === 'sms' }">
                <input type="radio" v-model="selectedChannel" value="sms" name="signup-channel" class="channel-radio" @change="stopTelegramPolling" />
                <span class="channel-icon">💬</span>
                <div class="channel-details">
                  <span class="channel-name">SMS Message</span>
                  <span class="channel-desc">Direct text carrier network</span>
                </div>
              </label>
            </div>

            <!-- Telegram link panel -->
            <div v-if="selectedChannel === 'telegram'" class="telegram-link-box glass-card">
              <div class="tel-status">
                <span>Telegram Connection:</span>
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
        </div>

        <button type="submit" :disabled="isSubmitting" class="gold-btn submit-btn" id="signup-submit-btn">
          <span v-if="isSubmitting" class="spinner"></span>
          Register & Send OTP
        </button>

        <div class="switch-mode-row">
          <span>Already have an account? </span>
          <router-link to="/login" class="mode-switch-btn">Sign In</router-link>
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
