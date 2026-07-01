<script setup lang="ts">
import { useRoute } from 'vue-router'
import { computed } from 'vue'

const route = useRoute()

const pageTitle = computed(() => {
  const titles: Record<string, string> = {
    '/': 'Dashboard',
    '/services': 'All Services',
    '/announcements': 'Announcements',
    '/profile': 'My Profile',
  }
  return titles[route.path] || 'e-Gov Portal'
})
</script>

<template>
  <header class="app-header" id="app-header">
    <!-- Left: Logo -->
    <div class="header-left">
      <div class="mobile-logo">
        <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" width="28" height="28">
          <circle cx="16" cy="16" r="14" stroke="url(#hGold)" stroke-width="1.5"/>
          <polygon points="16,5 18,12 25,12 19,17 21,24 16,19 11,24 13,17 7,12 14,12" fill="url(#hGold)"/>
          <defs>
            <linearGradient id="hGold" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stop-color="#FFD700"/>
              <stop offset="100%" stop-color="#B8960C"/>
            </linearGradient>
          </defs>
        </svg>
        <span class="mobile-logo-text">e-Gov</span>
      </div>
    </div>

    <!-- Center: Page Title -->
    <div class="header-center">
      <h1 class="page-title">{{ pageTitle }}</h1>
    </div>

    <!-- Right: Actions -->
    <div class="header-right">
      <button class="header-action" id="header-search-btn" title="Search">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
          <circle cx="11" cy="11" r="8"/>
          <line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
      </button>
      <button class="header-action header-notif" id="header-notif-btn" title="Notifications">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="20" height="20">
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9"/>
          <path d="M13.73 21a2 2 0 01-3.46 0"/>
        </svg>
        <span class="notif-count">3</span>
      </button>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 150;
  height: var(--header-height);
  background: rgba(10, 22, 40, 0.9);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--glass-border);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--space-md);
}

@media (min-width: 1024px) {
  .app-header { display: none; }
}

.header-left { flex: 1; }

.mobile-logo {
  display: flex;
  align-items: center;
  gap: 8px;
}

.mobile-logo-text {
  font-family: 'Outfit', sans-serif;
  font-size: 1.2rem;
  font-weight: 800;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-center { flex: 2; text-align: center; }

.page-title {
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  letter-spacing: -0.01em;
}

.header-right {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}

.header-action {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  color: var(--text-secondary);
  transition: all var(--transition-base);
  position: relative;
}

.header-action:hover {
  background: var(--glass-bg-hover);
  color: var(--gold-400);
  border-color: var(--glass-border-hover);
}

.notif-count {
  position: absolute;
  top: -4px;
  right: -4px;
  min-width: 16px;
  height: 16px;
  padding: 0 4px;
  background: #EF4444;
  color: white;
  border-radius: var(--radius-full);
  font-size: 0.6rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1.5px solid var(--navy-800);
}
</style>
