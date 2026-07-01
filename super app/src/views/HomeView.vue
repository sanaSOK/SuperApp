<script setup lang="ts">
import HeroSection from '../components/sections/HeroSection.vue'
import ServicesGrid from '../components/sections/ServicesGrid.vue'
import AnnouncementsSection from '../components/sections/AnnouncementsSection.vue'
import NearbySection from '../components/sections/NearbySection.vue'
import StatsBanner from '../components/ui/StatsBanner.vue'
</script>

<template>
  <div class="home-view">
    <!-- Hero -->
    <HeroSection />

    <!-- Page Content -->
    <div class="home-content container">
      <!-- Stats -->
      <StatsBanner />

      <!-- Services Grid -->
      <ServicesGrid />

      <!-- Announcements -->
      <AnnouncementsSection />

      <!-- Nearby -->
      <NearbySection />
    </div>
  </div>
</template>

<style scoped>
.home-view {
  min-height: 100vh;
}

.home-content {
  padding-top: var(--space-xl);
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}
</style>
