<script setup lang="ts">
import { ref, computed } from 'vue'
import { defaultHappyItems } from '../data/happyList'

const activeTab = ref<'list' | 'wheel'>('list')

// ---- Happy List ----
const items = ref(defaultHappyItems.map(i => ({ ...i })))
const checkedCount = computed(() => items.value.filter(i => i.checked).length)

function toggleItem(id: string): void {
  const item = items.value.find(i => i.id === id)
  if (item) item.checked = !item.checked
}

// ---- Wheel ----
const wheelItems = defaultHappyItems.slice(0, 8)
const isSpinning = ref(false)
const rotation = ref(0)
const selectedIndex = ref(-1)

function spinWheel(): void {
  if (isSpinning.value) return
  isSpinning.value = true
  selectedIndex.value = -1

  const extraRotations = 360 * (3 + Math.random() * 3)
  const targetIndex = Math.floor(Math.random() * wheelItems.length)
  const segmentAngle = 360 / wheelItems.length
  const targetAngle = 360 - (targetIndex * segmentAngle + segmentAngle / 2)

  rotation.value += extraRotations + targetAngle
  setTimeout(() => {
    isSpinning.value = false
    selectedIndex.value = targetIndex
  }, 3500)
}

const selectedItem = computed(() => {
  if (selectedIndex.value >= 0) return wheelItems[selectedIndex.value]
  return null
})

const segmentColors = ['#FFCDB2', '#E8DFF5', '#D4F0E7', '#FFF5D6', '#FFE4E6', '#B8D8E8', '#F0E68C', '#E6E6FA']
</script>

<template>
  <div class="happy-page">
    <h1 class="page-title animate-fade-in-up">做点开心的事吧！ ✨</h1>

    <div class="tabs animate-fade-in-up" style="animation-delay: 0.1s">
      <button :class="['tab', { active: activeTab === 'list' }]" @click="activeTab = 'list'">
        📋 快乐清单
      </button>
      <button :class="['tab', { active: activeTab === 'wheel' }]" @click="activeTab = 'wheel'">
        🎡 心情转盘
      </button>
    </div>

    <!-- Happy List -->
    <div v-if="activeTab === 'list'" class="list-area animate-fade-in-up" style="animation-delay: 0.15s">
      <div class="happy-grid">
        <button
          v-for="item in items"
          :key="item.id"
          class="happy-item card"
          :class="{ checked: item.checked }"
          @click="toggleItem(item.id)"
        >
          <span class="item-check">{{ item.checked ? '✅' : '⬜' }}</span>
          <span class="item-emoji">{{ item.emoji }}</span>
          <span class="item-text">{{ item.text }}</span>
        </button>
      </div>
      <transition name="fade-up">
        <p v-if="checkedCount >= 3" class="encouragement">
          看，快乐其实很简单 😊
        </p>
      </transition>
    </div>

    <!-- Wheel -->
    <div v-if="activeTab === 'wheel'" class="wheel-area animate-fade-in-up" style="animation-delay: 0.15s">
      <div class="wheel-container">
        <div class="wheel-pointer">▼</div>
        <svg
          class="wheel-svg"
          width="320"
          height="320"
          viewBox="0 0 320 320"
          :style="{ transform: `rotate(${rotation}deg)`, transition: isSpinning ? 'transform 3.5s cubic-bezier(0.17, 0.67, 0.12, 0.99)' : 'none' }"
        >
          <g v-for="(item, i) in wheelItems" :key="item.id">
            <path
              :d="getSegmentPath(i, wheelItems.length)"
              :fill="segmentColors[i]"
              stroke="#fff"
              stroke-width="2"
            />
            <text
              :transform="getTextTransform(i, wheelItems.length)"
              text-anchor="middle"
              font-size="22"
              dominant-baseline="middle"
            >
              {{ item.emoji }}
            </text>
          </g>
        </svg>
        <button class="wheel-center-btn" @click="spinWheel" :disabled="isSpinning">
          {{ isSpinning ? '...' : '转！' }}
        </button>
      </div>

      <transition name="fade-up">
        <div v-if="selectedItem" class="wheel-result card">
          <p class="result-label">今天试试这个吧！</p>
          <p class="result-item">{{ selectedItem.emoji }} {{ selectedItem.text }}</p>
          <button class="btn-secondary" @click="spinWheel">再转一次 🔄</button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script lang="ts">
