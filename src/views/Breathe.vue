<script setup lang="ts">
import { ref, computed, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { store, completeOnboarding, unlockAchievement } from '../store'
import type { BreathPhase } from '../types'

const router = useRouter()

const phase = ref<BreathPhase>('idle')
const currentCycle = ref(0)
const isActive = ref(false)
const isComplete = ref(false)
const showResult = ref(false)

const totalCycles = computed(() => store.breathConfig.totalCycles)
const inhaleDur = computed(() => store.breathConfig.inhaleDuration)
const holdDur = computed(() => store.breathConfig.holdDuration)
const exhaleDur = computed(() => store.breathConfig.exhaleDuration)

const phaseText = computed(() => {
  switch (phase.value) {
    case 'inhale': return '慢慢吸气...'
    case 'hold': return '停一停...'
    case 'exhale': return '慢慢呼气...'
    default: return '点击开始'
  }
})

const circleScale = computed(() => {
  switch (phase.value) {
    case 'inhale': return 1.6
    case 'hold': return 1.6
    case 'exhale': return 1
    default: return 1
  }
})

const circleTransition = computed(() => {
  switch (phase.value) {
    case 'inhale': return `transform ${inhaleDur.value}ms ease-in-out`
    case 'hold': return `transform ${holdDur.value}ms ease`
    case 'exhale': return `transform ${exhaleDur.value}ms ease-in-out`
    default: return 'transform 0.5s ease'
  }
})

let timer: ReturnType<typeof setTimeout> | null = null

function clearTimer(): void {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
}

function runCycle(): void {
  if (currentCycle.value >= totalCycles.value) {
    finishBreathing()
    return
  }

  // Inhale
  phase.value = 'inhale'
  timer = setTimeout(() => {
    // Hold
    phase.value = 'hold'
    timer = setTimeout(() => {
      // Exhale
      phase.value = 'exhale'
      timer = setTimeout(() => {
        currentCycle.value++
        runCycle()
      }, exhaleDur.value)
    }, holdDur.value)
  }, inhaleDur.value)
}

function startBreathing(): void {
  if (isActive.value) return
  isActive.value = true
  currentCycle.value = 0
  runCycle()
}

function finishBreathing(): void {
  clearTimer()
  phase.value = 'idle'
  isActive.value = false
  isComplete.value = true
  showResult.value = true
  unlockAchievement('first-calm')
}

function goHome(): void {
  completeOnboarding()
  router.push('/home')
}

function doMoreRounds(): void {
  showResult.value = false
  isComplete.value = false
  currentCycle.value = 0
  startBreathing()
}

function skip(): void {
  clearTimer()
  completeOnboarding()
  router.push('/home')
}

onUnmounted(() => {
  clearTimer()
})
</script>

<template>
  <div class="breathe-page">
    <div class="breathe-content">
      <!-- Result state -->
      <template v-if="showResult">
        <div class="result-container animate-fade-in-up">
          <h2 class="result-title">感觉好一点了吗？ 🌿</h2>
          <div class="result-buttons">
            <button class="btn-primary" @click="goHome">好多了 ☀️</button>
            <button class="btn-secondary" @click="doMoreRounds">再来一轮 🔄</button>
          </div>
        </div>
      </template>

      <!-- Breathing state -->
      <template v-else>
        <h2 class="breathe-title" :class="{ visible: !isActive }">
          没关系，先深呼吸一下
        </h2>

        <div
          class="breath-circle"
          :style="{
            transform: `scale(${circleScale})`,
            transition: circleTransition,
          }"
          @click="startBreathing"
        >
          <div class="circle-inner">
            <span class="phase-text">{{ phaseText }}</span>
          </div>
          <div class="circle-glow"></div>
        </div>

        <p v-if="isActive" class="cycle-counter">
          第 {{ currentCycle + 1 }} / {{ totalCycles }} 个呼吸
        </p>

        <button class="skip-btn" @click="skip">跳过 →</button>
      </template>
    </div>
  </div>
</template>

<style scoped>
.breathe-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  position: relative;
  overflow: hidden;
}

.breathe-content {
  text-align: center;
  position: relative;
  z-index: 10;
}

.breathe-title {
  font-family: var(--font-display);
  font-size: 1.6rem;
  color: rgba(232, 224, 240, 0.9);
  margin-bottom: 60px;
  opacity: 0.7;
  transition: opacity 0.5s ease;
}
.breathe-title.visible {
  opacity: 1;
}

.breath-circle {
  width: 200px;
  height: 200px;
  margin: 0 auto 40px;
  border-radius: 50%;
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.circle-inner {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle, #ffcdb2 0%, #e8a0bf 40%, #b8a9c9 70%, transparent 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  z-index: 2;
}

.circle-glow {
  position: absolute;
  top: -30px;
  left: -30px;
  right: -30px;
  bottom: -30px;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(232, 160, 191, 0.3) 0%, transparent 70%);
  z-index: 1;
  filter: blur(20px);
}

.phase-text {
  font-family: var(--font-display);
  font-size: 1.15rem;
  color: #4a3728;
  font-weight: 600;
  letter-spacing: 1px;
}

.cycle-counter {
  color: rgba(232, 224, 240, 0.6);
  font-size: 0.95rem;
  margin-bottom: 40px;
}

.skip-btn {
  position: fixed;
  bottom: 40px;
  right: 40px;
  background: transparent;
  border: none;
  color: rgba(232, 224, 240, 0.35);
  font-size: 0.9rem;
  cursor: pointer;
  transition: color 0.2s ease;
}
.skip-btn:hover {
  color: rgba(232, 224, 240, 0.7);
}

.result-container {
  text-align: center;
}
.result-title {
  font-family: var(--font-display);
  font-size: 2rem;
  color: #e8e0f0;
  margin-bottom: 40px;
}
.result-buttons {
  display: flex;
  gap: 20px;
  justify-content: center;
}
</style>
