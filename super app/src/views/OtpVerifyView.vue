<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const useRouterInstance = useRouter()

const type = ref('')
const id = ref('')
const name = ref('')
const pwd = ref('')

const otpCode = ref('')
const isSubmitting = ref(false)
const resendTimer = ref(60)
const errorMessage = ref('')
const successMessage = ref('')

let resendTimerId: ReturnType<typeof setInterval> | null = null

function startResendTimer() {
  resendTimer.value = 60
  if (resendTimerId) clearInterval(resendTimerId)
  resendTimerId = setInterval(() => {
    if (resendTimer.value > 0) {
      resendTimer.value--
    } else {
      if (resendTimerId) clearInterval(resendTimerId)
    }
  }, 1000)
}

onMounted(() => {
  type.value = (route.query.type as string) || ''
  id.value = (route.query.id as string) || ''
  name.value = (route.query.name as string) || ''
  pwd.value = (route.query.pwd as string) || ''
  
  if (!id.value) {
    useRouterInstance.push('/login')
    return
  }
  
  startResendTimer()
})

onUnmounted(() => {
  if (resendTimerId) clearInterval(resendTimerId)
})

async function verify() {
  errorMessage.value = ''
  successMessage.value = ''

  if (otpCode.value.length !== 6) {
    errorMessage.value = 'Code must be exactly 6 digits.'
    return
  }

  isSubmitting.value = true

  try {
    // 1. Verify OTP with the server
    const verifyResponse = await fetch('http://localhost:3000/api/verify-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: id.value, code: otpCode.value })
    })

    const verifyData = await verifyResponse.json()

    if (!verifyData.success) {
      errorMessage.value = verifyData.error || 'Invalid OTP code.'
      isSubmitting.value = false
      return
    }

    // 2. Perform contextual action
    if (type.value === 'login') {
      successMessage.value = 'Identity verified! Logging you in...'
      localStorage.setItem('user', JSON.stringify(verifyData.user))
      setTimeout(() => {
        useRouterInstance.push('/profile')
      }, 1500)
    } else if (type.value === 'signup' || type.value === 'signup-phone') {
      // Complete user registration
      const registerResponse = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: id.value, password: pwd.value, name: name.value })
      })

      const registerData = await registerResponse.json()

      if (registerData.success) {
        successMessage.value = 'Account verified and registered successfully! Logging you in...'
        localStorage.setItem('user', JSON.stringify(registerData.user))
        setTimeout(() => {
          useRouterInstance.push('/profile')
        }, 1500)
      } else {
        errorMessage.value = registerData.error || 'Failed to complete registration.'
      }
    } else if (type.value === 'forgot') {
      // OTP verified successfully, redirect to Reset Password view
      successMessage.value = 'Identity verified! Redirecting to password reset...'
      setTimeout(() => {
        useRouterInstance.push({
          path: '/reset-password',
          query: { id: id.value }
        })
      }, 1200)
    }
  } catch (err) {
    errorMessage.value = 'Verification failed. Please check your backend connection.'
  } finally {
    isSubmitting.value = false
  }
}

async function resend() {
  errorMessage.value = ''
  successMessage.value = ''
  isSubmitting.value = true

  try {
    const isEmail = id.value.includes('@')
    const response = await fetch('http://localhost:3000/api/send-otp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: isEmail ? 'email' : 'phone',
        identifier: id.value,
        phoneOption: isEmail ? undefined : (route.query.channel || 'sms')
      })
    })

    const data = await response.json()

    if (data.success) {
      successMessage.value = 'New OTP code sent successfully!'
      startResendTimer()
    } else {
      errorMessage.value = data.message || 'Failed to resend code.'
    }
  } catch (err) {
    errorMessage.value = 'Failed to connect to verification server.'
  } finally {
    isSubmitting.value = false
  }
}

function handleBack() {
  if (type.value === 'signup' || type.value === 'signup-phone') {
    useRouterInstance.push('/signup')
  } else if (type.value === 'login') {
    useRouterInstance.push('/login')
  } else {
    useRouterInstance.push('/forgot-password')
  }
}
</script>

<template>
  <div class="auth-view container">
    <div class="auth-box glass-card animate-fade-in-up">
      <!-- Back Link -->
      <button class="back-btn" @click="handleBack">← Back</button>

      <div class="auth-header" style="margin-top: 10px;">
        <h2 class="section-heading gold-text">Verify OTP Code</h2>
        <p class="section-subheading">A 6-digit code was sent to securely verify your identity.</p>
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

      <div class="otp-details">
        <p>Security Code sent to:</p>
        <strong class="gold-text">{{ id }}</strong>
      </div>

      <form @submit.prevent="verify" class="auth-form">
        <div class="form-group">
          <label for="otp-code" class="form-label" style="text-align: center;">6-Digit OTP Code</label>
          <input
            id="otp-code"
            v-model="otpCode"
            type="text"
            pattern="[0-9]{6}"
            placeholder="••••••"
            maxlength="6"
            required
            class="otp-input"
            autofocus
          />
        </div>

        <button type="submit" :disabled="isSubmitting" class="gold-btn submit-btn" id="verify-submit-btn">
          <span v-if="isSubmitting" class="spinner"></span>
          Verify Code
        </button>

        <div class="resend-section">
          <span v-if="resendTimer > 0">Resend code in {{ resendTimer }}s</span>
          <button v-else type="button" @click="resend" class="resend-link">
            Resend Verification Code
          </button>
        </div>
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
  background: none;
  border: none;
  transition: color var(--transition-fast);
  padding: 0;
}

.back-btn:hover {
  color: var(--gold-400);
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

.otp-details {
  text-align: center;
  margin-bottom: var(--space-lg);
  font-size: 0.88rem;
  color: var(--text-secondary);
}

.otp-input {
  text-align: center;
  font-size: 2rem;
  letter-spacing: 0.5em;
  padding: 12px;
  background: var(--navy-900);
  border: 1.5px solid var(--glass-border);
  border-radius: var(--radius-xl);
  color: var(--text-primary);
  font-family: 'Outfit', sans-serif;
  font-weight: 700;
  outline: none;
  transition: all var(--transition-base);
  width: 100%;
}

.otp-input:focus {
  border-color: var(--gold-500);
  box-shadow: var(--gold-glow);
}

.resend-section {
  text-align: center;
  font-size: 0.8rem;
  color: var(--text-muted);
}

.resend-link {
  color: var(--gold-400);
  font-weight: 600;
  cursor: pointer;
  transition: color var(--transition-fast);
  background: none;
  border: none;
  padding: 0;
}

.resend-link:hover {
  color: var(--gold-300);
  text-decoration: underline;
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
