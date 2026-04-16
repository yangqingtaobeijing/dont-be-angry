<script setup lang="ts">
import { ref, computed } from 'vue'
import { addReflection, unlockAchievement } from '../store'
import type { TimeQuestion, ReflectionEntry } from '../types'

const angerContent = ref('')
const hasSubmitted = ref(false)
const currentQuestionIndex = ref(-1)
const showResult = ref(false)

const questions = ref<TimeQuestion[]>([
  { timeframe: '1小时', question: '这件事，1小时后你还会这么生气吗？' },
  { timeframe: '一周', question: '那一周后呢？' },
  { timeframe: '一个月', question: '一个月后呢？' },
  { timeframe: '一年', question: '一年后呢？' },
])

const visibleQuestions = computed(() => {
  return questions.value.slice(0, currentQuestionIndex.value + 1)
})

const resultMessage = computed(() => {
  const answers = questions.value.map(q => q.answer)
  const yesCount = answers.filter(a => a === true).length
  if (yesCount === 4) {
    return '嗯，看来这件事确实很重要。但越是重要的事，越需要冷静下来好好处理，对吗？ 💪'
  }
  if (yesCount === 0) {
    return '你看！连你自己都觉得过段时间就没什么了。所以现在何必让自己这么难受呢？ 😊'
  }
  return '看，随着时间推移，这件事的影响在变小。不值得为它一直难过呀 🌸'
})

const resultType = computed<'all-yes' | 'mixed' | 'all-no'>(() => {
  const answers = questions.value.map(q => q.answer)
  const yesCount = answers.filter(a => a === true).length
  if (yesCount === 4) return 'all-yes'
  if (yesCount === 0) return 'all-no'
  return 'mixed'
})

function submitContent(): void {
  if (!angerContent.value.trim()) return
  hasSubmitted.value = true
  setTimeout(() => {
    currentQuestionIndex.value = 0
  }, 500)
}

function answerQuestion(index: number, answer: boolean): void {
  questions.value[index].answer = answer
  if (index < questions.value.length - 1) {
    setTimeout(() => {
      currentQuestionIndex.value = index + 1
    }, 800)
  } else {
    setTimeout(() => {
      showResult.value = true
      saveReflection()
    }, 800)
  }
}

function saveReflection(): void {
  const entry: ReflectionEntry = {
    id: `ref-${Date.now()}`,
    content: angerContent.value,
    answers: questions.value.map(q => ({ ...q })),
    resultType: resultType.value,
    resultMessage: resultMessage.value,
    createdAt: Date.now(),
    deleted: false,
  }
  addReflection(entry)

  if (resultType.value === 'all-no') {
    unlockAchievement('time-sage')
  }
}

function reset(): void {
  angerContent.value = ''
  hasSubmitted.value = false
  currentQuestionIndex.value = -1
  showResult.value = false
  questions.value.forEach(q => { q.answer = undefined })
}
</script>

<template>
  <div class="reflect-page">
    <h1 class="page-title animate-fade-in-up">来，告诉我发生了什么？ ✏️</h1>
    <p class="page-subtitle animate-fade-in-up" style="animation-delay: 0.1s">
      写下来会好受一些
    </p>

    <div class="reflect-content" style="max-width: 640px; margin: 0 auto;">
      <!-- Input -->
      <div v-if="!hasSubmitted" class="input-area animate-fade-in-up" style="animation-delay: 0.2s">
        <textarea
          v-model="angerContent"
          class="anger-input"
          placeholder="在这里写下让你生气的事情..."
          rows="5"
        ></textarea>
        <div class="input-actions">
          <button class="btn-primary" @click="submitContent" :disabled="!angerContent.trim()">
            写好了 →
          </button>
        </div>
      </div>

      <!-- Questions -->
      <div v-if="hasSubmitted && !showResult" class="questions-area">
        <div class="written-content card">
          <p class="written-label">你写下的：</p>
          <p class="written-text">{{ angerContent }}</p>
        </div>

        <transition-group name="question-slide" tag="div" class="questions-list">
          <div
            v-for="(q, i) in visibleQuestions"
            :key="q.timeframe"
            class="question-card card"
          >
            <p class="question-text">{{ q.question }}</p>
            <div v-if="q.answer === undefined" class="question-buttons">
              <button class="answer-btn yes" @click="answerQuestion(i, true)">会</button>
              <button class="answer-btn no" @click="answerQuestion(i, false)">不会</button>
            </div>
            <div v-else class="answer-result">
              <span :class="q.answer ? 'answered-yes' : 'answered-no'">
                {{ q.answer ? '会 😤' : '不会 😌' }}
              </span>
            </div>
          </div>
        </transition-group>
      </div>

      <!-- Result -->
      <transition name="fade-up">
        <div v-if="showResult" class="result-area">
          <div class="written-content card" style="margin-bottom: 24px;">
            <p class="written-label">你写下的：</p>
            <p class="written-text">{{ angerContent }}</p>
          </div>

          <div class="result-card card">
            <p class="result-text">{{ resultMessage }}</p>
          </div>

          <div class="result-actions">
            <button class="btn-secondary" @click="reset">
              再想想别的事 🔄
            </button>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<style scoped>
.reflect-page {
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
  margin-bottom: 48px;
}

.anger-input {
  width: 100%;
  min-height: 140px;
  padding: 20px 24px;
  border: 2px solid var(--sidebar-border);
  border-radius: var(--radius-md);
  background: var(--bg-card);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-size: 1rem;
  line-height: 1.6;
  resize: vertical;
  outline: none;
  transition: border-color 0.2s ease;
}
.anger-input:focus {
  border-color: var(--accent-peach);
}
.anger-input::placeholder {
  color: var(--text-muted);
}
.input-actions {
  text-align: right;
  margin-top: 16px;
}

.written-content {
  padding: 20px 24px;
  margin-bottom: 32px;
}
.written-label {
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: 8px;
}
.written-text {
  font-size: 1rem;
  color: var(--text-primary);
  line-height: 1.6;
}

.questions-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.question-card {
  padding: 24px 28px;
  text-align: center;
}
.question-text {
  font-family: var(--font-display);
  font-size: 1.15rem;
  color: var(--text-primary);
  margin-bottom: 20px;
}
.question-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
}
.answer-btn {
  padding: 10px 36px;
  border: 2px solid var(--sidebar-border);
  border-radius: var(--radius-full);
  background: transparent;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}
.answer-btn.yes:hover {
  background: #FFE4E4;
  border-color: #FF6B6B;
  color: #FF6B6B;
}
.answer-btn.no:hover {
  background: #E4F5EF;
  border-color: #7EC8B7;
  color: #2a8c6e;
}
.answer-result {
  font-size: 1.05rem;
  font-weight: 600;
}
.answered-yes { color: var(--accent-coral); }
.answered-no { color: var(--accent-mint); }

.result-card {
  padding: 36px 32px;
  text-align: center;
  margin-bottom: 24px;
}
.result-text {
  font-family: var(--font-display);
  font-size: 1.3rem;
  color: var(--text-primary);
  line-height: 1.7;
}
.result-actions {
  text-align: center;
}

/* Transitions */
.question-slide-enter-active {
  transition: all 0.5s ease;
}
.question-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-up-enter-active {
  transition: all 0.6s ease;
}
.fade-up-enter-from {
  opacity: 0;
  transform: translateY(20px);
}
</style>