// Helper functions for SVG wheel
function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const angleRad = ((angleDeg - 90) * Math.PI) / 180
  return {
    x: cx + r * Math.cos(angleRad),
    y: cy + r * Math.sin(angleRad),
  }
}

function getSegmentPath(index: number, total: number): string {
  const cx = 160, cy = 160, r = 155
  const angle = 360 / total
  const start = angle * index
  const end = start + angle
  const s = polarToCartesian(cx, cy, r, start)
  const e = polarToCartesian(cx, cy, r, end)
  const largeArc = angle > 180 ? 1 : 0
  return `M${cx},${cy} L${s.x},${s.y} A${r},${r} 0 ${largeArc} 1 ${e.x},${e.y} Z`
}

function getTextTransform(index: number, total: number): string {
  const cx = 160, cy = 160, r = 100
  const angle = 360 / total
  const midAngle = angle * index + angle / 2
  const pos = polarToCartesian(cx, cy, r, midAngle)
  return `translate(${pos.x}, ${pos.y})`
}

// Expose to template
export { getSegmentPath, getTextTransform }
</script>

<style scoped>
.happy-page {
  max-width: 900px;
  margin: 0 auto;
}
.page-title {
  font-family: var(--font-display);
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 32px;
}

.tabs {
  display: flex;
  gap: 8px;
  justify-content: center;
  margin-bottom: 40px;
}
.tab {
  padding: 12px 28px;
  border: 2px solid var(--sidebar-border);
  border-radius: var(--radius-full);
  background: var(--bg-card);
  color: var(--text-secondary);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}
.tab.active {
  background: var(--accent-peach);
  border-color: var(--accent-peach);
  color: var(--text-primary);
  font-weight: 600;
}

/* Happy List */
.happy-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 14px;
  margin-bottom: 24px;
}
.happy-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border: 2px solid transparent;
  text-align: left;
  cursor: pointer;
  transition: all 0.2s ease;
}
.happy-item.checked {
  border-color: var(--accent-mint);
  background: rgba(126, 200, 183, 0.08);
}
.item-check { font-size: 1.1rem; flex-shrink: 0; }
.item-emoji { font-size: 1.4rem; flex-shrink: 0; }
.item-text { font-size: 0.95rem; color: var(--text-primary); }

.encouragement {
  text-align: center;
  font-family: var(--font-display);
  font-size: 1.2rem;
  color: var(--accent-mint);
  margin-top: 16px;
}

/* Wheel */
.wheel-area {
  text-align: center;
}
.wheel-container {
  position: relative;
  display: inline-block;
  margin-bottom: 32px;
}
.wheel-pointer {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 1.5rem;
  color: var(--accent-coral);
  z-index: 5;
}
.wheel-svg {
  display: block;
}
.wheel-center-btn {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
  height: 60px;
  border-radius: 50%;
  border: 3px solid #fff;
  background: var(--accent-peach);
  color: var(--text-primary);
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  z-index: 5;
  transition: all 0.2s ease;
}
.wheel-center-btn:hover:not(:disabled) {
  transform: translate(-50%, -50%) scale(1.1);
}
.wheel-center-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.wheel-result {
  padding: 28px 32px;
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
}
.result-label {
  color: var(--text-secondary);
  font-size: 0.95rem;
  margin-bottom: 12px;
}
.result-item {
  font-family: var(--font-display);
  font-size: 1.3rem;
  color: var(--text-primary);
  margin-bottom: 20px;
}

/* Transitions */
.fade-up-enter-active { transition: all 0.5s ease; }
.fade-up-enter-from { opacity: 0; transform: translateY(15px); }
</style>
