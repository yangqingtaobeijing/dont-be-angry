<script setup lang="ts">
import { ref, computed } from 'vue'
import { store, addGratitude, checkAchievements } from '../store'

const items = ref<[string, string, string]>(['', '', ''])
const isSaved = ref(false)
const showHistory = ref(false)

const placeholders = [
  '比如...今天的天气很好',
  '比如...有人对你微笑了',
  '比如...涛哥虽然笨但很爱你',
]

const filledCount = computed(() => items.value.filter(i => i.trim()).length)
const canSave = computed(() => filledCount.value === 3)

const history = computed(() => {
  return [...store.gratitudeEntries].sort((a, b) => b.createdAt - a.createdAt)
})

function save(): void {
  if (!canSave.value) return
  addGratitude([...items.value] as [string, string, string])
  checkAchievements()
  isSaved.value = true
}

function reset(): void {
  items.value = ['', '', '']
  isSaved.value = false
}
</script>

<template>
  <div class="gratitude-page">
    <h1 class="page-title animate-fade-in-up">感恩日记 📝</h1>
    <p class="page-subtitle animate-fade-in-up" style="animation-delay: 0.1s">
      生活里还是有很多美好的小事呢 🌸<br>
      试着写下 3 件让你感恩的事情吧
    </p>

    <div class="gratitude-content" style="max-width: 640px; margin: 0 auto;">
      <template v-if="!isSaved">
        <div
          v-for="(_, i) in items"
          :key="i"
          class="gratitude-card card animate-fade-in-up"
          :style="{ animationDelay: `${0.15 * (i + 1)}s` }"
        >
          <span class="card-number">{{ i + 1 }}.</span>
          <span class="card-heart" :class="{ lit: items[i].trim() }">
            {{ items[i].trim() ? '❤️' : '🤍' }}
          </span>
          <input
            v-model="items[i]"
            class="gratitude-input"
            :placeholder="placeholders[i]"
            type="text"
          />
        </div>

        <div class="save-area animate-fade-in-up" style="animation-delay: 0.5s">
          <button class="btn-primary" :disabled="!canSave" @click="save">
            保存今天的感恩 ✨
          </button>
        </div>
      </template>

      <template v-else>
        <div class="saved-area animate-fade-in-up">
          <div class="saved-emoji">🎉</div>
          <h2 class="saved-title">谢谢你看到了这些美好！</h2>
          <p class="saved-subtitle">每一份感恩都让生活更温暖</p>
          <button class="btn-secondary" @click="reset">再写一篇 📝</button>
        </div>
      </template>

      <!-- History -->
      <div class="history-section" style="margin-top: 48px;">
        <button class="history-toggle" @click="showHistory = !showHistory">
          你已经写了 {{ store.gratitudeEntries.length }} 篇感恩日记
          {{ showHistory ? '▲' : '▼' }}
        </button>

        <transition name="fade-up">
          <div v-if="showHistory && history.length > 0" class="history-list">
            <div v-for="entry in history" :key="entry.id" class="history-item card">
              <p class="history-date">{{ entry.date }}</p>
              <ul class="history-items">
                <li v-for="(item, i) in entry.items" :key="i">{{ item }}</li>
              </ul>
            </div>
          </div>
        </transition>
      </div>
    </div>
  </div>
</template>

<style scoped>
.gratitude-page {
  max-width: 800px;
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
  line-height: 1.7;
  margin-bottom: 48px;
}

.gratitude-card {
  display: flex;
  align-items: center;
  gap: 14px;
  padding: 18px 24px;
  margin-bottom: 14px;
}
.card-number {
  font-weight: 700;
  color: var(--text-muted);
  font-size: 1.1rem;
  flex-shrink: 0;
}
.card-heart {
  font-size: 1.3rem;
  flex-shrink: 0;
  transition: transform 0.3s var(--ease-smooth);
}
.card-heart.lit {
  transform: scale(1.2);
}
.gratitude-input {
  flex: 1;
  padding: 10px 16px;
  border: 1px solid var(--sidebar-border);
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease;
}
.gratitude-input:focus {
  border-color: var(--accent-peach);
}
.gratitude-input::placeholder {
  color: var(--text-muted);
}

.save-area {
  text-align: center;
  margin-top: 24px;
}

/* Saved */
.saved-area {
  text-align: center;
  padding: 48px 0;
}
.saved-emoji {
  font-size: 4rem;
  margin-bottom: 20px;
}
.saved-title {
  font-family: var(--font-display);
  font-size: 1.6rem;
  margin-bottom: 12px;
}
.saved-subtitle {
  color: var(--text-secondary);
  margin-bottom: 28px;
}

/* History */
.history-section {
  text-align: center;
}
.history-toggle {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 0.95rem;
  cursor: pointer;
  padding: 8px 16px;
  transition: color 0.2s ease;
}
.history-toggle:hover {
  color: var(--text-primary);
}
.history-list {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.history-item {
  padding: 20px 24px;
  text-align: left;
}
.history-date {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 10px;
}
.history-items {
  list-style: none;
  padding: 0;
}
.history-items li {
  padding: 4px 0;
  color: var(--text-primary);
  font-size: 0.95rem;
}
.history-items li::before {
  content: '💛 ';
}

.fade-up-enter-active { transition: all 0.4s ease; }
.fade-up-enter-from { opacity: 0; transform: translateY(15px); }
</style>
