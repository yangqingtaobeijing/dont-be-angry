<script setup lang="ts">
import { ref, computed } from 'vue'
import { recordSmashClicks } from '../store'

const activeTab = ref<'smash' | 'doodle'>('smash')

// ---- Smash Button ----
const clickCount = ref(0)
const isShaking = ref(false)
const particles = ref<Array<{ id: number; emoji: string; x: number; y: number }>>([])
let particleId = 0

const emojis = ['💢', '😤', '💥', '🔥', '⚡', '💫']

const smashStage = computed(() => {
  const c = clickCount.value
  if (c >= 100) return { text: '你已经把坏情绪全部打碎了！💪', effect: 'bloom' as const }
  if (c >= 50) return { text: '破坏力惊人！继续！', effect: 'heavy-crack' as const }
  if (c >= 30) return { text: '裂缝出现了！', effect: 'crack' as const }
  if (c >= 10) return { text: '继续！使劲！', effect: 'normal' as const }
  return { text: '使劲戳我出气！👊', effect: 'normal' as const }
})

const isFinished = computed(() => clickCount.value >= 100)

function smash(event: MouseEvent): void {
  if (isFinished.value) return
  clickCount.value++

  // Shake
  isShaking.value = true
  setTimeout(() => { isShaking.value = false }, 150)

  // Particle
  const rect = (event.target as HTMLElement).getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  const emoji = emojis[Math.floor(Math.random() * emojis.length)]
  const id = ++particleId
  particles.value.push({ id, emoji, x, y })
  setTimeout(() => {
    particles.value = particles.value.filter(p => p.id !== id)
  }, 1000)

  if (clickCount.value === 100) {
    recordSmashClicks(100)
  }
}

function resetSmash(): void {
  clickCount.value = 0
  particles.value = []
}

// ---- Doodle Canvas ----
const canvasRef = ref<HTMLCanvasElement | null>(null)
const isDrawing = ref(false)
const brushColor = ref('#FF6B6B')
const brushSize = ref(4)
const colors = ['#FF6B6B', '#FF8C42', '#FFD93D', '#7EC8B7', '#6C88C4', '#B8A9C9']
let ctx: CanvasRenderingContext2D | null = null
let lastX = 0
let lastY = 0

function initCanvas(): void {
  if (!canvasRef.value) return
  ctx = canvasRef.value.getContext('2d')
  if (ctx) {
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    clearCanvas()
  }
}

function startDraw(e: MouseEvent): void {
  if (!ctx || !canvasRef.value) return
  isDrawing.value = true
  const rect = canvasRef.value.getBoundingClientRect()
  lastX = e.clientX - rect.left
  lastY = e.clientY - rect.top
}

function draw(e: MouseEvent): void {
  if (!isDrawing.value || !ctx || !canvasRef.value) return
  const rect = canvasRef.value.getBoundingClientRect()
  const x = e.clientX - rect.left
  const y = e.clientY - rect.top
  ctx.strokeStyle = brushColor.value
  ctx.lineWidth = brushSize.value
  ctx.beginPath()
  ctx.moveTo(lastX, lastY)
  ctx.lineTo(x, y)
  ctx.stroke()
  lastX = x
  lastY = y
}

function stopDraw(): void {
  isDrawing.value = false
}

function clearCanvas(): void {
  if (!ctx || !canvasRef.value) return
  ctx.fillStyle = '#FFFBF5'
  ctx.fillRect(0, 0, canvasRef.value.width, canvasRef.value.height)
}

function onCanvasMounted(): void {
  setTimeout(initCanvas, 50)
}
</script>

<template>
  <div class="stress-page">
    <h1 class="page-title animate-fade-in-up">把坏情绪统统打碎！ 💥</h1>

    <!-- Tabs -->
    <div class="tabs animate-fade-in-up" style="animation-delay: 0.1s">
      <button
        :class="['tab', { active: activeTab === 'smash' }]"
        @click="activeTab = 'smash'"
      >
        👊 疯狂点击
      </button>
      <button
        :class="['tab', { active: activeTab === 'doodle' }]"
        @click="activeTab = 'doodle'; onCanvasMounted()"
      >
        🎨 涂鸦画板
      </button>
    </div>

    <!-- Smash Tab -->
    <div v-if="activeTab === 'smash'" class="smash-area animate-fade-in-up" style="animation-delay: 0.15s">
      <template v-if="!isFinished">
        <div class="smash-container">
          <button
            class="smash-btn"
            :class="[smashStage.effect, { shaking: isShaking }]"
            @click="smash"
          >
            {{ smashStage.text }}
          </button>
          <!-- Particles -->
          <span
            v-for="p in particles"
            :key="p.id"
            class="particle"
            :style="{ left: p.x + 'px', top: p.y + 'px' }"
          >
            {{ p.emoji }}
          </span>
        </div>
        <p class="click-count">已经戳了 <strong>{{ clickCount }}</strong> 下！</p>
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: Math.min(clickCount, 100) + '%' }"></div>
        </div>
        <p class="progress-hint">到 100 触发终极效果 ✨</p>
      </template>

      <template v-else>
        <div class="finish-area">
          <div class="bloom-emoji">🌸</div>
          <h2 class="finish-title">呼...发泄完了吗？</h2>
          <p class="finish-subtitle">感觉好多了吧 😊</p>
          <button class="btn-primary" @click="resetSmash">再来一轮 🔄</button>
        </div>
      </template>
    </div>

    <!-- Doodle Tab -->
    <div v-if="activeTab === 'doodle'" class="doodle-area animate-fade-in-up" style="animation-delay: 0.15s">
      <div class="doodle-toolbar">
        <div class="color-picker">
          <button
            v-for="c in colors"
            :key="c"
            class="color-dot"
            :class="{ active: brushColor === c }"
            :style="{ background: c }"
            @click="brushColor = c"
          ></button>
        </div>
        <div class="brush-sizes">
          <button :class="['size-btn', { active: brushSize === 2 }]" @click="brushSize = 2">细</button>
          <button :class="['size-btn', { active: brushSize === 4 }]" @click="brushSize = 4">中</button>
          <button :class="['size-btn', { active: brushSize === 8 }]" @click="brushSize = 8">粗</button>
        </div>
      </div>

      <canvas
        ref="canvasRef"
        width="640"
        height="400"
        class="doodle-canvas"
        @mousedown="startDraw"
        @mousemove="draw"
        @mouseup="stopDraw"
        @mouseleave="stopDraw"
      ></canvas>

      <div class="doodle-actions">
        <button class="btn-secondary" @click="clearCanvas">发泄完了，擦掉重来 🧹</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stress-page {
  max-width: 800px;
  margin: 0 auto;
}
.page-title {
  font-family: var(--font-display);
  font-size: 1.8rem;
  text-align: center;
  margin-bottom: 32px;
}

