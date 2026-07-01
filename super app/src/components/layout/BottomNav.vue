<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

const navItems = [
  { name: 'Home', path: '/', icon: 'home' },
  { name: 'Services', path: '/services', icon: 'grid' },
  { name: 'News', path: '/announcements', icon: 'bell' },
  { name: 'Profile', path: '/profile', icon: 'user' },
]

function isActive(path: string) {
  return route.path === path
}
</script>

<template>
  <nav class="bottom-nav">
    <router-link
      v-for="item in navItems"
      :key="item.path"
      :to="item.path"
      class="bottom-nav-item"
      :class="{ active: isActive(item.path) }"
      :id="`bottom-nav-${item.icon}`"
    >
      <div class="nav-icon-wrap">
        <!-- Home -->
        <svg v-if="item.icon === 'home'" class="b-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <!-- Grid -->
        <svg v-if="item.icon === 'grid'" class="b-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
        </svg>
        <!-- Bell -->
        <svg v-if="item.icon === 'bell'" class="b-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 01-3.46 0"/>
        </svg>
        <!-- User -->
        <svg v-if="item.icon === 'user'" class="b-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <!-- Bell notification dot -->
        <span v-if="item.icon === 'bell'" class="notif-dot"></span>
      </div>
      <span class="item-label">{{ item.name }}</span>
      <!-- Active Indicator -->
      <div v-if="isActive(item.path)" class="active-bar"></div>
    </router-link>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: var(--bottom-nav-height);
  background: rgba(10, 22, 40, 0.95);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-top: 1px solid var(--glass-border);
  display: flex;
  align-items: center;
  justify-content: space-around;
  z-index: 200;
  box-shadow: var(--shadow-nav);
}

@media (min-width: 1024px) {
  .bottom-nav { display: none; }
}

.bottom-nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  padding: 8px 20px;
  color: var(--text-muted);
  cursor: pointer;
  transition: all var(--transition-base);
  position: relative;
  flex: 1;
}

.bottom-nav-item:hover {
  color: var(--text-secondary);
}

.bottom-nav-item.active {
  color: var(--gold-400);
}

.nav-icon-wrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.b-icon {
  width: 22px;
  height: 22px;
  transition: all var(--transition-base);
}

.bottom-nav-item.active .b-icon {
  stroke: var(--gold-400);
  filter: drop-shadow(0 0 6px rgba(212, 175, 55, 0.5));
}

.item-label {
  font-family: 'Outfit', sans-serif;
  font-size: 0.65rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: all var(--transition-base);
}

.bottom-nav-item.active .item-label {
  color: var(--gold-400);
}

.notif-dot {
  position: absolute;
  top: -3px;
  right: -3px;
  width: 8px;
  height: 8px;
  background: #EF4444;
  border-radius: 50%;
  border: 2px solid var(--navy-800);
  animation: pulse-gold 2s infinite;
}

.active-bar {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: 24px;
  height: 2px;
  background: var(--gold-gradient);
  border-radius: 0 0 var(--radius-full) var(--radius-full);
}
</style>
