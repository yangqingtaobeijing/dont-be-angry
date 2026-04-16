<script setup lang="ts">
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { store, setTheme } from './store'
import type { ThemeName } from './types'

const route = useRoute()
const router = useRouter()

const isFullscreen = computed(() => route.meta.fullscreen === true)

const themes: { name: ThemeName; emoji: string; label: string }[] = [
  { name: 'garden', emoji: '🌸', label: '花园' },
  { name: 'starry', emoji: '🌙', label: '星空' },
  { name: 'ocean', emoji: '🌊', label: '海洋' },
]

interface NavItem {
  path: string
  emoji: string
  label: string
}

const navItems: NavItem[] = [
  { path: '/home', emoji: '🏠', label: '主页' },
  { path: '/stress-relief', emoji: '🥊', label: '解压互动' },
  { path: '/tao-message', emoji: '💌', label: '涛哥的话' },
  { path: '/cost', emoji: '📊', label: '生气的代价' },
  { path: '/reflect', emoji: '🤔', label: '反思一下' },
  { path: '/quotes', emoji: '✨', label: '名人金句' },
  { path: '/happy', emoji: '🎉', label: '快乐清单' },
  { path: '/gratitude', emoji: '📝', label: '感恩日记' },
  { path: '/achievement', emoji: '🏆', label: '成就墙' },
]

function navigateTo(path: string): void {
  router.push(path)
}

function cycleTheme(): void {
  const idx = themes.findIndex((t) => t.name === store.theme)
  const next = themes[(idx + 1) % themes.length]
  setTheme(next.name)
}

const currentThemeEmoji = computed(() => {
  return themes.find((t) => t.name === store.theme)?.emoji ?? '🌸'
})
</script>

<template>
  <div class="app-root" :class="{ 'is-fullscreen': isFullscreen }">
    <!-- Sidebar -->
    <aside v-if="!isFullscreen" class="sidebar">
      <div class="sidebar-brand" @click="navigateTo('/home')">
        <span class="brand-emoji">🌸</span>
        <span class="brand-text">别生气啦</span>
      </div>

      <nav class="sidebar-nav">
        <button
          v-for="item in navItems"
          :key="item.path"
          class="nav-item"
          :class="{ active: route.path === item.path }"
          @click="navigateTo(item.path)"
        >
          <span class="nav-emoji">{{ item.emoji }}</span>
          <span class="nav-label">{{ item.label }}</span>
        </button>
      </nav>

      <div class="sidebar-footer">
        <button class="theme-toggle" @click="cycleTheme" :title="`切换主题`">
          {{ currentThemeEmoji }} 切换主题
        </button>
        <button class="nav-item small" @click="navigateTo('/admin')">
          <span class="nav-emoji">⚙️</span>
          <span class="nav-label">管理面板</span>
        </button>
        <button class="nav-item small" @click="navigateTo('/settings')">
          <span class="nav-emoji">🔧</span>
          <span class="nav-label">设置</span>
        </button>
      </div>
    </aside>

    <!-- Main content -->
    <main :class="isFullscreen ? 'content-fullscreen' : 'content-with-sidebar'">
      <router-view v-slot="{ Component }">
        <transition name="page" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </main>
  </div>
</template>

<style scoped>
.app-root {
  display: flex;
  min-height: 100vh;
}

/* ---- Sidebar ---- */
.sidebar {
  position: fixed;
  top: 0;
  left: 0;
  width: 220px;
  height: 100vh;
  background: var(--sidebar-bg);
  border-right: 1px solid var(--sidebar-border);
  display: flex;
  flex-direction: column;
  padding: 24px 16px;
  z-index: 50;
  transition: background var(--duration-slow) ease;
}

.sidebar-brand {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  margin-bottom: 32px;
  cursor: pointer;
  border-radius: var(--radius-sm);
  transition: background 0.2s ease;
}
.sidebar-brand:hover {
  background: rgba(255, 107, 107, 0.08);
}
.brand-emoji {
  font-size: 1.6rem;
}
.brand-text {
  font-family: var(--font-display);
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: none;
  background: transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.95rem;
  color: var(--text-secondary);
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;
}
.nav-item:hover {
  background: rgba(255, 107, 107, 0.08);
  color: var(--text-primary);
}
.nav-item.active {
  background: var(--accent-peach);
  color: var(--text-primary);
  font-weight: 600;
  box-shadow: 0 2px 12px rgba(255, 205, 178, 0.3);
}
.nav-item.small {
  padding: 8px 12px;
  font-size: 0.85rem;
}
.nav-emoji {
  font-size: 1.15rem;
  width: 24px;
  text-align: center;
  flex-shrink: 0;
}
.nav-label {
  white-space: nowrap;
}

.sidebar-footer {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 16px;
  border-top: 1px solid var(--sidebar-border);
  margin-top: 12px;
}

.theme-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border: none;
  background: transparent;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.9rem;
  color: var(--text-secondary);
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;
}
.theme-toggle:hover {
  background: rgba(255, 107, 107, 0.08);
  color: var(--text-primary);
}

/* ---- Content Area ---- */
.content-with-sidebar {
  margin-left: 220px;
  flex: 1;
  min-height: 100vh;
  padding: 40px;
  transition: background var(--duration-slow) ease;
}

.content-fullscreen {
  flex: 1;
  min-height: 100vh;
}
</style>
