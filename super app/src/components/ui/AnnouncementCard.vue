<script setup lang="ts">
defineProps<{
  title: string
  summary: string
  date: string
  category: string
  priority?: 'urgent' | 'normal' | 'info'
  isNew?: boolean
}>()

function priorityClass(priority?: string) {
  if (priority === 'urgent') return 'badge-urgent'
  if (priority === 'info') return 'badge-info'
  return 'badge-gold'
}

function priorityLabel(priority?: string) {
  if (priority === 'urgent') return '🔴 Urgent'
  if (priority === 'info') return '🔵 Info'
  return '📢 Official'
}
</script>

<template>
  <article class="announce-card glass-card" :class="{ 'urgent-card': priority === 'urgent' }">
    <!-- Top row -->
    <div class="card-top">
      <div class="card-tags">
        <span class="badge" :class="priorityClass(priority)">{{ priorityLabel(priority) }}</span>
        <span class="badge badge-gold" style="font-size: 0.65rem;">{{ category }}</span>
        <span v-if="isNew" class="badge badge-new">New</span>
      </div>
      <time class="card-date">{{ date }}</time>
    </div>

    <!-- Title -->
    <h3 class="card-title">{{ title }}</h3>

    <!-- Summary -->
    <p class="card-summary">{{ summary }}</p>

    <!-- Footer -->
    <div class="card-footer">
      <button class="read-more-btn">
        Read Full Announcement
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
          <polyline points="9 18 15 12 9 6"/>
        </svg>
      </button>
    </div>

    <!-- Urgent glow border -->
    <div v-if="priority === 'urgent'" class="urgent-glow"></div>
  </article>
</template>

<style scoped>
.announce-card {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}

.urgent-card {
  border-color: rgba(239, 68, 68, 0.3) !important;
}

.card-top {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 8px;
  flex-wrap: wrap;
}

.card-tags {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
}

.card-date {
  font-size: 0.72rem;
  color: var(--text-muted);
  white-space: nowrap;
  font-style: normal;
}

.card-title {
  font-family: 'Outfit', sans-serif;
  font-size: 1rem;
  font-weight: 700;
  color: var(--text-primary);
  line-height: 1.3;
}

.card-summary {
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.6;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-footer {
  padding-top: 8px;
  border-top: 1px solid var(--glass-border);
  margin-top: 4px;
}

.read-more-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-family: 'Outfit', sans-serif;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--gold-400);
  transition: all var(--transition-base);
}

.read-more-btn:hover {
  color: var(--gold-300);
  gap: 8px;
}

.urgent-glow {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 2px;
  background: linear-gradient(90deg, transparent, #EF4444, transparent);
  animation: shimmer 2s infinite;
}
</style>
