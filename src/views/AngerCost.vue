<script setup lang="ts">
import { angerCosts } from '../data/angerCosts'
</script>

<template>
  <div class="cost-page">
    <h1 class="page-title animate-fade-in-up">
      生气到底有多亏？我帮你算了一笔账 🧮
    </h1>
    <p class="page-subtitle animate-fade-in-up" style="animation-delay: 0.1s">
      不是说教哦，就是帮你算算...
    </p>

    <div class="cost-grid">
      <div
        v-for="(cost, i) in angerCosts"
        :key="cost.id"
        class="cost-card card"
        :style="{ animationDelay: `${0.15 * (i + 1)}s`, '--accent': cost.accentColor }"
      >
        <div class="cost-accent-bar"></div>
        <div class="cost-emoji">{{ cost.emoji }}</div>
        <h3 class="cost-title">{{ cost.title }}</h3>
        <p class="cost-desc">{{ cost.description }}</p>
        <p v-if="cost.comparison" class="cost-compare">{{ cost.comparison }}</p>
      </div>
    </div>

    <div class="summary-card card animate-fade-in-up" style="animation-delay: 0.9s">
      <div class="summary-emoji">⚖️</div>
      <p class="summary-text">
        生气 1 小时 ≈ 熬夜 6 小时的伤害
      </p>
      <p class="summary-conclusion">
        所以...真的不值得为这件事伤害自己呀 🤗
      </p>
    </div>
  </div>
</template>

<style scoped>
.cost-page {
  max-width: 960px;
  margin: 0 auto;
}
.page-title {
  font-family: var(--font-display);
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 12px;
}
.page-subtitle {
  text-align: center;
  color: var(--text-secondary);
  font-size: 1.05rem;
  margin-bottom: 48px;
}

.cost-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;
  margin-bottom: 40px;
}

.cost-card {
  padding: 32px 24px;
  text-align: center;
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out both;
}
.cost-accent-bar {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--accent);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
}
.cost-emoji {
  font-size: 3rem;
  margin-bottom: 16px;
}
.cost-title {
  font-family: var(--font-display);
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 12px;
}
.cost-desc {
  font-size: 0.95rem;
  color: var(--text-secondary);
  line-height: 1.6;
  margin-bottom: 8px;
}
.cost-compare {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-style: italic;
}

.summary-card {
  text-align: center;
  padding: 48px 40px;
  background: linear-gradient(135deg, var(--bg-card), #fff5ee);
  margin-bottom: 20px;
}
.summary-emoji {
  font-size: 3rem;
  margin-bottom: 20px;
}
.summary-text {
  font-family: var(--font-display);
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--accent-coral);
  margin-bottom: 16px;
}
.summary-conclusion {
  font-size: 1.15rem;
  color: var(--text-secondary);
}
</style>
