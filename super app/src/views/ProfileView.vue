<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const citizenName = ref('Citizen Zone')
const citizenId = ref('GOV-2026-001')
const citizenEmail = ref('citizen@egov.portal')

onMounted(() => {
  const userSession = localStorage.getItem('user')
  if (userSession) {
    try {
      const user = JSON.parse(userSession)
      citizenName.value = user.name || 'Citizen'
      citizenId.value = user.id || 'GOV-2026-001'
      citizenEmail.value = user.identifier || 'citizen@egov.portal'
    } catch (e) {
      console.error('Error parsing user session', e)
    }
  }
})

function logout() {
  localStorage.removeItem('user')
  router.push('/login')
}

const applications = [
  { id: 'APP-2026-0891', type: '📋 National ID Renewal', status: 'processing', step: 2, total: 4, date: 'Jun 25, 2026', label: 'Processing' },
  { id: 'APP-2026-0744', type: '🌐 Passport Application', status: 'approved', step: 4, total: 4, date: 'Jun 10, 2026', label: 'Approved ✓' },
  { id: 'APP-2026-0612', type: '💰 Tax Filing 2025', status: 'submitted', step: 1, total: 3, date: 'May 30, 2026', label: 'Submitted' },
]

const menuItems = [
  { icon: '📄', label: 'My Documents', desc: 'View all your documents' },
  { icon: '🔔', label: 'Notifications', desc: '3 unread messages', badge: '3' },
  { icon: '🔒', label: 'Security Settings', desc: 'Password & 2FA' },
  { icon: '🌐', label: 'Language', desc: 'English (EN)' },
  { icon: '🆘', label: 'Help & Support', desc: 'Get assistance' },
  { icon: '📞', label: 'Contact Us', desc: 'Reach our team' },
]

function statusColor(status: string) {
  if (status === 'approved') return 'rgba(34,197,94,0.15)'
  if (status === 'processing') return 'rgba(212,175,55,0.15)'
  return 'rgba(59,130,246,0.15)'
}

function statusTextColor(status: string) {
  if (status === 'approved') return '#86EFAC'
  if (status === 'processing') return '#D4AF37'
  return '#93C5FD'
}
</script>

<template>
  <div class="profile-view">
    <!-- Profile Hero -->
    <div class="profile-hero">
      <div class="container">
        <div class="profile-card glass-card">
          <!-- Avatar -->
          <div class="profile-avatar-wrap">
            <div class="profile-avatar">{{ citizenName.slice(0, 2).toUpperCase() }}</div>
            <div class="avatar-verified">✓</div>
          </div>

          <!-- Info -->
          <div class="profile-info">
            <h1 class="profile-name">{{ citizenName }}</h1>
            <p class="profile-id">
              <span class="badge badge-gold">{{ citizenId }}</span>
            </p>
            <p class="profile-email">{{ citizenEmail }}</p>
          </div>


          <!-- Stats -->
          <div class="profile-stats">
            <div class="pstat">
              <span class="pstat-num">3</span>
              <span class="pstat-lbl">Applications</span>
            </div>
            <div class="pstat-divider"></div>
            <div class="pstat">
              <span class="pstat-num">8</span>
              <span class="pstat-lbl">Documents</span>
            </div>
            <div class="pstat-divider"></div>
            <div class="pstat">
              <span class="pstat-num">Gold</span>
              <span class="pstat-lbl">Tier</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="container profile-content">
      <!-- My Applications — GrabFood Order Tracker style -->
      <section class="section" id="my-applications">
        <h2 class="section-title">My <span>Applications</span></h2>
        <div class="gold-divider"></div>

        <div class="applications-list">
          <div
            v-for="app in applications"
            :key="app.id"
            class="app-track-card glass-card"
          >
            <div class="app-top">
              <div>
                <span class="app-type">{{ app.type }}</span>
                <span class="app-id">{{ app.id }}</span>
              </div>
              <span
                class="app-status badge"
                :style="{ background: statusColor(app.status), color: statusTextColor(app.status) }"
              >
                {{ app.label }}
              </span>
            </div>

            <!-- Progress Bar -->
            <div class="progress-track">
              <div
                v-for="step in app.total"
                :key="step"
                class="progress-step"
                :class="{ done: step <= app.step, active: step === app.step }"
              >
                <div class="step-dot"></div>
                <div v-if="step < app.total" class="step-line"></div>
              </div>
            </div>

            <div class="app-footer">
              <span class="app-date">📅 Submitted: {{ app.date }}</span>
              <span class="app-steps">Step {{ app.step }} of {{ app.total }}</span>
            </div>
          </div>
        </div>
      </section>

      <!-- Menu Items -->
      <section class="section" id="profile-menu">
        <h2 class="section-title">Account <span>Settings</span></h2>
        <div class="gold-divider"></div>

        <div class="menu-list">
          <button
            v-for="item in menuItems"
            :key="item.label"
            class="menu-item glass-card"
            :id="`menu-${item.label.toLowerCase().replace(/\s+/g, '-')}`"
          >
            <span class="menu-icon">{{ item.icon }}</span>
            <div class="menu-body">
              <span class="menu-label">{{ item.label }}</span>
              <span class="menu-desc">{{ item.desc }}</span>
            </div>
            <div class="menu-right">
              <span v-if="item.badge" class="menu-badge">{{ item.badge }}</span>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16" class="menu-arrow">
                <polyline points="9 18 15 12 9 6"/>
              </svg>
            </div>
          </button>
        </div>
      </section>

      <!-- Sign Out -->
      <button class="signout-btn" id="signout-btn" @click="logout">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
          <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
        Sign Out
      </button>

    </div>
  </div>
