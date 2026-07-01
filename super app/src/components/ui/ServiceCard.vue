<script setup lang="ts">
defineProps<{
  icon: string
  title: string
  description?: string
  color?: string
  badge?: string
}>()
</script>

<template>
  <div class="service-card glass-card" :id="`service-${title.toLowerCase().replace(/\s+/g, '-')}`">
    <div class="card-icon-wrap" :style="{ background: color || 'rgba(212,175,55,0.15)' }">
      <span class="card-icon">{{ icon }}</span>
    </div>
    <div class="card-body">
      <div class="card-header-row">
        <h3 class="card-title">{{ title }}</h3>
        <span v-if="badge" class="badge badge-gold" style="font-size: 0.6rem; padding: 2px 8px;">{{ badge }}</span>
      </div>
      <p v-if="description" class="card-desc">{{ description }}</p>
    </div>
    <div class="card-arrow">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="16" height="16">
        <polyline points="9 18 15 12 9 6"/>
      </svg>
    </div>
  </div>
</template>

<style scoped>
.service-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 16px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.service-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: var(--gold-gradient-soft);
  opacity: 0;
  transition: opacity var(--transition-base);
}

.service-card:hover::before {
  opacity: 1;
}

.card-icon-wrap {
  width: 48px;
  height: 48px;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.card-icon {
  font-size: 1.5rem;
  line-height: 1;
}

.card-body {
  flex: 1;
  min-width: 0;
}

.card-header-row {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-bottom: 2px;
}

.card-title {
  font-family: 'Outfit', sans-serif;
  font-size: 0.95rem;
  font-weight: 600;
  color: var(--text-primary);
}

.card-desc {
  font-size: 0.78rem;
  color: var(--text-muted);
  line-height: 1.4;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.card-arrow {
  color: var(--text-muted);
  flex-shrink: 0;
  transition: all var(--transition-base);
}

.service-card:hover .card-arrow {
  color: var(--gold-400);
  transform: translateX(3px);
}
</style>
