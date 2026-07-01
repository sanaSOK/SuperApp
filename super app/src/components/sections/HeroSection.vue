<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const currentTime = ref('')
const currentDate = ref('')

function updateTime() {
  const now = new Date()
  currentTime.value = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })
  currentDate.value = now.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
}

onMounted(() => {
  updateTime()
  setInterval(updateTime, 1000)
})

const quickLinks = [
  { icon: '📋', label: 'Apply Document' },
  { icon: '💳', label: 'Pay Tax' },
  { icon: '🏥', label: 'Health Service' },
  { icon: '🎓', label: 'Education' },
]

function handleGetStarted() {
  router.push('/login')
}
</script>

<template>
  <section class="hero-section" id="hero-section">
    <!-- Animated Background Orbs -->
    <div class="hero-bg">
      <div class="orb orb-1"></div>
      <div class="orb orb-2"></div>
      <div class="orb orb-3"></div>
    </div>

    <div class="hero-content container">
      <!-- Left Content -->
      <div class="hero-left">
        <!-- Greeting -->
        <div class="hero-greeting animate-fade-in-up">
          <span class="badge badge-gold">🏛️ Official Government Portal</span>
        </div>

        <h1 class="hero-title animate-fade-in-up" style="animation-delay: 0.1s">
          Your Gateway to<br />
          <span class="gold-text">Digital Government</span><br />
          Services
        </h1>

        <p class="hero-subtitle animate-fade-in-up" style="animation-delay: 0.2s">
          Access all government services securely and efficiently.
          Designed for citizens, built for the future.
        </p>

        <!-- CTA Buttons -->
        <div class="hero-actions animate-fade-in-up" style="animation-delay: 0.3s">
          <button class="gold-btn" id="hero-get-started" @click="handleGetStarted">
            Get Started
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
              <polyline points="9 18 15 12 9 6"/>
            </svg>
          </button>

          <button class="ghost-btn" id="hero-learn-more">
            Learn More
          </button>
        </div>

        <!-- Quick Links -->
        <div class="quick-links animate-fade-in-up" style="animation-delay: 0.4s">
          <span class="quick-label">Quick Access:</span>
          <div class="quick-chips">
            <button
              v-for="link in quickLinks"
              :key="link.label"
              class="quick-chip"
              :id="`quick-${link.label.toLowerCase().replace(/\s+/g, '-')}`"
            >
              {{ link.icon }} {{ link.label }}
            </button>
          </div>
        </div>
      </div>

      <!-- Right: Animated Seal -->
      <div class="hero-right animate-fade-in" style="animation-delay: 0.2s">
        <div class="seal-container">
          <!-- Outer ring - slow spin -->
          <div class="seal-ring ring-outer">
            <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="100" cy="100" r="95" stroke="url(#ringGold1)" stroke-width="1.5" stroke-dasharray="8 4"/>
              <defs>
                <linearGradient id="ringGold1" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#FFD700" stop-opacity="0.8"/>
                  <stop offset="100%" stop-color="#B8960C" stop-opacity="0.3"/>
                </linearGradient>
              </defs>
            </svg>
          </div>

          <!-- Middle ring - reverse spin -->
          <div class="seal-ring ring-mid">
            <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="80" cy="80" r="75" stroke="url(#ringGold2)" stroke-width="2" stroke-dasharray="12 6"/>
              <defs>
                <linearGradient id="ringGold2" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#FFD700"/>
                  <stop offset="100%" stop-color="#D4AF37" stop-opacity="0.5"/>
                </linearGradient>
              </defs>
            </svg>
          </div>

          <!-- Core Seal -->
          <div class="seal-core">
            <svg viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg" width="120" height="120">
              <circle cx="60" cy="60" r="56" fill="url(#sealBg)" stroke="url(#sealBorder)" stroke-width="2"/>
              <!-- Stars decoration -->
              <circle cx="60" cy="60" r="38" fill="none" stroke="url(#sealBorder)" stroke-width="1" opacity="0.4"/>
              <!-- Crown / Star shape -->
              <polygon
                points="60,18 65,38 82,34 72,50 86,62 66,62 60,80 54,62 34,62 48,50 38,34 55,38"
                fill="url(#starGold)"
              />
              <!-- Text arc placeholder - bottom text -->
              <text x="60" y="100" text-anchor="middle" font-family="Outfit" font-size="7" fill="#D4AF37" font-weight="600" letter-spacing="2">
                GOV • DIGITAL • PORTAL
              </text>
              <defs>
                <radialGradient id="sealBg" cx="50%" cy="40%" r="60%">
                  <stop offset="0%" stop-color="#122444"/>
                  <stop offset="100%" stop-color="#04090F"/>
                </radialGradient>
                <linearGradient id="sealBorder" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#FFD700"/>
                  <stop offset="100%" stop-color="#B8960C"/>
                </linearGradient>
                <linearGradient id="starGold" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stop-color="#FFD700"/>
                  <stop offset="50%" stop-color="#D4AF37"/>
                  <stop offset="100%" stop-color="#B8960C"/>
                </linearGradient>
              </defs>
            </svg>
          </div>

          <!-- Floating stats around seal -->
          <div class="float-stat stat-tl">
            <span class="float-num">4.2M</span>
            <span class="float-lbl">Citizens</span>
          </div>
          <div class="float-stat stat-tr">
            <span class="float-num">180+</span>
            <span class="float-lbl">Services</span>
          </div>
          <div class="float-stat stat-br">
            <span class="float-num">24/7</span>
            <span class="float-lbl">Available</span>
          </div>
        </div>

        <!-- Live Clock -->
        <div class="hero-clock">
          <div class="clock-time">{{ currentTime }}</div>
          <div class="clock-date">{{ currentDate }}</div>
        </div>
      </div>
    </div>

    <!-- Announcement Ticker -->
    <div class="ticker-wrap">
      <div class="ticker-label">
        <span>📢 LIVE</span>
      </div>
      <div class="ticker-track">
        <div class="ticker-inner">
          <span>System maintenance scheduled for 02:00–04:00 on July 5, 2026</span>
          <span class="ticker-sep">•</span>
          <span>New e-passport application portal is now LIVE — Apply Online Today</span>
          <span class="ticker-sep">•</span>
          <span>Tax submission deadline extended to August 31, 2026</span>
          <span class="ticker-sep">•</span>
          <span>Healthcare subsidy applications open until July 15, 2026</span>
          <span class="ticker-sep">•</span>
          <span>System maintenance scheduled for 02:00–04:00 on July 5, 2026</span>
          <span class="ticker-sep">•</span>
          <span>New e-passport application portal is now LIVE — Apply Online Today</span>
          <span class="ticker-sep">•</span>
          <span>Tax submission deadline extended to August 31, 2026</span>
          <span class="ticker-sep">•</span>
          <span>Healthcare subsidy applications open until July 15, 2026</span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.hero-section {
  position: relative;
  overflow: hidden;
  border-bottom: 1px solid var(--glass-border);
}

