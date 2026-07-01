<script setup lang="ts">
const stats = [
  { value: '4.2M+', label: 'Citizens Served', icon: '👥' },
  { value: '180+', label: 'Digital Services', icon: '🛎️' },
  { value: '99.9%', label: 'Uptime', icon: '⚡' },
  { value: '24/7', label: 'Support', icon: '🔒' },
]
</script>

<template>
  <div class="stats-banner">
    <div class="stats-inner">
      <div
        v-for="(stat, index) in stats"
        :key="index"
        class="stat-item"
        :id="`stat-${stat.label.toLowerCase().replace(/\s+/g, '-')}`"
      >
        <span class="stat-icon">{{ stat.icon }}</span>
        <div class="stat-content">
          <span class="stat-value">{{ stat.value }}</span>
          <span class="stat-label">{{ stat.label }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-banner {
  background: linear-gradient(135deg, rgba(212, 175, 55, 0.08) 0%, rgba(212, 175, 55, 0.03) 100%);
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  padding: 20px var(--space-lg);
  overflow: hidden;
}

.stats-inner {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--space-md);
}

@media (max-width: 768px) {
  .stats-inner { grid-template-columns: repeat(2, 1fr); }
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px;
  position: relative;
}

.stat-item:not(:last-child)::after {
  content: '';
  position: absolute;
  right: -8px;
  top: 50%;
  transform: translateY(-50%);
  height: 36px;
  width: 1px;
  background: var(--glass-border);
}

@media (max-width: 768px) {
  .stat-item:nth-child(2)::after,
  .stat-item:nth-child(4)::after { display: none; }
}

.stat-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.stat-content {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-family: 'Outfit', sans-serif;
  font-size: 1.4rem;
  font-weight: 800;
  background: var(--gold-gradient);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  line-height: 1.1;
}

.stat-label {
  font-size: 0.72rem;
  color: var(--text-muted);
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
</style>
