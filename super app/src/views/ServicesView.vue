<script setup lang="ts">
import SearchBar from '../components/ui/SearchBar.vue'
import ServiceCard from '../components/ui/ServiceCard.vue'

const allServices = [
  { icon: '📋', title: 'National ID Card', description: 'Apply, renew or replace your National ID', color: 'rgba(212,175,55,0.15)', badge: 'Popular' },
  { icon: '🌐', title: 'Passport Services', description: 'New passport, renewal and emergency travel docs', color: 'rgba(212,175,55,0.15)', badge: 'Popular' },
  { icon: '📜', title: 'Birth Certificate', description: 'Register new birth or request copy', color: 'rgba(212,175,55,0.1)' },
  { icon: '💒', title: 'Marriage Certificate', description: 'Marriage registration and certified copies', color: 'rgba(212,175,55,0.1)' },
  { icon: '🏥', title: 'Medical Registration', description: 'Register with national health system', color: 'rgba(34,197,94,0.12)' },
  { icon: '💊', title: 'Health Subsidy', description: 'Apply for medical cost assistance', color: 'rgba(34,197,94,0.12)', badge: 'New' },
  { icon: '🎓', title: 'Scholarship Portal', description: 'Apply for government scholarships', color: 'rgba(59,130,246,0.12)' },
  { icon: '📚', title: 'School Enrollment', description: 'Public school registration & enrollment', color: 'rgba(59,130,246,0.12)' },
  { icon: '💼', title: 'Job Portal', description: 'Government and private sector job listings', color: 'rgba(168,85,247,0.12)' },
  { icon: '🏠', title: 'Housing Permit', description: 'Apply for construction & housing permits', color: 'rgba(249,115,22,0.12)' },
  { icon: '💰', title: 'Tax Filing', description: 'Submit annual personal income tax', color: 'rgba(236,72,153,0.12)', badge: 'Popular' },
  { icon: '🚗', title: 'Vehicle Registration', description: 'Register or renew vehicle road tax', color: 'rgba(14,165,233,0.12)' },
  { icon: '🚔', title: 'Police Report', description: 'Submit and track police reports online', color: 'rgba(239,68,68,0.12)' },
  { icon: '⚖️', title: 'Legal Aid', description: 'Access free legal consultation services', color: 'rgba(239,68,68,0.12)' },
  { icon: '🌿', title: 'Environment Permit', description: 'Environmental impact and permits', color: 'rgba(16,185,129,0.12)' },
  { icon: '✈️', title: 'Visa Application', description: 'Apply or track visa applications', color: 'rgba(99,102,241,0.12)' },
]
</script>

<template>
  <div class="services-view">
    <!-- Page Header -->
    <div class="page-header">
      <div class="container">
        <div class="header-content">
          <div>
            <h1 class="page-title-text">All <span class="gold-text">Services</span></h1>
            <p class="page-subtitle">{{ allServices.length }} services available for citizens</p>
          </div>
          <div class="badge badge-gold">🛎️ Full Catalog</div>
        </div>
      </div>
    </div>

    <div class="container">
      <!-- Search -->
      <div class="search-wrap">
        <SearchBar />
      </div>

      <!-- Grid -->
      <div class="all-services-grid">
        <ServiceCard
          v-for="service in allServices"
          :key="service.title"
          :icon="service.icon"
          :title="service.title"
          :description="service.description"
          :color="service.color"
          :badge="service.badge"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.services-view { min-height: 100vh; padding-bottom: var(--space-3xl); }

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

.search-wrap { margin-bottom: var(--space-xl); }

.all-services-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--space-md);
}

@media (max-width: 640px) {
  .all-services-grid { grid-template-columns: 1fr; }
}

@media (min-width: 1280px) {
  .all-services-grid { grid-template-columns: repeat(3, 1fr); }
}
</style>