</template>

<style scoped>
.profile-view { min-height: 100vh; padding-bottom: var(--space-3xl); }

/* Hero */
.profile-hero {
  padding: var(--space-xl) 0;
  background: linear-gradient(180deg, rgba(212,175,55,0.08) 0%, transparent 100%);
  border-bottom: 1px solid var(--glass-border);
  margin-bottom: var(--space-xl);
}

.profile-card {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
  padding: var(--space-xl);
  flex-wrap: wrap;
}

/* Avatar */
.profile-avatar-wrap {
  position: relative;
  flex-shrink: 0;
}

.profile-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  background: var(--gold-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Outfit', sans-serif;
  font-size: 1.4rem;
  font-weight: 900;
  color: var(--navy-800);
  box-shadow: var(--gold-glow);
}

.avatar-verified {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 22px;
  height: 22px;
  background: var(--gold-gradient);
  border-radius: 50%;
  border: 2px solid var(--navy-800);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.6rem;
  font-weight: 900;
  color: var(--navy-800);
}

/* Info */
.profile-info { flex: 1; min-width: 0; }

.profile-name {
  font-family: 'Outfit', sans-serif;
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: 6px;
}

.profile-id { margin-bottom: 4px; }

.profile-email {
  font-size: 0.82rem;
  color: var(--text-muted);
}

/* Stats */
.profile-stats {
  display: flex;
  align-items: center;
  gap: var(--space-lg);
}

.pstat {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.pstat-num {
  font-family: 'Outfit', sans-serif;
  font-size: 1.3rem;
  font-weight: 800;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.pstat-lbl {
  font-size: 0.68rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.pstat-divider {
  width: 1px;
  height: 32px;
  background: var(--glass-border);
}

/* Content */
.profile-content {
  display: flex;
  flex-direction: column;
  gap: var(--space-xl);
}

.section { }

/* Applications */
.applications-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

.app-track-card {
  padding: 16px 20px;
}

.app-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 14px;
}

.app-type {
  display: block;
  font-family: 'Outfit', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
}

.app-id {
  display: block;
  font-size: 0.72rem;
  color: var(--text-muted);
  margin-top: 2px;
}

.app-status {
  border: 1px solid transparent;
  flex-shrink: 0;
}

/* Progress Tracker (like GrabFood order tracker) */
.progress-track {
  display: flex;
  align-items: center;
  margin-bottom: 12px;
}

.progress-step {
  display: flex;
  align-items: center;
  flex: 1;
}

.progress-step:last-child { flex: none; }

.step-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid var(--navy-400);
  background: var(--navy-700);
  flex-shrink: 0;
  transition: all var(--transition-base);
}

.progress-step.done .step-dot {
  background: var(--gold-gradient);
  border-color: var(--gold-500);
  box-shadow: 0 0 8px rgba(212, 175, 55, 0.4);
}

.progress-step.active .step-dot {
  animation: pulse-gold 1.5s infinite;
  border-color: var(--gold-400);
  background: rgba(212, 175, 55, 0.3);
}

.step-line {
  flex: 1;
  height: 2px;
  background: var(--navy-400);
  transition: all var(--transition-base);
}

.progress-step.done .step-line {
  background: var(--gold-gradient);
}

.app-footer {
  display: flex;
  justify-content: space-between;
  font-size: 0.75rem;
  color: var(--text-muted);
}

/* Menu */
.menu-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
}

.menu-item {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 14px 16px;
  cursor: pointer;
  width: 100%;
  text-align: left;
  transition: all var(--transition-base);
}

.menu-icon {
  font-size: 1.3rem;
  flex-shrink: 0;
  width: 32px;
  text-align: center;
}

.menu-body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.menu-label {
  font-family: 'Outfit', sans-serif;
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--text-primary);
}

.menu-desc {
  font-size: 0.75rem;
  color: var(--text-muted);
}

.menu-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.menu-badge {
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: #EF4444;
  color: white;
  border-radius: var(--radius-full);
  font-size: 0.65rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.menu-arrow {
  color: var(--text-muted);
  transition: transform var(--transition-base);
}

.menu-item:hover .menu-arrow {
  transform: translateX(3px);
  color: var(--gold-400);
}

/* Sign out */
.signout-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  width: 100%;
  padding: 14px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: var(--radius-xl);
  color: #FCA5A5;
  font-family: 'Outfit', sans-serif;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-base);
}

.signout-btn:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.4);
}
</style>