/* Animated background orbs */
.hero-bg {
  position: absolute;
  inset: 0;
  pointer-events: none;
  z-index: 0;
}

.orb {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.12;
}

.orb-1 {
  width: 400px; height: 400px;
  background: var(--gold-500);
  top: -100px; right: -100px;
  animation: float 8s ease-in-out infinite;
}

.orb-2 {
  width: 300px; height: 300px;
  background: var(--gold-400);
  bottom: -50px; left: -50px;
  animation: float 10s ease-in-out infinite reverse;
}

.orb-3 {
  width: 200px; height: 200px;
  background: #3B82F6;
  top: 50%; left: 40%;
  opacity: 0.06;
  animation: float 6s ease-in-out infinite;
}

.hero-content {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-3xl);
  align-items: center;
  padding: var(--space-3xl) var(--space-md);
  position: relative;
  z-index: 1;
}

@media (max-width: 900px) {
  .hero-content {
    grid-template-columns: 1fr;
    gap: var(--space-2xl);
    padding: var(--space-2xl) var(--space-md);
  }
  .hero-right { order: -1; }
}

/* Left */
.hero-greeting { margin-bottom: 16px; }

.hero-title {
  font-family: 'Outfit', sans-serif;
  font-size: clamp(2rem, 4vw, 3.2rem);
  font-weight: 900;
  color: var(--text-primary);
  line-height: 1.1;
  margin-bottom: 16px;
  letter-spacing: -0.03em;
}

