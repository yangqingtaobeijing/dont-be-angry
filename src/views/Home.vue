<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { recordMood } from '../store'
import type { MoodLevel } from '../types'

const router = useRouter()
const moodValue = ref(5)

const moodResponse = computed(() => {
  const v = moodValue.value
  if (v <= 3) return { text: '看起来只是有点小不开心～ 没事，涛哥陪你 🤗', color: '#7EC8B7' }
  if (v <= 6) return { text: '嗯，我理解你现在的感受。你的情绪是合理的 💛', color: '#FFD93D' }
  if (v <= 9) return { text: '好生气啊！来，先发泄一下，别憋着 💪', color: '#FF8C42' }
  return { text: '气到爆炸了！没关系，这个世界上没有什么是一顿发泄解决不了的 🔥', color: '#FF6B6B' }
})

const moodEmoji = computed(() => {
  const v = moodValue.value
  if (v <= 2) return '😊'
  if (v <= 4) return '😐'
  if (v <= 6) return '😤'
  if (v <= 8) return '😠'
  return '🤬'
})

function onMoodChange(): void {
  recordMood(moodValue.value as MoodLevel)
}

interface FeatureCard {
  path: string
  emoji: string
  title: string
  description: string
  color: string
}

const featureCards: FeatureCard[] = [
  { path: '/stress-relief', emoji: '🥊', title: '解压互动', description: '使劲戳出气！', color: '#FF6B6B' },
  { path: '/tao-message', emoji: '💌', title: '涛哥的话', description: '看看涛哥说了什么', color: '#E8A0BF' },
  { path: '/cost', emoji: '📊', title: '生气的代价', description: '生气真的很亏', color: '#FF8C42' },
  { path: '/reflect', emoji: '🤔', title: '反思一下', description: '一年后还重要吗？', color: '#B8A9C9' },
  { path: '/quotes', emoji: '✨', title: '名人金句', description: '智慧的力量', color: '#FFD93D' },
  { path: '/happy', emoji: '🎉', title: '快乐清单', description: '做点开心的事吧', color: '#7EC8B7' },
  { path: '/gratitude', emoji: '📝', title: '感恩日记', description: '生活中的美好', color: '#B8D8E8' },
  { path: '/achievement', emoji: '🏆', title: '成就墙', description: '你的消气记录', color: '#FFD93D' },
]

function goTo(path: string): void {
  router.push(path)
}
</script>

<template>
  <div class="home-page">
    <!-- Mood Thermometer -->
    <section class="mood-section animate-fade-in-up">
      <h2 class="section-title">现在有多生气呢？告诉我 {{ moodEmoji }}</h2>

      <div class="mood-slider-wrapper">
        <span class="mood-end">😊</span>
        <div class="slider-container">
          <input
            type="range"
            min="1"
            max="10"
            v-model.number="moodValue"
            class="mood-slider"
            @change="onMoodChange"
          />
          <div
            class="slider-fill"
            :style="{ width: ((moodValue - 1) / 9) * 100 + '%' }"
          ></div>
          <div
            class="mood-bubble"
            :style="{ left: ((moodValue - 1) / 9) * 100 + '%' }"
          >
            {{ moodValue }}
          </div>
        </div>
        <span class="mood-end">😤</span>
      </div>

      <div class="mood-response card" :style="{ borderTopColor: moodResponse.color }">
        <p>{{ moodResponse.text }}</p>
      </div>
    </section>

    <!-- Feature Cards Grid -->
    <section class="features-section">
      <h2 class="section-title" style="animation-delay: 0.2s">可以试试这些 ✨</h2>
      <div class="features-grid">
        <button
          v-for="(card, i) in featureCards"
          :key="card.path"
          class="feature-card card"
          :style="{ animationDelay: `${0.1 * (i + 1)}s`, '--card-accent': card.color }"
          @click="goTo(card.path)"
        >
          <span class="feature-emoji">{{ card.emoji }}</span>
          <h3 class="feature-title">{{ card.title }}</h3>
          <p class="feature-desc">{{ card.description }}</p>
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.home-page {
  max-width: 960px;
  margin: 0 auto;
}

/* ---- Mood Section ---- */
.mood-section {
  margin-bottom: 56px;
}
.section-title {
  font-family: var(--font-display);
  font-size: 1.6rem;
  color: var(--text-primary);
  margin-bottom: 28px;
  animation: fadeInUp 0.6s ease-out both;
}

.mood-slider-wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
  max-width: 560px;
  margin: 0 auto 28px;
}
.mood-end {
  font-size: 1.8rem;
  flex-shrink: 0;
}
.slider-container {
  flex: 1;
  position: relative;
  height: 40px;
  display: flex;
  align-items: center;
}
.mood-slider {
  width: 100%;
  height: 8px;
  border-radius: 4px;
  -webkit-appearance: none;
  appearance: none;
  background: linear-gradient(to right, #7EC8B7, #FFD93D, #FF8C42, #FF6B6B);
  outline: none;
  position: relative;
  z-index: 2;
}
.mood-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 2px 10px rgba(0,0,0,0.15);
  cursor: pointer;
  border: 3px solid var(--accent-peach);
  transition: transform 0.15s ease;
}
.mood-slider::-webkit-slider-thumb:hover {
  transform: scale(1.15);
}
.slider-fill {
  display: none;
}
.mood-bubble {
  position: absolute;
  top: -10px;
  transform: translateX(-50%);
  background: var(--accent-peach);
  color: var(--text-primary);
  font-weight: 700;
  font-size: 0.85rem;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  pointer-events: none;
  z-index: 3;
  box-shadow: 0 2px 8px rgba(255, 205, 178, 0.4);
}

.mood-response {
  max-width: 560px;
  margin: 0 auto;
  padding: 24px 32px;
  border-top: 4px solid var(--accent-peach);
  text-align: center;
  font-size: 1.1rem;
  color: var(--text-primary);
  line-height: 1.6;
}

/* ---- Features Grid ---- */
.features-section {
  margin-bottom: 40px;
}
.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}

.feature-card {
  padding: 28px 24px;
  text-align: center;
  border: none;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  animation: fadeInUp 0.6s ease-out both;
}
.feature-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: var(--card-accent);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
}
.feature-emoji {
  display: block;
  font-size: 2.8rem;
  margin-bottom: 14px;
}
.feature-title {
  font-family: var(--font-display);
  font-size: 1.15rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 8px;
}
.feature-desc {
  font-size: 0.9rem;
  color: var(--text-secondary);
}
</style>
