<script setup lang="ts">
const offices = [
  { name: 'Central Immigration Office', distance: '0.8 km', address: '42 Government Ave, Central District', open: true, wait: '~15 min', icon: '🏛️' },
  { name: 'National Revenue Department', distance: '1.2 km', address: '18 Finance Blvd, East District', open: true, wait: '~30 min', icon: '💰' },
  { name: 'Ministry of Health — Clinic', distance: '2.1 km', address: '7 Health Park Rd, North Zone', open: true, wait: '~10 min', icon: '🏥' },
  { name: 'Education Council Office', distance: '3.5 km', address: '99 Scholar Lane, West District', open: false, wait: '—', icon: '🎓' },
]
</script>

<template>
  <section class="nearby-section" id="nearby-section">
    <!-- Header -->
    <div class="section-header">
      <div>
        <h2 class="section-title">Nearby <span>Offices</span></h2>
        <div class="gold-divider"></div>
      </div>
      <button class="ghost-btn" style="padding: 8px 18px; font-size: 0.82rem;" id="nearby-map-btn">
        📍 Open Map
      </button>
    </div>

    <!-- Office Cards -->
    <div class="offices-grid">
      <div
        v-for="office in offices"
        :key="office.name"
        class="office-card glass-card"
        :id="`office-${office.name.toLowerCase().replace(/\s+/g, '-').slice(0,20)}`"
      >
        <div class="office-icon">{{ office.icon }}</div>
        <div class="office-body">
          <div class="office-top">
            <h3 class="office-name">{{ office.name }}</h3>
            <span class="office-status" :class="office.open ? 'open' : 'closed'">
              {{ office.open ? 'Open' : 'Closed' }}
            </span>
          </div>
          <p class="office-address">📍 {{ office.address }}</p>
          <div class="office-meta">
            <span class="meta-item">🚶 {{ office.distance }}</span>
            <span v-if="office.open" class="meta-item">⏱ Wait: {{ office.wait }}</span>
          </div>
        </div>
        <button class="office-btn gold-btn" style="padding: 8px 14px; font-size: 0.78rem; flex-shrink: 0;" :id="`directions-${office.name.toLowerCase().replace(/\s+/g, '-').slice(0,15)}`">
          Directions
        </button>
      </div>
    </div>
  </section>
</template>

<style scoped>
.nearby-section {
  padding: var(--space-xl) 0 var(--space-3xl);
}

.section-header {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: var(--space-lg);
}

.offices-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.office-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  cursor: pointer;
}

.office-icon {
  font-size: 1.8rem;
  flex-shrink: 0;
  width: 44px;
  text-align: center;
}

.office-body {
  flex: 1;
  min-width: 0;
}

.office-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  margin-bottom: 4px;
}

.office-name {
  font-family: 'Outfit', sans-serif;
  font-size: 0.92rem;
  font-weight: 600;
  color: var(--text-primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.office-status {
  font-family: 'Outfit', sans-serif;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  white-space: nowrap;
  flex-shrink: 0;
}

.office-status.open {
  background: rgba(34, 197, 94, 0.15);
  color: #86EFAC;
  border: 1px solid rgba(34, 197, 94, 0.3);
}

.office-status.closed {
  background: rgba(239, 68, 68, 0.1);
  color: #FCA5A5;
  border: 1px solid rgba(239, 68, 68, 0.2);
}

.office-address {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 6px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.office-meta {
  display: flex;
  gap: 12px;
}

.meta-item {
  font-size: 0.75rem;
  color: var(--text-secondary);
}

@media (max-width: 600px) {
  .office-card { flex-wrap: wrap; }
  .office-btn { width: 100%; justify-content: center; }
}
</style>
