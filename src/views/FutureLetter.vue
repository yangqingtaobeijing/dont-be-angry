<script setup lang="ts">
import { ref, computed } from 'vue'
import { store, addLetter, markLetterRead, deleteLetter } from '../store'

const letterContent = ref('')
const showSealed = ref(false)
const viewingLetter = ref<string | null>(null)
const showMailbox = ref(false)

const today = computed(() => {
  const d = new Date()
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
})

const sortedLetters = computed(() =>
  [...store.letters].sort((a, b) => b.writtenAt - a.writtenAt),
)

const unreadCount = computed(() =>
  store.letters.filter((l) => !l.isRead).length,
)

function sealLetter(): void {
  if (!letterContent.value.trim()) return
  addLetter(letterContent.value.trim())
  letterContent.value = ''
  showSealed.value = true
  setTimeout(() => {
    showSealed.value = false
  }, 4000)
}

function openLetter(id: string): void {
  markLetterRead(id)
  viewingLetter.value = id
}

function closeLetter(): void {
  viewingLetter.value = null
}

function removeLetter(id: string): void {
  deleteLetter(id)
  if (viewingLetter.value === id) {
    viewingLetter.value = null
  }
}

function getPreview(content: string): string {
  return content.length > 20 ? content.slice(0, 20) + '...' : content
}

function formatTimestamp(ts: number): string {
  const d = new Date(ts)
  return `${d.getFullYear()}年${d.getMonth() + 1}月${d.getDate()}日`
}

const currentViewLetter = computed(() =>
  store.letters.find((l) => l.id === viewingLetter.value),
)
</script>

<template>
  <div class="letter-page">
    <h1 class="page-title">写给开心后的自己 ✉️</h1>
    <p class="page-subtitle">等你心情好了再来打开它</p>

    <!-- Write Section -->
    <div v-if="!viewingLetter" class="write-section">
      <div class="letter-paper">
        <p class="letter-date">{{ today }}，有点不开心的你</p>
        <textarea
          v-model="letterContent"
          class="letter-textarea"
          placeholder="亲爱的开心的我..."
          rows="8"
        ></textarea>
      </div>

      <button
        :class="['seal-btn', { disabled: !letterContent.trim() }]"
        :disabled="!letterContent.trim()"
        @click="sealLetter"
      >
        封存这封信 💌
      </button>

      <Transition name="fade">
        <div v-if="showSealed" class="sealed-message">
          <span class="seal-icon">💕</span>
          <p>这封信已经封好了，等你开心的时候再来看</p>
        </div>
      </Transition>

      <!-- Mailbox -->
      <div v-if="store.letters.length > 0" class="mailbox-section">
        <button class="mailbox-toggle" @click="showMailbox = !showMailbox">
          📬 你有 {{ store.letters.length }} 封来自过去的信
          {{ unreadCount > 0 ? `（${unreadCount} 封未读）` : '' }}
          {{ showMailbox ? '▲' : '▼' }}
        </button>

        <Transition name="slide-down">
          <div v-if="showMailbox" class="letter-list">
            <div
              v-for="letter in sortedLetters"
              :key="letter.id"
              :class="['letter-item', { unread: !letter.isRead }]"
            >
              <div class="letter-info">
                <span class="letter-icon">{{ letter.isRead ? '📖' : '✉️' }}</span>
                <div class="letter-meta">
                  <span class="letter-item-date">{{ formatTimestamp(letter.writtenAt) }}</span>
                  <span class="letter-preview">{{ getPreview(letter.content) }}</span>
                </div>
              </div>
              <div class="letter-actions">
                <button class="action-btn read-btn" @click="openLetter(letter.id)">
                  {{ letter.isRead ? '再看看' : '我现在心情好了，打开看看' }}
                </button>
                <button class="action-btn del-btn" @click="removeLetter(letter.id)">🗑️</button>
              </div>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <!-- View Letter -->
    <Transition name="fade">
      <div v-if="viewingLetter && currentViewLetter" class="view-section">
        <div class="view-paper">
          <p class="view-date">
            写于 {{ formatTimestamp(currentViewLetter.writtenAt) }}
          </p>
          <div class="view-content">
            {{ currentViewLetter.content }}
          </div>
          <p class="view-note">
            那时候的你还在为这件事烦恼呢，现在是不是觉得没什么了？😊
          </p>
        </div>
        <div class="view-actions">
          <button class="btn-secondary" @click="closeLetter">
            把这封信珍藏起来 💝
          </button>
          <button class="btn-danger" @click="removeLetter(currentViewLetter.id)">
            删除这封信 🗑️
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.letter-page {
  min-height: 100vh;
  padding: 80px 40px 40px;
  max-width: 640px;
  margin: 0 auto;
}

.page-title {
  font-size: 36px;
  color: #5D4E42;
  text-align: center;
  margin-bottom: 8px;
  font-weight: 600;
}

