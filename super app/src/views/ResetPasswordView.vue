<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const useRouterInstance = useRouter()

const id = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const showPassword = ref(false)
const showConfirmPassword = ref(false)

const isSubmitting = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

onMounted(() => {
  id.value = (route.query.id as string) || ''
  if (!id.value) {
    useRouterInstance.push('/login')
  }
})

async function reset() {
  errorMessage.value = ''
  successMessage.value = ''

  if (newPassword.value.length < 6) {
    errorMessage.value = 'Password must be at least 6 characters.'
    return
  }

  if (newPassword.value !== confirmPassword.value) {
    errorMessage.value = 'Passwords do not match.'
    return
  }

  isSubmitting.value = true

  try {
    const response = await fetch('http://localhost:3000/api/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier: id.value, newPassword: newPassword.value })
    })

    const data = await response.json()

    if (data.success) {
      successMessage.value = 'Password reset successfully! Logging you in...'
      localStorage.setItem('user', JSON.stringify(data.user))
      setTimeout(() => {
        useRouterInstance.push('/profile')
      }, 1500)
    } else {
      errorMessage.value = data.error || 'Failed to reset password.'
    }
  } catch (err) {
    errorMessage.value = 'Error resetting password. Please check backend connection.'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<template>
  <div class="auth-view container">
    <div class="auth-box glass-card animate-fade-in-up">
      <div class="auth-header">
        <h2 class="section-heading gold-text">Reset Password</h2>
        <p class="section-subheading">Choose a secure password for your e-Gov Portal account.</p>
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

      <form @submit.prevent="reset" class="auth-form" style="margin-top: 16px;">
        <!-- New Password Input -->
        <div class="form-group">
          <label for="new-password" class="form-label">New Password</label>
          <div class="input-wrap">
            <span class="input-icon">🔑</span>
            <input
              id="new-password"
              v-model="newPassword"
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

        <!-- Confirm Password Input -->
        <div class="form-group">
          <label for="confirm-password" class="form-label">Confirm New Password</label>
          <div class="input-wrap">
            <span class="input-icon">🔒</span>
            <input
              id="confirm-password"
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

        <button type="submit" :disabled="isSubmitting" class="gold-btn submit-btn" id="reset-submit-btn">
          <span v-if="isSubmitting" class="spinner"></span>
          Save Password & Sign In
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
