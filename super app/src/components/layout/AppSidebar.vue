<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()

defineProps<{
  collapsed: boolean
}>()

defineEmits<{
  toggle: []
}>()

const navItems = [
  { name: 'Home', path: '/', icon: 'home' },
  { name: 'Services', path: '/services', icon: 'grid' },
  { name: 'Announcements', path: '/announcements', icon: 'bell' },
  { name: 'Profile', path: '/profile', icon: 'user' },
]

function isActive(path: string) {
  return route.path === path
}
</script>

<template>
  <aside class="sidebar" :class="{ 'collapsed': collapsed }">
    <!-- Logo & Toggle Row -->
    <div class="sidebar-logo">
      <div class="logo-seal">
        <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="32" cy="32" r="30" stroke="url(#goldGrad)" stroke-width="2"/>
          <circle cx="32" cy="32" r="22" stroke="url(#goldGrad)" stroke-width="1.5" stroke-dasharray="4 2"/>
          <polygon points="32,10 36,24 50,24 39,33 43,47 32,38 21,47 25,33 14,24 28,24" fill="url(#goldGrad)" opacity="0.9"/>
          <defs>
            <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FFD700"/>
              <stop offset="50%" stop-color="#D4AF37"/>
              <stop offset="100%" stop-color="#B8960C"/>
            </linearGradient>
          </defs>
        </svg>
      </div>
      <div v-if="!collapsed" class="logo-text">
        <span class="logo-name">e-Gov</span>
        <span class="logo-sub">Digital Portal</span>
      </div>

      <!-- Collapse Toggle Button -->
      <button
        class="toggle-btn"
        :class="{ 'collapsed-toggle': collapsed }"
        @click="$emit('toggle')"
        :title="collapsed ? 'Expand Sidebar' : 'Collapse Sidebar'"
        id="sidebar-toggle-btn"
      >
        <svg v-if="collapsed" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
        <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
          <polyline points="15 18 9 12 15 6"/>
        </svg>
      </button>
    </div>

    <!-- Divider -->
    <div class="gold-divider" :style="{ margin: collapsed ? '0 16px 24px' : '0 24px 24px' }"></div>

    <!-- Navigation -->
    <nav class="sidebar-nav">
      <router-link
        v-for="item in navItems"
        :key="item.path"
        :to="item.path"
        class="nav-item"
        :class="{ active: isActive(item.path) }"
        :title="collapsed ? item.name : undefined"
      >
        <!-- Home Icon -->
        <svg v-if="item.icon === 'home'" class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/>
          <polyline points="9 22 9 12 15 12 15 22"/>
        </svg>
        <!-- Grid Icon -->
        <svg v-if="item.icon === 'grid'" class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/>
          <rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>
        </svg>
        <!-- Bell Icon -->
        <svg v-if="item.icon === 'bell'" class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 01-3.46 0"/>
        </svg>
        <!-- User Icon -->
        <svg v-if="item.icon === 'user'" class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        
        <span v-if="!collapsed">{{ item.name }}</span>
        
        <!-- Notifications Count / Dot -->
        <div v-if="item.name === 'Announcements'" class="badge-wrapper">
          <div v-if="!collapsed" class="nav-badge">3</div>
          <div v-else class="nav-badge-dot"></div>
        </div>
      </router-link>
    </nav>

    <!-- Sidebar Footer -->
    <div class="sidebar-footer">
      <div class="sidebar-user">
        <div class="user-avatar">
          <span>CZ</span>
        </div>
        <div v-if="!collapsed" class="user-info">
          <span class="user-name">Citizen Zone</span>
          <span class="user-id">ID: GOV-2026-001</span>
        </div>
      </div>
      <div v-if="!collapsed" class="sidebar-version">
        <span class="badge badge-gold">v2.0</span>
        <span style="font-size: 0.7rem; color: var(--text-muted)">Secure Portal</span>
      </div>
    </div>
  </aside>
</template>

<style scoped>
.sidebar {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: var(--sidebar-width);
  background: var(--navy-900);
  border-right: 1px solid var(--glass-border);
  display: flex;
  flex-direction: column;
  z-index: 100;
  overflow: visible;
  display: none;
  transition: width var(--transition-base), padding var(--transition-base);
}

.sidebar.collapsed {
  width: 80px;
}

