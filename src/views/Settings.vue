<script setup lang="ts">
import { computed } from 'vue'
import { store, setTheme } from '../store'
import type { ThemeName } from '../types'

const themes: { name: ThemeName; emoji: string; label: string }[] = [
  { name: 'garden', emoji: '🌸', label: '花园' },
  { name: 'starry', emoji: '🌙', label: '星空' },
  { name: 'ocean', emoji: '🌊', label: '海洋' },
]

const currentTheme = computed(() => store.theme)

const totalEntries = computed(() => store.gratitudeEntries.length)
const totalReflections = computed(() => store.reflections.length)
const totalSessions = computed(() => store.stats.totalSessions)

function selectTheme(name: ThemeName): void {
  setTheme(name)
}

function resetAllData(): void {
  if (confirm('确定要清除所有数据吗？这个操作不可撤销！')) {
    localStorage.removeItem('dont-be-angry-app')
    window.location.reload()
  }
}
</script>

<template>
  <div class="settings-page">
    <h1 class="page-title animate-fade-in-up">设置 🔧</h1>

    <!-- Theme -->
    <section class="setting-section animate-fade-in-up" style="animation-delay: 0.1s">
      <h2 class="section-title">主题风格</h2>
      <div class="theme-options">
        <button
          v-for="t in themes"
          :key="t.name"
          class="theme-option card"
          :class="{ active: currentTheme === t.name }"
          @click="selectTheme(t.name)"
        >
          <span class="theme-emoji">{{ t.emoji }}</span>
          <span class="theme-label">{{ t.label }}</span>
        </button>
      </div>
    </section>

    <!-- Stats Overview -->
    <section class="setting-section animate-fade-in-up" style="animation-delay: 0.2s">
      <h2 class="section-title">数据概览</h2>
      <div class="stats-overview card">
        <div class="stat-row">
          <span>消气次数</span>
          <span class="stat-val">{{ totalSessions }} 次</span>
        </div>
        <div class="stat-row">
          <span>感恩日记</span>
          <span class="stat-val">{{ totalEntries }} 篇</span>
        </div>
        <div class="stat-row">
          <span>反思记录</span>
          <span class="stat-val">{{ totalReflections }} 条</span>
        </div>
      </div>
    </section>

    <!-- Danger Zone -->
    <section class="setting-section animate-fade-in-up" style="animation-delay: 0.3s">
      <h2 class="section-title" style="color: var(--accent-coral)">危险操作</h2>
      <div class="danger-zone card">
        <p class="danger-text">清除所有本地数据（不可恢复）</p>
        <button class="danger-btn" @click="resetAllData">清除所有数据 🗑️</button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.settings-page {
  max-width: 600px;
  margin: 0 auto;
}
.page-title {
  font-family: var(--font-display);
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 48px;
}

.setting-section {
  margin-bottom: 40px;
}
.section-title {
  font-family: var(--font-display);
  font-size: 1.2rem;
  margin-bottom: 16px;
}

/* Theme */
.theme-options {
  display: flex;
  gap: 16px;
}
.theme-option {
  flex: 1;
  padding: 24px 16px;
  text-align: center;
  border: 2px solid transparent;
  cursor: pointer;
  transition: all 0.2s ease;
}
.theme-option.active {
  border-color: var(--accent-peach);
  box-shadow: 0 4px 20px rgba(255, 205, 178, 0.3);
}
.theme-emoji {
  display: block;
  font-size: 2rem;
  margin-bottom: 10px;
}
.theme-label {
  font-size: 0.95rem;
  color: var(--text-primary);
  font-weight: 500;
}

/* Stats */
.stats-overview {
  padding: 24px;
}
.stat-row {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid var(--sidebar-border);
  color: var(--text-secondary);
  font-size: 0.95rem;
}
.stat-row:last-child {
  border-bottom: none;
}
.stat-val {
  font-weight: 600;
  color: var(--text-primary);
}

/* Danger */
.danger-zone {
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border: 2px solid rgba(255, 107, 107, 0.2);
}
.danger-text {
  font-size: 0.95rem;
  color: var(--text-secondary);
}
.danger-btn {
  padding: 10px 24px;
  border: 2px solid var(--accent-coral);
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--accent-coral);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  flex-shrink: 0;
}
.danger-btn:hover {
  background: var(--accent-coral);
  color: white;
}
</style>
