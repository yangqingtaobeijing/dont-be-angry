import { reactive, watch } from 'vue'
import type {
  AppStorageData,
  ThemeName,
  TaogeMessage,
  GratitudeEntry,
  FutureLetter,
  ReflectionEntry,
  AchievementState,
  MoodLevel,
} from '../types'
import { defaultMessages } from '../data/defaultMessages'
import { achievementDefs } from '../data/achievements'

const STORAGE_KEY = 'dont-be-angry-app'
const CURRENT_VERSION = 1

function createDefaultData(): AppStorageData {
  return {
    version: CURRENT_VERSION,
    theme: 'garden',
    adminPassword: 'taoge520',
    breathConfig: {
      inhaleDuration: 4000,
      holdDuration: 2000,
      exhaleDuration: 6000,
      totalCycles: 3,
    },
    messages: [...defaultMessages],
    customHappyItems: [],
    gratitudeEntries: [],
    letters: [],
    reflections: [],
    achievements: achievementDefs.map((d) => ({
      id: d.id,
      unlocked: false,
    })),
    sessions: [],
    stats: {
      totalSessions: 0,
      totalSmashClicks: 0,
      currentStreak: 0,
      lastSessionDate: '',
      moodHistory: [],
    },
    favoriteQuotes: [],
    onboardingDone: false,
    nickname: '',
    soundEnabled: false,
  }
}

function loadFromStorage(): AppStorageData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw) as AppStorageData
      // Merge defaults for missing keys
      const defaults = createDefaultData()
      return { ...defaults, ...parsed, stats: { ...defaults.stats, ...parsed.stats } }
    }
  } catch {
    // ignore corrupt data
  }
  return createDefaultData()
}

function saveToStorage(data: AppStorageData): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
  } catch {
    // localStorage full or unavailable
  }
}

export const store = reactive(loadFromStorage())

// Auto-persist on changes
watch(
  () => store,
  (val) => {
    saveToStorage(val as AppStorageData)
  },
  { deep: true },
)

// ---- Theme ----
export function setTheme(theme: ThemeName): void {
  store.theme = theme
  document.documentElement.setAttribute('data-theme', theme)
}

export function initTheme(): void {
  document.documentElement.setAttribute('data-theme', store.theme)
}

// ---- Onboarding ----
export function completeOnboarding(): void {
  store.onboardingDone = true
}

// ---- Messages (涛哥留言) ----
export function addMessage(content: string, category: TaogeMessage['category']): void {
  store.messages.push({
    id: `msg-${Date.now()}`,
    content,
    category,
    isDefault: false,
    createdAt: Date.now(),
  })
}

export function updateMessage(id: string, content: string, category: TaogeMessage['category']): void {
  const msg = store.messages.find((m) => m.id === id)
  if (msg) {
    msg.content = content
    msg.category = category
  }
}

export function deleteMessage(id: string): void {
  const idx = store.messages.findIndex((m) => m.id === id)
  if (idx !== -1) store.messages.splice(idx, 1)
}

export function getRandomMessage(): TaogeMessage | undefined {
  if (store.messages.length === 0) return undefined
  return store.messages[Math.floor(Math.random() * store.messages.length)]
}

// ---- Gratitude ----
export function addGratitude(items: [string, string, string]): void {
  const today = new Date().toISOString().slice(0, 10)
  const existing = store.gratitudeEntries.find((e) => e.date === today)
  if (existing) {
    existing.items = items
  } else {
    store.gratitudeEntries.push({
      id: `grat-${Date.now()}`,
      date: today,
      items,
      createdAt: Date.now(),
    })
  }
}

// ---- Reflections ----
export function addReflection(entry: ReflectionEntry): void {
  store.reflections.push(entry)
}

// ---- Stats ----
export function recordSmashClicks(count: number): void {
  store.stats.totalSmashClicks += count
  checkAchievements()
}

export function recordMood(mood: MoodLevel): void {
  const today = new Date().toISOString().slice(0, 10)
  store.stats.moodHistory.push({ date: today, mood })
}

export function recordSession(): void {
  store.stats.totalSessions += 1
  const today = new Date().toISOString().slice(0, 10)
  if (store.stats.lastSessionDate === today) return
  // Check streak
  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const yesterdayStr = yesterday.toISOString().slice(0, 10)
  if (store.stats.lastSessionDate === yesterdayStr) {
    store.stats.currentStreak += 1
  } else if (store.stats.lastSessionDate !== today) {
    store.stats.currentStreak = 1
  }
  store.stats.lastSessionDate = today
  checkAchievements()
}

// ---- Achievements ----
export function unlockAchievement(id: string): void {
  const ach = store.achievements.find((a) => a.id === id)
  if (ach && !ach.unlocked) {
    ach.unlocked = true
    ach.unlockedAt = Date.now()
  }
}

export function checkAchievements(): void {
  const s = store.stats
  // first-calm: handled externally after breath completion
  if (s.totalSmashClicks >= 500) unlockAchievement('smash-terminator')
  if (store.gratitudeEntries.length >= 7) unlockAchievement('journal-pro')
  if (s.totalSessions >= 30) unlockAchievement('mood-expert')
}

// ---- Letters (给未来的信) ----
export function addLetter(content: string): void {
  store.letters.push({
    id: `letter-${Date.now()}`,
    content,
    writtenAt: Date.now(),
    isRead: false,
  })
}

export function markLetterRead(id: string): void {
  const letter = store.letters.find((l) => l.id === id)
  if (letter) {
    letter.isRead = true
    letter.readAt = Date.now()
  }
}

export function deleteLetter(id: string): void {
  const idx = store.letters.findIndex((l) => l.id === id)
  if (idx !== -1) store.letters.splice(idx, 1)
}

// ---- Gratitude deletion ----
export function deleteGratitude(id: string): void {
  const idx = store.gratitudeEntries.findIndex((e) => e.id === id)
  if (idx !== -1) store.gratitudeEntries.splice(idx, 1)
}

// ---- Settings ----
export function setNickname(name: string): void {
  store.nickname = name
}

export function setSoundEnabled(enabled: boolean): void {
  store.soundEnabled = enabled
}

export function clearAllData(): void {
  const defaults = createDefaultData()
  Object.assign(store, defaults)
}

// ---- Data export/import ----
export function exportData(): string {
  return JSON.stringify(store, null, 2)
}

export function importData(json: string): boolean {
  try {
    const data = JSON.parse(json) as AppStorageData
    const defaults = createDefaultData()
    Object.assign(store, { ...defaults, ...data, stats: { ...defaults.stats, ...data.stats } })
    return true
  } catch {
    return false
  }
}

// ---- Favorites (quotes) ----
export function toggleFavoriteQuote(id: string): void {
  const idx = store.favoriteQuotes.indexOf(id)
  if (idx === -1) {
    store.favoriteQuotes.push(id)
  } else {
    store.favoriteQuotes.splice(idx, 1)
  }
}

// ---- Admin ----
export function verifyAdminPassword(pw: string): boolean {
  return pw === store.adminPassword
}

export function changeAdminPassword(newPw: string): void {
  store.adminPassword = newPw
}
