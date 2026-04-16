import type { AchievementDef } from '../types'

export const achievementDefs: AchievementDef[] = [
  {
    id: 'first-calm',
    name: '初次冷静',
    emoji: '🌱',
    description: '第一次完成呼吸引导',
    condition: '完成第 1 次呼吸引导',
  },
  {
    id: 'breath-master',
    name: '呼吸大师',
    emoji: '🧘',
    description: '完成 10 次呼吸引导',
    condition: '累计完成 10 次呼吸引导',
  },
  {
    id: 'smash-terminator',
    name: '暴走终结者',
    emoji: '🥊',
    description: '点击按钮累计 500 次',
    condition: '疯狂点击按钮累计 500 次',
  },
  {
    id: 'journal-pro',
    name: '日记达人',
    emoji: '📖',
    description: '写满 7 篇感恩日记',
    condition: '感恩日记累计 7 篇',
  },
  {
    id: 'time-sage',
    name: '时间智者',
    emoji: '⏳',
    description: '在反思中选择全部"不会"',
    condition: '反思清单中选择全部"不会"',
  },
  {
    id: 'mood-expert',
    name: '情绪管理专家',
    emoji: '🏆',
    description: '累计消气 30 次',
    condition: '累计使用 30 次',
  },
  {
    id: 'best-gf',
    name: '涛哥最佳女友',
    emoji: '👑',
    description: '坚持使用 100 天',
    condition: '使用页面累计 100 天',
  },
]
