<script setup lang="ts">
import AnnouncementCard from '../ui/AnnouncementCard.vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const announcements = [
  {
    title: 'E-Passport Application Portal Now Available Online',
    summary: 'Citizens can now apply for new and renewal passports entirely online. The new system allows upload of required documents and online payment, reducing wait times by 80%.',
    date: 'Jun 29, 2026',
    category: 'Immigration',
    priority: 'urgent' as const,
    isNew: true,
  },
  {
    title: 'Tax Submission Deadline Extended to August 31',
    summary: 'The Revenue Department has extended the personal income tax filing deadline. Citizens are encouraged to use the online e-Filing system for convenience.',
    date: 'Jun 28, 2026',
    category: 'Finance',
    isNew: true,
  },
  {
    title: 'Healthcare Subsidy for Low-Income Families — Applications Open',
    summary: 'A new government healthcare subsidy program is now accepting applications. Eligible families earning below the national threshold can receive monthly medical support.',
    date: 'Jun 25, 2026',
    category: 'Health',
    priority: 'info' as const,
  },
]
</script>

<template>
  <section class="announcements-section" id="announcements-section">
    <!-- Header -->
    <div class="section-header">
      <div>
        <h2 class="section-title">Latest <span>Announcements</span></h2>
        <div class="gold-divider"></div>
      </div>
      <button class="ghost-btn" id="view-all-announcements" style="padding: 8px 18px; font-size: 0.82rem;" @click="router.push('/announcements')">
        View All
      </button>
    </div>

    <!-- Cards -->
    <div class="announce-grid">
      <AnnouncementCard
        v-for="(item, i) in announcements"
        :key="i"
        v-bind="item"
      />
    </div>
  </section>
</template>

<style scoped>
.announcements-section {
  padding: var(--space-xl) 0;
}

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: var(--space-lg);
}

.announce-grid {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

@media (min-width: 1024px) {
  .announce-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }

  .announce-grid > *:first-child {
    grid-column: 1 / -1;
  }
}
</style>
