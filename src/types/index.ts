// ============================================================
// 「别生气啦」全局类型定义
// ============================================================

// ---- 主题 ----
export type ThemeName = 'garden' | 'starry' | 'ocean'

export interface ThemeConfig {
  name: ThemeName
  label: string
  emoji: string
}

// ---- 呼吸引导 ----
export type BreathPhase = 'inhale' | 'hold' | 'exhale' | 'idle'

export interface BreathConfig {
  inhaleDuration: number
  holdDuration: number
  exhaleDuration: number
  totalCycles: number
}

export interface BreathState {
  phase: BreathPhase
  currentCycle: number
  isActive: boolean
  isComplete: boolean
}

// ---- 情绪温度计 ----
export type MoodLevel = 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10

export type MoodRange = 'low' | 'medium' | 'high' | 'extreme'

export interface MoodResponse {
  range: MoodRange
  message: string
  recommendations: string[]
}

// ---- 解压互动 ----
export interface SmashStage {
  threshold: number
  buttonText: string
  effect: 'normal' | 'crack' | 'heavy-crack' | 'shatter' | 'bloom'
  message?: string
}

export interface CanvasSettings {
  brushSize: 'small' | 'medium' | 'large'
  brushColor: string
  isEraser: boolean
}

export interface Stroke {
  points: Array<{ x: number; y: number }>
  color: string
  size: number
  timestamp: number
}

// ---- 生气代价 ----
export interface AngerCostCard {
  id: string
  emoji: string
  title: string
  description: string
  comparison?: string
  accentColor: string
}

// ---- 生气清单反思 ----
export interface TimeQuestion {
  timeframe: string
  question: string
  answer?: boolean
}

export interface ReflectionEntry {
  id: string
  content: string
  answers: TimeQuestion[]
  resultType: 'all-yes' | 'mixed' | 'all-no'
  resultMessage: string
  createdAt: number
  deleted: boolean
}

// ---- 快乐清单 ----
export interface HappyItem {
  id: string
  emoji: string
  text: string
  isCustom: boolean
  checked: boolean
}

// ---- 感恩日记 ----
export interface GratitudeEntry {
  id: string
  date: string
  items: [string, string, string]
  createdAt: number
}

// ---- 成就系统 ----
export interface AchievementDef {
  id: string
  name: string
  emoji: string
  description: string
  condition: string
}

export interface AchievementState {
  id: string
  unlocked: boolean
  unlockedAt?: number
}

// ---- 涛哥留言 ----
export type MessageCategory = 'apology' | 'comfort' | 'sweet' | 'promise'

export interface TaogeMessage {
  id: string
  content: string
  category: MessageCategory
  isDefault: boolean
  createdAt: number
}

// ---- 给未来的信 ----
export interface FutureLetter {
  id: string
  content: string
  writtenAt: number
  isRead: boolean
  readAt?: number
}

// ---- 名人金句 ----
export interface Quote {
  id: string
  text: string
  author: string
  isFavorite: boolean
}

// ---- 全局应用状态 ----
export interface SessionRecord {
  id: string
  startedAt: number
  endedAt?: number
  initialMood?: MoodLevel
  finalMood?: MoodLevel
  breathingCompleted: boolean
  smashCount: number
}

export interface AppStats {
  totalSessions: number
  totalSmashClicks: number
  currentStreak: number
  lastSessionDate: string
  moodHistory: Array<{
    date: string
    mood: MoodLevel
  }>
}

export interface AppStorageData {
  version: number
  theme: ThemeName
  adminPassword: string
  breathConfig: BreathConfig
  messages: TaogeMessage[]
  customHappyItems: HappyItem[]
  gratitudeEntries: GratitudeEntry[]
  letters: FutureLetter[]
  reflections: ReflectionEntry[]
  achievements: AchievementState[]
  sessions: SessionRecord[]
  stats: AppStats
  favoriteQuotes: string[]
  onboardingDone: boolean
  nickname: string
  soundEnabled: boolean
}
