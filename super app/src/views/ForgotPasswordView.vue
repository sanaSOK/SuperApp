<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

// Tab: 'email' | 'phone'
const activeTab = ref<'email' | 'phone'>('email')

// Inputs
const email = ref('')
const phone = ref('')
const selectedChannel = ref<'telegram' | 'sms'>('telegram')

const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const telegramLinked = ref(false)
const checkingTelegram = ref(false)

// Bot poll
let timerId: ReturnType<typeof setInterval> | null = null;

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

async function handleForgot() {
  errorMessage.value = ''
  successMessage.value = ''
  
  const identifier = activeTab.value === 'email' ? email.value : normalizePhone(phone.value)

  if (!identifier) {
    errorMessage.value = 'Please enter your registered email or phone.'
    return
  }

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
      successMessage.value = 'OTP sent! Redirecting to code verification...'
      stopTelegramPolling()
      setTimeout(() => {
        router.push({
          path: '/verify',
          query: {
            type: 'forgot',
            id: identifier
          }
        })
      }, 1200)
    } else {
      if (data.error === 'telegram_not_linked') {
        telegramLinked.value = false
        errorMessage.value = data.message
        startTelegramPolling()
      } else {
        errorMessage.value = data.message || 'Failed to send OTP.'
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
      <!-- Back button -->
      <router-link to="/login" class="back-btn">← Back to Password Login</router-link>

      <!-- Header -->
      <div class="auth-header" style="margin-top: 10px;">
        <h2 class="section-heading gold-text">Forgot Password</h2>
        <p class="section-subheading">Verify identity with OTP to set new password.</p>
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
          @click="activeTab = 'email'; errorMessage = ''; successMessage = ''"
        >
          📧 Email Reset
        </button>
        <button
          class="tab-btn"
          :class="{ active: activeTab === 'phone' }"
          role="tab"
          @click="activeTab = 'phone'; errorMessage = ''; successMessage = ''"
        >
          📱 Phone Reset
        </button>
      </div>

      <form @submit.prevent="handleForgot" class="auth-form">
        <!-- Email Forgot Input -->
        <div v-if="activeTab === 'email'" class="form-group">
          <label for="forgot-email" class="form-label">Registered Email</label>
          <div class="input-wrap">
            <span class="input-icon">📧</span>
            <input
              id="forgot-email"
              v-model="email"
              type="email"
              placeholder="name@email.com"
              required
              class="form-input"
            />
          </div>
        </div>

        <!-- Phone Forgot Input -->
        <div v-if="activeTab === 'phone'" class="form-group">
          <label for="forgot-phone" class="form-label">Mobile Number</label>
          <div class="input-wrap">
            <span class="input-icon">📞</span>
            <input
              id="forgot-phone"
              v-model="phone"
              type="tel"
              placeholder="60123456789"
              required
              class="form-input"
              @input="checkTelegramStatus"
            />
          </div>

          <!-- Delivery Options -->
          <label class="form-label" style="margin-top: 16px;">OTP Channel</label>
          <div class="channel-options">
            <!-- Telegram Option -->
            <label class="channel-card" :class="{ selected: selectedChannel === 'telegram' }">
              <input
                type="radio"
                v-model="selectedChannel"
                value="telegram"
                name="channel"
                class="channel-radio"
                @change="startTelegramPolling"
              />
              <span class="channel-icon">🔵</span>
              <div class="channel-details">
                <span class="channel-name">Telegram Messenger</span>
                <span class="channel-desc">Send code to paired Telegram</span>
              </div>
            </label>

            <!-- SMS Option -->
            <label class="channel-card" :class="{ selected: selectedChannel === 'sms' }">
              <input
                type="radio"
                v-model="selectedChannel"
                value="sms"
                name="channel"
                class="channel-radio"
                @change="stopTelegramPolling"
              />
              <span class="channel-icon">💬</span>
              <div class="channel-details">
                <span class="channel-name">SMS Message</span>
                <span class="channel-desc">Direct text carrier message</span>
              </div>
            </label>
          </div>

          <!-- Telegram sync panel -->
          <div v-if="selectedChannel === 'telegram'" class="telegram-link-box glass-card">
            <div class="tel-status">
              <span>Telegram Connected:</span>
              <span v-if="checkingTelegram" class="status-badge checking">Verifying...</span>
              <span v-else-if="telegramLinked" class="status-badge linked">CONNECTED ✓</span>
              <span v-else class="status-badge unlinked">NOT LINKED</span>
            </div>

            <div v-if="!telegramLinked" class="tel-instructions">
              <p>1. Chat with the Gov Verification bot:</p>
              <a href="https://t.me/egov_otp_bot" target="_blank" class="gold-btn tel-btn" style="margin: 8px 0; justify-content: center;">
                ✈️ Start @GovPortalVerifyBot
              </a>
              <p>2. Send <strong>/start</strong>, then click <strong>Share Contact</strong> to link this phone number.</p>
            </div>
          </div>
        </div>

        <button type="submit" :disabled="isSubmitting" class="gold-btn submit-btn" id="forgot-send-otp-btn">
          <span v-if="isSubmitting" class="spinner"></span>
          Send Reset OTP Code
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Same styles as LoginView */
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

.section-heading {
  font-family: 'Outfit', sans-serif;
  font-size: 1.3rem;
  font-weight: 800;
}

.section-subheading {
  font-size: 0.82rem;
  color: var(--text-muted);
  margin-top: 4px;
}

.back-btn {
  font-size: 0.82rem;
  color: var(--text-muted);
  cursor: pointer;
  align-self: flex-start;
  transition: color var(--transition-fast);
}

.back-btn:hover {
  color: var(--gold-400);
}

.auth-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: var(--navy-900);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-full);
  padding: 4px;
  margin-bottom: var(--space-xl);
  margin-top: var(--space-lg);
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

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