/* Tabs */
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

/* Smash */
.smash-area {
  text-align: center;
}
.smash-container {
  position: relative;
  display: inline-block;
  margin-bottom: 32px;
}
.smash-btn {
  width: 200px;
  height: 200px;
  border-radius: 50%;
  border: none;
  background: linear-gradient(135deg, #FF6B6B, #FF8C42);
  color: white;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 32px rgba(255, 107, 107, 0.4);
  transition: transform 0.1s ease, box-shadow 0.1s ease;
  position: relative;
  z-index: 2;
}
.smash-btn:hover {
  box-shadow: 0 12px 40px rgba(255, 107, 107, 0.5);
}
.smash-btn:active,
.smash-btn.shaking {
  animation: shake 0.15s ease;
}
.smash-btn.crack {
  background: linear-gradient(135deg, #FF6B6B, #e74c3c);
}
.smash-btn.heavy-crack {
  background: linear-gradient(135deg, #e74c3c, #c0392b);
  box-shadow: 0 8px 32px rgba(231, 76, 60, 0.5);
}

.particle {
  position: absolute;
  font-size: 1.5rem;
  pointer-events: none;
  animation: particle-fly 0.8s ease-out forwards;
  z-index: 10;
}

@keyframes particle-fly {
  0% {
    transform: translate(0, 0) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(
      calc((var(--rand-x, 0) - 0.5) * 120px),
      calc(-80px - var(--rand-y, 0) * 40px)
    ) scale(0.3);
    opacity: 0;
  }
}
.particle:nth-child(odd) { --rand-x: 0.8; --rand-y: 0.3; }
.particle:nth-child(even) { --rand-x: 0.2; --rand-y: 0.7; }
.particle:nth-child(3n) { --rand-x: 0.5; --rand-y: 0.9; }

.click-count {
  font-size: 1.2rem;
  color: var(--text-secondary);
  margin-bottom: 16px;
}
.click-count strong {
  color: var(--accent-coral);
  font-size: 1.6rem;
}
.progress-bar {
  width: 300px;
  height: 8px;
  background: var(--sidebar-border);
  border-radius: 4px;
  margin: 0 auto 12px;
  overflow: hidden;
}
.progress-fill {
  height: 100%;
  background: linear-gradient(to right, #7EC8B7, #FFD93D, #FF6B6B);
  border-radius: 4px;
  transition: width 0.2s ease;
}
.progress-hint {
  font-size: 0.85rem;
  color: var(--text-muted);
}

/* Finish */
.finish-area {
  text-align: center;
  padding: 60px 0;
}
.bloom-emoji {
  font-size: 5rem;
  margin-bottom: 24px;
  animation: float 3s ease-in-out infinite;
}
.finish-title {
  font-family: var(--font-display);
  font-size: 1.8rem;
  margin-bottom: 12px;
}
.finish-subtitle {
  font-size: 1.1rem;
  color: var(--text-secondary);
  margin-bottom: 36px;
}

/* Doodle */
.doodle-area {
  text-align: center;
}
.doodle-toolbar {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 32px;
  margin-bottom: 20px;
}
.color-picker {
  display: flex;
  gap: 8px;
}
.color-dot {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  border: 3px solid transparent;
  cursor: pointer;
  transition: all 0.15s ease;
}
.color-dot.active {
  border-color: var(--text-primary);
  transform: scale(1.15);
}
.brush-sizes {
  display: flex;
  gap: 8px;
}
.size-btn {
  padding: 6px 16px;
  border: 2px solid var(--sidebar-border);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-secondary);
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.15s ease;
}
.size-btn.active {
  background: var(--accent-peach);
  border-color: var(--accent-peach);
  color: var(--text-primary);
}

.doodle-canvas {
  display: block;
  margin: 0 auto 20px;
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-soft);
  cursor: crosshair;
  background: #FFFBF5;
}

.doodle-actions {
  display: flex;
  justify-content: center;
  gap: 16px;
}
</style>
