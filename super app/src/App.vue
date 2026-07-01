<script setup lang="ts">
import { ref } from 'vue'
import AppSidebar from './components/layout/AppSidebar.vue'
import BottomNav from './components/layout/BottomNav.vue'
import AppHeader from './components/layout/AppHeader.vue'

const isCollapsed = ref(false)
</script>

<template>
  <div class="app-shell" :class="{ 'sidebar-collapsed': isCollapsed }">
    <!-- Desktop Sidebar -->
    <AppSidebar :collapsed="isCollapsed" @toggle="isCollapsed = !isCollapsed" />

    <!-- Main Content -->
    <div class="main-content">
      <!-- Mobile Header -->
      <AppHeader />

      <!-- Page Content -->
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </div>

    <!-- Mobile Bottom Navigation -->
    <BottomNav />
  </div>
</template>

<style>
.app-shell {
  display: flex;
  min-height: 100vh;
  width: 100%;
}

.main-content {
  flex: 1;
  min-height: 100vh;
  padding-bottom: var(--bottom-nav-height);
  overflow-x: hidden;
  transition: margin-left var(--transition-base);
}

@media (min-width: 1024px) {
  .main-content {
    margin-left: var(--sidebar-width);
    padding-bottom: 0;
  }

  .sidebar-collapsed .main-content {
    margin-left: 80px;
  }
}

/* Page transitions */
.page-enter-active,
.page-leave-active {
  transition: opacity 0.25s ease, transform 0.25s ease;
}

.page-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>