.hero-subtitle {
  font-size: clamp(0.9rem, 1.5vw, 1rem);
  color: var(--text-secondary);
  line-height: 1.7;
  margin-bottom: 28px;
  max-width: 460px;
}

.hero-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 28px;
}

.quick-links {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.quick-label {
  font-size: 0.78rem;
  color: var(--text-muted);
  white-space: nowrap;
}

.quick-chips {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.quick-chip {
  padding: 5px 12px;
  border-radius: var(--radius-full);
  font-family: 'Outfit', sans-serif;
  font-size: 0.75rem;
  font-weight: 600;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-base);
  white-space: nowrap;
}

.quick-chip:hover {
  background: rgba(212, 175, 55, 0.1);
  border-color: var(--gold-500);
  color: var(--gold-400);
}

/* Right - Seal */
.hero-right {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
}

.seal-container {
  position: relative;
  width: 280px;
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.seal-ring {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring-outer {
  width: 100%; height: 100%;
  animation: spin-slow 30s linear infinite;
}

.ring-mid {
  width: 75%; height: 75%;
  animation: spin-slow 20s linear infinite reverse;
}

.seal-core {
  position: relative;
  z-index: 5;
  filter: drop-shadow(var(--gold-glow));
  animation: float 4s ease-in-out infinite;
}

/* Floating stats */
.float-stat {
  position: absolute;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  backdrop-filter: blur(12px);
  border-radius: var(--radius-lg);
  padding: 8px 12px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 10;
  animation: float 3s ease-in-out infinite;
}

.stat-tl { top: 20px; left: -10px; animation-delay: 0.5s; }
.stat-tr { top: 20px; right: -10px; animation-delay: 1s; }
.stat-br { bottom: 30px; right: -10px; animation-delay: 1.5s; }

.float-num {
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  font-weight: 800;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.float-lbl {
  font-size: 0.65rem;
  color: var(--text-muted);
  font-weight: 500;
}

/* Clock */
.hero-clock {
  text-align: center;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  padding: 14px 28px;
  backdrop-filter: blur(12px);
}

.clock-time {
  font-family: 'Outfit', sans-serif;
  font-size: 2rem;
  font-weight: 800;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1;
}

.clock-date {
  font-size: 0.72rem;
  color: var(--text-muted);
  margin-top: 4px;
}

/* Ticker */
.ticker-wrap {
  display: flex;
  align-items: center;
  background: rgba(212, 175, 55, 0.06);
  border-top: 1px solid var(--glass-border);
  overflow: hidden;
  height: 40px;
}

.ticker-label {
  flex-shrink: 0;
  padding: 0 16px;
  height: 100%;
  display: flex;
  align-items: center;
  background: rgba(212, 175, 55, 0.15);
  border-right: 1px solid var(--glass-border);
}

.ticker-label span {
  font-family: 'Outfit', sans-serif;
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--gold-400);
  letter-spacing: 0.05em;
  white-space: nowrap;
}

.ticker-track {
  flex: 1;
  overflow: hidden;
  position: relative;
}

.ticker-inner {
  display: flex;
  gap: 24px;
  white-space: nowrap;
  animation: ticker 40s linear infinite;
  font-size: 0.8rem;
  color: var(--text-secondary);
  align-items: center;
  padding: 0 24px;
}

.ticker-sep {
  color: var(--gold-500);
  font-size: 1.2rem;
}
</style>