@media (min-width: 1024px) {
  .sidebar { display: flex; }
}

/* Logo Section */
.sidebar-logo {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 24px 20px;
  position: relative;
  transition: all var(--transition-base);
}

.sidebar.collapsed .sidebar-logo {
  padding: 24px 0;
  justify-content: center;
}

.logo-seal {
  width: 44px;
  height: 44px;
  flex-shrink: 0;
  animation: spin-slow 20s linear infinite;
  transition: all var(--transition-base);
}

.sidebar.collapsed .logo-seal {
  width: 38px;
  height: 38px;
}

.logo-text {
  display: flex;
  flex-direction: column;
  animation: fadeIn var(--transition-base);
}

.logo-name {
  font-family: 'Outfit', sans-serif;
  font-size: 1.4rem;
  font-weight: 800;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  letter-spacing: -0.02em;
}

.logo-sub {
  font-size: 0.7rem;
  color: var(--text-muted);
  font-weight: 500;
  letter-spacing: 0.1em;
  text-transform: uppercase;
}

/* Toggle Collapse Button */
.toggle-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  background: var(--navy-800);
  border: 1px solid var(--glass-border);
  color: var(--gold-400);
  cursor: pointer;
  transition: all var(--transition-base);
  position: absolute;
  top: 33px;
  right: -13px;
  z-index: 10;
}

.toggle-btn:hover {
  background: var(--gold-gradient);
  color: var(--navy-800);
  border-color: var(--gold-500);
  box-shadow: var(--gold-glow);
}

.sidebar.collapsed .toggle-btn {
  top: 30px;
}

/* Nav Section */
.sidebar-nav {
  flex: 1;
  padding: 0 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  transition: all var(--transition-base);
  overflow-y: auto;
}

.sidebar.collapsed .sidebar-nav {
  padding: 0 16px;
  align-items: center;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: var(--radius-lg);
  color: var(--text-secondary);
  font-family: 'Outfit', sans-serif;
  font-size: 0.95rem;
  font-weight: 500;
  transition: all var(--transition-base);
  cursor: pointer;
  position: relative;
  width: 100%;
}

.sidebar.collapsed .nav-item {
  padding: 12px 0;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 50%;
}

.nav-item:hover {
  background: var(--glass-bg);
  color: var(--text-primary);
}

.nav-item.active {
  background: rgba(212, 175, 55, 0.12);
  color: var(--gold-400);
  border: 1px solid rgba(212, 175, 55, 0.2);
}

.nav-item.active .nav-icon {
  stroke: var(--gold-400);
}

.nav-icon {
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  transition: all var(--transition-base);
}

.badge-wrapper {
  margin-left: auto;
  display: flex;
  align-items: center;
  justify-content: center;
}

.sidebar.collapsed .badge-wrapper {
  position: absolute;
  top: 10px;
  right: 10px;
}

.nav-badge {
  min-width: 20px;
  height: 20px;
  padding: 0 6px;
  background: var(--gold-gradient);
  color: var(--navy-800);
  border-radius: var(--radius-full);
  font-size: 0.7rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-badge-dot {
  width: 8px;
  height: 8px;
  background: #EF4444;
  border-radius: 50%;
  border: 1.5px solid var(--navy-900);
  animation: pulse-gold 2s infinite;
}

/* Footer Section */
.sidebar-footer {
  padding: 20px;
  border-top: 1px solid var(--glass-border);
  display: flex;
  flex-direction: column;
  gap: 12px;
  transition: all var(--transition-base);
}

.sidebar.collapsed .sidebar-footer {
  padding: 20px 0;
  align-items: center;
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 10px;
  transition: all var(--transition-base);
}

.user-avatar {
  width: 36px;
  height: 36px;
  border-radius: var(--radius-full);
  background: var(--gold-gradient);
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: 'Outfit', sans-serif;
  font-size: 0.75rem;
  font-weight: 800;
  color: var(--navy-800);
  flex-shrink: 0;
}

.user-info {
  display: flex;
  flex-direction: column;
  animation: fadeIn var(--transition-base);
}

.user-name {
  font-family: 'Outfit', sans-serif;
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
}

.user-id {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.sidebar-version {
  display: flex;
  align-items: center;
  gap: 8px;
  animation: fadeIn var(--transition-base);
}
</style>
