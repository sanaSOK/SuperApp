<script setup lang="ts">
import ServiceCard from '../ui/ServiceCard.vue'

const categories = [
  {
    icon: '📋',
    title: 'Document Services',
    description: 'ID, Passport, Birth Cert, Marriage Cert',
    color: 'rgba(212,175,55,0.15)',
    badge: 'Popular',
  },
  {
    icon: '🏥',
    title: 'Health Services',
    description: 'Medical registration, subsidies & records',
    color: 'rgba(34,197,94,0.12)',
  },
  {
    icon: '🎓',
    title: 'Education',
    description: 'Scholarships, enrollment & certificates',
    color: 'rgba(59,130,246,0.12)',
  },
  {
    icon: '💼',
    title: 'Employment',
    description: 'Job portals, benefits & licensing',
    color: 'rgba(168,85,247,0.12)',
    badge: 'New',
  },
  {
    icon: '🏠',
    title: 'Housing',
    description: 'Permits, registrations & utilities',
    color: 'rgba(249,115,22,0.12)',
  },
  {
    icon: '💰',
    title: 'Finance & Tax',
    description: 'Tax filing, payments & subsidies',
    color: 'rgba(236,72,153,0.12)',
  },
  {
    icon: '🚗',
    title: 'Transport',
    description: 'Driving license, vehicle registration',
    color: 'rgba(14,165,233,0.12)',
  },
  {
    icon: '🛡️',
    title: 'Legal & Security',
    description: 'Court services, police reports',
    color: 'rgba(239,68,68,0.12)',
  },
]

const featured = [
  { icon: '🌐', label: 'MyDigital ID', desc: 'Verify your identity online', color: '#D4AF37' },
  { icon: '📲', label: 'e-Passport', desc: 'Apply in minutes', color: '#10B981' },
  { icon: '🏦', label: 'GovPay', desc: 'Pay all bills in one place', color: '#3B82F6' },
]
</script>

<template>
  <section class="services-section" id="services-section">
    <!-- Featured Services (GrabFood Banner style) -->
    <div class="featured-row">
      <div
        v-for="item in featured"
        :key="item.label"
        class="featured-card glass-card"
        :id="`featured-${item.label.toLowerCase().replace(/\s+/g, '-')}`"
      >
        <div class="featured-icon" :style="{ color: item.color }">{{ item.icon }}</div>
        <div class="featured-body">
          <span class="featured-label">{{ item.label }}</span>
          <span class="featured-desc">{{ item.desc }}</span>
        </div>
        <div class="featured-arrow">→</div>
      </div>
    </div>

    <!-- Section Header -->
    <div class="section-header">
      <div>
        <h2 class="section-title">All <span>Services</span></h2>
        <div class="gold-divider"></div>
      </div>
      <button class="ghost-btn" id="view-all-services" style="padding: 8px 18px; font-size: 0.82rem;">
        View All
      </button>
    </div>

    <!-- Service Cards Grid -->
    <div class="services-grid">
      <ServiceCard
        v-for="service in categories"
        :key="service.title"
        :icon="service.icon"
        :title="service.title"
        :description="service.description"
        :color="service.color"
        :badge="service.badge"
      />
    </div>
  </section>
</template>

<style scoped>
.services-section {
  padding: var(--space-xl) 0;
}

/* Featured Row */
.featured-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: var(--space-md);
  margin-bottom: var(--space-xl);
}

@media (max-width: 768px) {
  .featured-row { grid-template-columns: 1fr; gap: 8px; }
}

.featured-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  cursor: pointer;
  overflow: hidden;
  position: relative;
}

.featured-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--gold-gradient-soft);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.featured-card:hover::after { opacity: 1; }

.featured-icon {
  font-size: 2rem;
  flex-shrink: 0;
  animation: float 3s ease-in-out infinite;
}

.featured-body {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.featured-label {
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
}

.featured-desc {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.featured-arrow {
  font-size: 1.2rem;
  color: var(--gold-500);
  transition: transform var(--transition-base);
}

.featured-card:hover .featured-arrow {
  transform: translateX(4px);
}

/* Section Header */
.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: var(--space-lg);
}

/* Grid */
.services-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
}

@media (max-width: 640px) {
  .services-grid { grid-template-columns: 1fr; }
}

@media (min-width: 1280px) {
  .services-grid { grid-template-columns: repeat(3, 1fr); }
}
</style>
