<script setup lang="ts">
import { computed } from 'vue'
import { store, recordSession } from '../store'
import { achievementDefs } from '../data/achievements'

const totalSessions = computed(() => store.stats.totalSessions)
const streak = computed(() => store.stats.currentStreak)
const totalClicks = computed(() => store.stats.totalSmashClicks)

const achievements = computed(() => {
  return achievementDefs.map((def) => {
    const state = store.achievements.find((a) => a.id === def.id)
    return {
      ...def,
      unlocked: state?.unlocked ?? false,
      unlockedAt: state?.unlockedAt,
    }
  })
})

const moodHistory = computed(() => {
  return store.stats.moodHistory.slice(-20)
})

const avgMood = computed(() => {
  if (moodHistory.value.length === 0) return 0
  const sum = moodHistory.value.reduce((acc, m) => acc + m.mood, 0)
  return (sum / moodHistory.value.length).toFixed(1)
})

function addSession(): void {
  recordSession()
}

// SVG chart helpers
const chartWidth = 600
const chartHeight = 200
const chartPadding = 40

const chartPoints = computed(() => {
  if (moodHistory.value.length < 2) return ''
  const xStep = (chartWidth - chartPadding * 2) / (moodHistory.value.length - 1)
  return moodHistory.value
    .map((m, i) => {
      const x = chartPadding + i * xStep
      const y = chartHeight - chartPadding - ((m.mood - 1) / 9) * (chartHeight - chartPadding * 2)
      return `${x},${y}`
    })
    .join(' ')
})

const chartDots = computed(() => {
  if (moodHistory.value.length < 1) return []
  const xStep =
    moodHistory.value.length > 1
      ? (chartWidth - chartPadding * 2) / (moodHistory.value.length - 1)
      : 0
  return moodHistory.value.map((m, i) => ({
    x: chartPadding + i * xStep,
    y: chartHeight - chartPadding - ((m.mood - 1) / 9) * (chartHeight - chartPadding * 2),
    mood: m.mood,
    date: m.date,
  }))
})
</script>

<template>
  <div class="achievement-page">
    <h1 class="page-title animate-fade-in-up">你的成就墙 🏆</h1>

    <!-- Stats -->
    <div class="stats-row animate-fade-in-up" style="animation-delay: 0.1s">
      <div class="stat-card card">
        <span class="stat-emoji">🎉</span>
        <span class="stat-value">{{ totalSessions }}</span>
        <span class="stat-label">消气次数</span>
      </div>
      <div class="stat-card card">
        <span class="stat-emoji">🔥</span>
        <span class="stat-value">{{ streak }}</span>
        <span class="stat-label">连续天数</span>
      </div>
      <div class="stat-card card">
        <span class="stat-emoji">👊</span>
        <span class="stat-value">{{ totalClicks }}</span>
        <span class="stat-label">累计点击</span>
      </div>
      <div class="stat-card card">
        <span class="stat-emoji">📊</span>
        <span class="stat-value">{{ avgMood }}</span>
        <span class="stat-label">平均情绪</span>
      </div>
    </div>

    <!-- Achievement Badges -->
    <section class="badges-section animate-fade-in-up" style="animation-delay: 0.2s">
      <h2 class="section-title">成就徽章</h2>
      <div class="badges-grid">
        <div
          v-for="ach in achievements"
          :key="ach.id"
          class="badge-card"
          :class="{ unlocked: ach.unlocked }"
          :title="ach.unlocked ? `${ach.name} - ${ach.description}` : `🔒 ${ach.condition}`"
        >
          <span class="badge-emoji">{{ ach.unlocked ? ach.emoji : '🔒' }}</span>
          <span class="badge-name">{{ ach.name }}</span>
        </div>
      </div>
    </section>

    <!-- Mood Chart -->
    <section v-if="moodHistory.length > 0" class="chart-section animate-fade-in-up" style="animation-delay: 0.3s">
      <h2 class="section-title">情绪变化趋势</h2>
      <div class="chart-container card">
        <svg :width="chartWidth" :height="chartHeight" class="mood-chart">
          <!-- Grid lines -->
          <line
            v-for="i in 5"
            :key="'grid-' + i"
            :x1="chartPadding"
            :y1="chartPadding + ((i - 1) / 4) * (chartHeight - chartPadding * 2)"
            :x2="chartWidth - chartPadding"
            :y2="chartPadding + ((i - 1) / 4) * (chartHeight - chartPadding * 2)"
            stroke="var(--sidebar-border)"
            stroke-width="1"
          />
          <!-- Y labels -->
          <text
            v-for="i in 5"
            :key="'ylabel-' + i"
            :x="chartPadding - 10"
            :y="chartPadding + ((i - 1) / 4) * (chartHeight - chartPadding * 2) + 4"
            text-anchor="end"
            fill="var(--text-muted)"
            font-size="12"
          >
            {{ 10 - (i - 1) * 2.25 | 0 }}
          </text>
          <!-- Line -->
          <polyline
            v-if="chartPoints"
            :points="chartPoints"
            fill="none"
            stroke="var(--accent-peach)"
            stroke-width="3"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <!-- Dots -->
          <circle
            v-for="(dot, i) in chartDots"
            :key="'dot-' + i"
            :cx="dot.x"
            :cy="dot.y"
            r="5"
            fill="var(--accent-coral)"
            stroke="#fff"
            stroke-width="2"
          />
        </svg>
      </div>
    </section>

    <!-- CTA -->
    <div class="cta-area animate-fade-in-up" style="animation-delay: 0.4s">
      <button class="btn-primary" @click="addSession">
        我又消气了！+1 🎉
      </button>
    </div>
  </div>
</template>

<style scoped>
.achievement-page {
  max-width: 800px;
  margin: 0 auto;
}
.page-title {
  font-family: var(--font-display);
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 40px;
}

/* Stats */
.stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 48px;
}
.stat-card {
  text-align: center;
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.stat-emoji {
  font-size: 1.8rem;
}
.stat-value {
  font-size: 2rem;
  font-weight: 700;
  color: var(--text-primary);
}
.stat-label {
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* Badges */
.section-title {
  font-family: var(--font-display);
  font-size: 1.3rem;
  margin-bottom: 24px;
}
.badges-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 48px;
}
.badge-card {
  text-align: center;
  padding: 20px 12px;
  border-radius: var(--radius-md);
  background: var(--bg-card);
  box-shadow: var(--shadow-soft);
  transition: all 0.2s ease;
}
.badge-card.unlocked {
  border: 2px solid var(--accent-yellow);
  box-shadow: 0 4px 20px rgba(255, 217, 61, 0.15);
}
.badge-card:not(.unlocked) {
  opacity: 0.5;
  filter: grayscale(0.8);
}
.badge-emoji {
  display: block;
  font-size: 2.5rem;
  margin-bottom: 10px;
}
.badge-name {
  font-size: 0.85rem;
  color: var(--text-primary);
  font-weight: 500;
}

/* Chart */
.chart-container {
  padding: 24px;
  overflow-x: auto;
  margin-bottom: 48px;
}
.mood-chart {
  display: block;
  margin: 0 auto;
}

/* CTA */
.cta-area {
  text-align: center;
  margin-bottom: 40px;
}
</style>
