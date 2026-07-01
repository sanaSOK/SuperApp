<script setup lang="ts">
import AnnouncementCard from '../components/ui/AnnouncementCard.vue'

const announcements = [
  {
    title: 'E-Passport Application Portal Now Available Online',
    summary: 'Citizens can now apply for new and renewal passports entirely online. The new system allows upload of required documents and online payment, reducing wait times by 80%. Visit the official immigration portal to get started.',
    date: 'Jun 29, 2026',
    category: 'Immigration',
    priority: 'urgent' as const,
    isNew: true,
  },
  {
    title: 'New Digital National Identity Card (MyDigital ID) Program Launched',
    summary: 'The government has officially launched the MyDigital ID program, enabling all citizens to carry a verified digital identity on their smartphones. This can be used for all government transactions.',
    date: 'Jun 29, 2026',
    category: 'Digital Services',
    isNew: true,
  },
  {
    title: 'Tax Submission Deadline Extended to August 31, 2026',
    summary: 'The Revenue Department has extended the personal income tax filing deadline by one month. Citizens are encouraged to use the online e-Filing system available on this portal for a faster and more convenient experience.',
    date: 'Jun 28, 2026',
    category: 'Finance',
    isNew: true,
  },
  {
    title: 'Healthcare Subsidy for Low-Income Families — Applications Open',
    summary: 'A new government healthcare subsidy program is now accepting applications. Eligible families earning below the national poverty threshold can receive monthly medical support worth up to $200 per month.',
    date: 'Jun 25, 2026',
    category: 'Health',
    priority: 'info' as const,
  },
  {
    title: 'Government Scholarship Applications for 2026/2027 Academic Year',
    summary: 'The Education Ministry is now accepting scholarship applications for the upcoming academic year. Scholarships are available for undergraduate, postgraduate, and STEM fields. Application deadline: July 31, 2026.',
    date: 'Jun 22, 2026',
    category: 'Education',
  },
  {
    title: 'Vehicle Road Tax Renewal Now Available 24/7 Online',
    summary: 'Citizens can now renew their vehicle road tax at any time through the official government portal. Stickers will be delivered by mail within 3-5 working days. Accept all major payment methods.',
    date: 'Jun 20, 2026',
    category: 'Transport',
  },
  {
    title: 'Scheduled System Maintenance — July 5, 2026 (02:00–04:00)',
    summary: 'The e-Gov Portal will undergo scheduled maintenance on July 5, 2026 from 02:00 AM to 04:00 AM. All services will be temporarily unavailable during this period.',
    date: 'Jun 18, 2026',
    category: 'System',
    priority: 'urgent' as const,
  },
  {
    title: 'New Public Housing Application Cycle Now Open',
    summary: 'The Ministry of Housing has announced the new cycle for public housing applications. Priority will be given to first-time applicants, newlyweds, and low-income families.',
    date: 'Jun 15, 2026',
    category: 'Housing',
    priority: 'info' as const,
  },
]

const filters = ['All', 'Immigration', 'Finance', 'Health', 'Education', 'Transport', 'Housing', 'System']
import { ref } from 'vue'
const active = ref('All')
const filtered = ref(announcements)

function setFilter(f: string) {
  active.value = f
  if (f === 'All') {
    filtered.value = announcements
  } else {
    filtered.value = announcements.filter(a => a.category === f)
  }
}
</script>

<template>
  <div class="announcements-view">
    <!-- Page Header -->
    <div class="page-header">
      <div class="container">
        <div class="header-content">
          <div>
            <h1 class="page-title-text">Announcements & <span class="gold-text">News</span></h1>
            <p class="page-subtitle">Official government announcements and updates</p>
          </div>
          <div class="badge badge-gold">📢 {{ announcements.length }} Updates</div>
        </div>

        <!-- Filter Chips -->
        <div class="filter-chips">
          <button
            v-for="f in filters"
            :key="f"
            class="filter-chip"
            :class="{ active: active === f }"
            :id="`ann-filter-${f.toLowerCase()}`"
            @click="setFilter(f)"
          >
            {{ f }}
          </button>
        </div>
      </div>
    </div>

    <div class="container">
      <transition-group name="list" tag="div" class="ann-list">
        <AnnouncementCard
          v-for="(item, i) in filtered"
          :key="item.title"
          v-bind="item"
          :style="{ animationDelay: `${i * 0.05}s` }"
          class="animate-fade-in-up"
        />
      </transition-group>

      <div v-if="filtered.length === 0" class="empty-state">
        <span>📭</span>
        <p>No announcements in this category.</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.announcements-view { min-height: 100vh; padding-bottom: var(--space-3xl); }

.page-header {
  padding: var(--space-xl) 0 var(--space-lg);
  background: linear-gradient(180deg, rgba(212,175,55,0.06) 0%, transparent 100%);
  border-bottom: 1px solid var(--glass-border);
  margin-bottom: var(--space-xl);
}

.header-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--space-md);
}

.page-title-text {
  font-family: 'Outfit', sans-serif;
  font-size: clamp(1.5rem, 3vw, 2.2rem);
  font-weight: 900;
  color: var(--text-primary);
  letter-spacing: -0.02em;
}

.page-subtitle {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: 4px;
}

.filter-chips {
  display: flex;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 4px;
  scrollbar-width: none;
}
.filter-chips::-webkit-scrollbar { display: none; }

.filter-chip {
  padding: 6px 16px;
  border-radius: var(--radius-full);
  font-family: 'Outfit', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  white-space: nowrap;
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-base);
  flex-shrink: 0;
}

.filter-chip:hover { background: var(--glass-bg-hover); color: var(--text-primary); }
.filter-chip.active {
  background: rgba(212, 175, 55, 0.15);
  border-color: var(--gold-500);
  color: var(--gold-400);
}

.ann-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.list-enter-active,
.list-leave-active { transition: all 0.3s ease; }
.list-enter-from { opacity: 0; transform: translateY(10px); }
.list-leave-to { opacity: 0; transform: translateY(-10px); }

.empty-state {
  text-align: center;
  padding: var(--space-3xl);
  color: var(--text-muted);
  font-size: 3rem;
}

.empty-state p { font-size: 1rem; margin-top: 12px; }
</style>
