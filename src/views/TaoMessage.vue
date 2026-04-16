<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getRandomMessage } from '../store'
import type { TaogeMessage } from '../types'

const currentMessage = ref<TaogeMessage | undefined>(undefined)
const isOpened = ref(false)
const isAnimating = ref(false)

onMounted(() => {
  currentMessage.value = getRandomMessage()
})

function openEnvelope(): void {
  if (isAnimating.value) return
  isAnimating.value = true
  setTimeout(() => {
    isOpened.value = true
    isAnimating.value = false
  }, 600)
}

function nextMessage(): void {
  isOpened.value = false
  setTimeout(() => {
    currentMessage.value = getRandomMessage()
    openEnvelope()
  }, 400)
}
</script>

<template>
  <div class="tao-message-page">
    <h1 class="page-title animate-fade-in-up">涛哥有话说 💌</h1>
    <p class="page-subtitle animate-fade-in-up" style="animation-delay: 0.1s">
      这是涛哥专门写给你的～
    </p>

    <div class="envelope-area animate-fade-in-up" style="animation-delay: 0.2s">
      <!-- Envelope -->
      <div
        v-if="!isOpened"
        class="envelope"
        :class="{ opening: isAnimating }"
        @click="openEnvelope"
      >
        <div class="envelope-body">
          <div class="envelope-flap"></div>
          <div class="envelope-front">
            <span class="envelope-heart">💌</span>
            <p class="envelope-hint">点击打开</p>
          </div>
        </div>
      </div>

      <!-- Message Card -->
      <transition name="message-pop">
        <div v-if="isOpened && currentMessage" class="message-card">
          <div class="message-deco">💌</div>
          <blockquote class="message-content">
            "{{ currentMessage.content }}"
          </blockquote>
          <p class="message-author">—— 涛哥 ❤️</p>
          <div class="message-actions">
            <button class="btn-primary" @click="nextMessage">
              换一条 💌
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.tao-message-page {
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}
.page-title {
  font-family: var(--font-display);
  font-size: 1.8rem;
  margin-bottom: 12px;
}
.page-subtitle {
  color: var(--text-secondary);
  font-size: 1.05rem;
  margin-bottom: 56px;
}

.envelope-area {
  display: flex;
  justify-content: center;
  min-height: 300px;
  align-items: center;
}

/* Envelope */
.envelope {
  width: 280px;
  height: 200px;
  perspective: 600px;
  cursor: pointer;
  transition: transform 0.3s ease;
}
.envelope:hover {
  transform: scale(1.05);
}
.envelope-body {
  width: 100%;
  height: 100%;
  position: relative;
}
.envelope-front {
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #fff5ee, #ffe4e6);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-warm);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  position: relative;
  z-index: 2;
}
.envelope-flap {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 50%;
  background: linear-gradient(135deg, #ffcdb2, #e8a0bf);
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  transform-origin: top center;
  z-index: 3;
  clip-path: polygon(0 0, 100% 0, 50% 100%);
  transition: transform 0.6s ease;
}
.envelope.opening .envelope-flap {
  transform: rotateX(180deg);
}
.envelope-heart {
  font-size: 3rem;
}
.envelope-hint {
  color: var(--text-muted);
  font-size: 0.85rem;
}

/* Message Card */
.message-card {
  background: linear-gradient(135deg, #fff8f0, #fff0f5);
  border-radius: var(--radius-lg);
  padding: 48px 40px;
  box-shadow: var(--shadow-warm);
  max-width: 480px;
  width: 100%;
}
.message-deco {
  font-size: 2.5rem;
  margin-bottom: 24px;
}
.message-content {
  font-family: var(--font-display);
  font-size: 1.5rem;
  line-height: 1.8;
  color: var(--text-primary);
  margin-bottom: 20px;
  border: none;
  padding: 0;
}
.message-author {
  color: var(--text-secondary);
  font-size: 1rem;
  margin-bottom: 32px;
}
.message-actions {
  display: flex;
  justify-content: center;
}

/* Transition */
.message-pop-enter-active {
  transition: all 0.5s var(--ease-smooth);
}
.message-pop-leave-active {
  transition: all 0.3s ease;
}
.message-pop-enter-from {
  opacity: 0;
  transform: scale(0.8) translateY(20px);
}
.message-pop-leave-to {
  opacity: 0;
  transform: scale(0.9);
}
</style>
