<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { store } from '../store'

const router = useRouter()
const showTitle = ref(false)
const showSubtitle = ref(false)
const showButton = ref(false)

onMounted(() => {
  if (store.onboardingDone) {
    router.replace('/home')
    return
  }
  setTimeout(() => { showTitle.value = true }, 300)
  setTimeout(() => { showSubtitle.value = true }, 1200)
  setTimeout(() => { showButton.value = true }, 2200)
})

function proceed(): void {
  router.push('/breathe')
}
</script>

<template>
  <div class="welcome-page">
    <!-- Floating decorations -->
    <div class="deco deco-1">🌸</div>
    <div class="deco deco-2">🌷</div>
    <div class="deco deco-3">💫</div>
    <div class="deco deco-4">🦋</div>
    <div class="deco deco-5">✨</div>

    <div class="welcome-content">
      <transition name="fade-up">
        <h1 v-if="showTitle" class="welcome-title">
          我知道你现在不开心...
        </h1>
      </transition>

      <transition name="fade-up">
        <p v-if="showSubtitle" class="welcome-subtitle">
          让我陪你待一会儿
        </p>
      </transition>

      <transition name="fade-up">
        <button v-if="showButton" class="welcome-btn" @click="proceed">
          好的 💕
        </button>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.welcome-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, #ffe4e6 0%, #fce7f3 30%, #ede9fe 60%, #dbeafe 100%);
  position: relative;
  overflow: hidden;
}

.welcome-content {
  text-align: center;
  position: relative;
  z-index: 10;
}

.welcome-title {
  font-family: var(--font-display);
  font-size: 3rem;
  font-weight: 700;
  color: #4a3728;
  margin-bottom: 20px;
  letter-spacing: 2px;
}

.welcome-subtitle {
  font-size: 1.35rem;
  color: #8b7e74;
  margin-bottom: 48px;
  letter-spacing: 1px;
}

.welcome-btn {
  display: inline-block;
  padding: 18px 56px;
  border: none;
  border-radius: var(--radius-full);
  background: linear-gradient(135deg, #ffcdb2, #e8a0bf);
  color: #4a3728;
  font-family: var(--font-display);
  font-size: 1.3rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: 0 8px 40px rgba(232, 160, 191, 0.4);
  transition: all 0.3s var(--ease-smooth);
}
.welcome-btn:hover {
  transform: scale(1.08);
  box-shadow: 0 12px 50px rgba(232, 160, 191, 0.5);
}
.welcome-btn:active {
  transform: scale(0.97);
}

/* Decorations */
.deco {
  position: absolute;
  font-size: 2rem;
  opacity: 0.3;
  animation: float-around 20s ease-in-out infinite;
  pointer-events: none;
}
.deco-1 { top: 10%; left: 10%; animation-delay: 0s; font-size: 2.5rem; }
.deco-2 { top: 20%; right: 15%; animation-delay: -4s; }
.deco-3 { bottom: 25%; left: 20%; animation-delay: -8s; }
.deco-4 { bottom: 15%; right: 10%; animation-delay: -12s; font-size: 1.8rem; }
.deco-5 { top: 40%; right: 25%; animation-delay: -16s; }

@keyframes float-around {
  0%, 100% { transform: translate(0, 0) rotate(0deg); }
  25% { transform: translate(15px, -20px) rotate(5deg); }
  50% { transform: translate(-10px, 15px) rotate(-3deg); }
  75% { transform: translate(20px, 10px) rotate(7deg); }
}

/* Transitions */
.fade-up-enter-active {
  transition: opacity 0.8s ease, transform 0.8s ease;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(30px);
}
.fade-up-enter-to {
  opacity: 1;
  transform: translateY(0);
}
</style>
