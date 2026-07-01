<script setup lang="ts">
import { ref } from 'vue'

const query = ref('')
const activeFilter = ref('All')

const filters = ['All', 'Documents', 'Health', 'Education', 'Finance', 'Housing']

defineEmits<{
  search: [query: string]
  filter: [filter: string]
}>()
</script>

<template>
  <div class="search-container">
    <!-- Search Input -->
    <div class="search-bar">
      <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" width="18" height="18">
        <circle cx="11" cy="11" r="8"/>
        <line x1="21" y1="21" x2="16.65" y2="16.65"/>
      </svg>
      <input
        v-model="query"
        type="text"
        placeholder="Search services, documents..."
        class="search-input"
        id="main-search-input"
      />
      <button v-if="query" class="clear-btn" @click="query = ''">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" width="14" height="14">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>
      <button class="search-submit-btn gold-btn" id="search-submit-btn" style="padding: 8px 16px; font-size: 0.82rem;">
        Search
      </button>
    </div>

    <!-- Filter Chips -->
    <div class="filter-chips" role="group" aria-label="Service categories">
      <button
        v-for="filter in filters"
        :key="filter"
        class="filter-chip"
        :class="{ active: activeFilter === filter }"
        :id="`filter-${filter.toLowerCase()}`"
        @click="activeFilter = filter"
      >
        {{ filter }}
      </button>
    </div>
  </div>
</template>

<style scoped>
.search-container {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  background: var(--glass-bg);
  border: 1.5px solid var(--glass-border);
  border-radius: var(--radius-2xl);
  transition: all var(--transition-base);
}

.search-bar:focus-within {
  border-color: var(--gold-500);
  background: var(--glass-bg-hover);
  box-shadow: 0 0 0 3px rgba(212, 175, 55, 0.1);
}

.search-icon {
  color: var(--text-muted);
  flex-shrink: 0;
}

.search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-family: 'Inter', sans-serif;
  font-size: 0.9rem;
  color: var(--text-primary);
}

.search-input::placeholder {
  color: var(--text-muted);
}

.clear-btn {
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: var(--glass-bg-hover);
  border: 1px solid var(--glass-border);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--text-muted);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.clear-btn:hover {
  background: rgba(239, 68, 68, 0.1);
  color: #FCA5A5;
}

/* Filter Chips */
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

.filter-chip:hover {
  background: var(--glass-bg-hover);
  color: var(--text-primary);
}

.filter-chip.active {
  background: rgba(212, 175, 55, 0.15);
  border-color: var(--gold-500);
  color: var(--gold-400);
}
</style>
