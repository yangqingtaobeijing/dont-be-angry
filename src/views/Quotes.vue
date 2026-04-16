<script setup lang="ts">
import { ref, computed } from 'vue'
import { defaultQuotes } from '../data/quotes'
import { store, toggleFavoriteQuote } from '../store'

const currentIndex = ref(0)

const currentQuote = computed(() => defaultQuotes[currentIndex.value])

const isFav = computed(() => {
  return store.favoriteQuotes.includes(currentQuote.value.id)
})

function prev(): void {
  currentIndex.value = (currentIndex.value - 1 + defaultQuotes.length) % defaultQuotes.length
}

function next(): void {
  currentIndex.value = (currentIndex.value + 1) % defaultQuotes.length
}

function toggleFav(): void {
  toggleFavoriteQuote(currentQuote.value.id)
}
</script>

<template>
  <div class="quotes-page">
    <h1 class="page-title animate-fade-in-up">名人怎么说 ✨</h1>
    <p class="page-subtitle animate-fade-in-up" style="animation-delay: 0.1s">
      听听智者的声音
    </p>

    <div class="quote-display animate-fade-in-up" style="animation-delay: 0.2s">
      <button class="nav-arrow left" @click="prev" aria-label="上一条">‹</button>

      <div class="quote-card card">
        <div class="quote-mark">"</div>
        <blockquote class="quote-text">
          {{ currentQuote.text }}
        </blockquote>
        <p class="quote-author">—— {{ currentQuote.author }}</p>
        <button
          class="fav-btn"
          :class="{ active: isFav }"
          @click="toggleFav"
        >
          {{ isFav ? '❤️ 已收藏' : '🤍 收藏' }}
        </button>
      </div>

      <button class="nav-arrow right" @click="next" aria-label="下一条">›</button>
    </div>

    <p class="quote-counter">
      {{ currentIndex + 1 }} / {{ defaultQuotes.length }}
    </p>
  </div>
</template>

<style scoped>
.quotes-page {
  max-width: 700px;
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
  margin-bottom: 56px;
}

.quote-display {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 24px;
}

.nav-arrow {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid var(--sidebar-border);
  background: var(--bg-card);
  color: var(--text-secondary);
  font-size: 1.8rem;
  line-height: 1;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}
.nav-arrow:hover {
  background: var(--accent-peach);
  border-color: var(--accent-peach);
  color: var(--text-primary);
}

.quote-card {
  flex: 1;
  padding: 48px 40px;
  text-align: center;
  position: relative;
  min-height: 260px;
  display: flex;
  flex-direction: column;
  justify-content: center;
}
.quote-mark {
  font-family: Georgia, serif;
  font-size: 5rem;
  color: var(--accent-peach);
  opacity: 0.4;
  line-height: 1;
  position: absolute;
  top: 16px;
  left: 28px;
}
.quote-text {
  font-family: var(--font-display);
  font-size: 1.4rem;
  line-height: 1.8;
  color: var(--text-primary);
  margin-bottom: 20px;
  border: none;
  padding: 0;
  position: relative;
  z-index: 1;
}
.quote-author {
  color: var(--text-secondary);
  font-size: 1rem;
  margin-bottom: 20px;
}
.fav-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 8px 20px;
  border: 1px solid var(--sidebar-border);
  border-radius: var(--radius-full);
  background: transparent;
  color: var(--text-muted);
  font-size: 0.85rem;
  cursor: pointer;
  transition: all 0.2s ease;
  margin: 0 auto;
}
.fav-btn.active {
  color: var(--accent-coral);
  border-color: var(--accent-coral);
  background: rgba(255, 107, 107, 0.05);
}
.fav-btn:hover {
  border-color: var(--accent-coral);
}

.quote-counter {
  text-align: center;
  color: var(--text-muted);
  font-size: 0.9rem;
}
</style>