.page-subtitle {
  text-align: center;
  color: #8B7E74;
  font-size: 18px;
  margin-bottom: 40px;
}

/* Letter Paper */
.letter-paper,
.view-paper {
  background: #FFF8E7;
  border-radius: 20px;
  padding: 32px;
  box-shadow: 0 4px 24px rgba(93, 78, 66, 0.1);
  border: 2px solid #F0E4D0;
  background-image: repeating-linear-gradient(
    transparent,
    transparent 31px,
    #F0E4D0 31px,
    #F0E4D0 32px
  );
  background-position: 0 48px;
}

.letter-date,
.view-date {
  color: #8B7E74;
  font-size: 15px;
  margin: 0 0 20px;
  font-style: italic;
}

.letter-textarea {
  width: 100%;
  border: none;
  background: transparent;
  font-size: 16px;
  color: #5D4E42;
  resize: vertical;
  outline: none;
  line-height: 32px;
  font-family: inherit;
  min-height: 200px;
  box-sizing: border-box;
}

.letter-textarea::placeholder {
  color: #C4B8AE;
}

.seal-btn {
  display: block;
  margin: 28px auto 0;
  padding: 14px 36px;
  border-radius: 9999px;
  border: none;
  background: linear-gradient(135deg, #FFCDB2, #E8A0BF);
  color: #fff;
  font-size: 17px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  box-shadow: 0 4px 16px rgba(255, 205, 178, 0.4);
}

.seal-btn:hover:not(.disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(255, 205, 178, 0.5);
}

.seal-btn.disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.sealed-message {
  text-align: center;
  margin-top: 28px;
  padding: 24px;
  background: linear-gradient(135deg, rgba(212, 240, 231, 0.3), rgba(232, 223, 245, 0.3));
  border-radius: 20px;
}

.seal-icon {
  font-size: 40px;
  display: block;
  margin-bottom: 12px;
}

.sealed-message p {
  color: #5D4E42;
  font-size: 17px;
  margin: 0;
  font-weight: 500;
}

/* Mailbox */
.mailbox-section {
  margin-top: 48px;
  border-top: 1px solid #F8E8E0;
  padding-top: 24px;
}

.mailbox-toggle {
  display: block;
  margin: 0 auto;
  background: none;
  border: none;
  color: #8B7E74;
  font-size: 15px;
  cursor: pointer;
  padding: 8px 16px;
  transition: color 0.3s;
}

.mailbox-toggle:hover {
  color: #5D4E42;
}

.letter-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
}

.letter-item {
  background: #FFFBF5;
  border: 1px solid #F8E8E0;
  border-radius: 16px;
  padding: 16px 20px;
  transition: all 0.3s;
}

.letter-item.unread {
  border-color: #E8A0BF;
  background: linear-gradient(135deg, rgba(232, 160, 191, 0.05), #FFFBF5);
}

.letter-info {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 12px;
}

.letter-icon {
  font-size: 24px;
  flex-shrink: 0;
}

.letter-meta {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.letter-item-date {
  color: #8B7E74;
  font-size: 13px;
}

.letter-preview {
  color: #5D4E42;
  font-size: 15px;
}

.letter-actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}

.action-btn {
  padding: 6px 16px;
  border-radius: 9999px;
  border: none;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.3s;
}

.read-btn {
  background: #F8E8E0;
  color: #5D4E42;
}

.read-btn:hover {
  background: #E8DFF5;
}

.del-btn {
  background: transparent;
  font-size: 16px;
  padding: 4px 8px;
  opacity: 0.5;
}

.del-btn:hover {
  opacity: 1;
}

/* View Letter */
.view-section {
  animation: fade-in-up 0.5s ease;
}

.view-content {
  color: #5D4E42;
  font-size: 17px;
  line-height: 32px;
  white-space: pre-wrap;
  min-height: 120px;
}

.view-note {
  color: #E8A0BF;
  font-size: 15px;
  font-style: italic;
  margin-top: 24px;
  text-align: center;
}

.view-actions {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: 28px;
}

.btn-secondary {
  padding: 12px 24px;
  border-radius: 9999px;
  border: none;
  background: linear-gradient(135deg, #D4F0E7, #E8DFF5);
  color: #5D4E42;
  font-size: 15px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-secondary:hover {
  transform: translateY(-2px);
}

.btn-danger {
  padding: 12px 24px;
  border-radius: 9999px;
  border: none;
  background: #F8E8E0;
  color: #8B7E74;
  font-size: 15px;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-danger:hover {
  background: #FFD4D4;
  color: #C75050;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.4s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-down-enter-active {
  transition: all 0.4s ease;
}
.slide-down-leave-active {
  transition: all 0.3s ease;
}
.slide-down-enter-from {
  opacity: 0;
  transform: translateY(-10px);
}
.slide-down-leave-to {
  opacity: 0;
}

@keyframes fade-in-up {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
