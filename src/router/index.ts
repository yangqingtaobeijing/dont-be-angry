import { createRouter, createWebHashHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Welcome',
    component: () => import('../views/Welcome.vue'),
    meta: { fullscreen: true },
  },
  {
    path: '/breathe',
    name: 'Breathe',
    component: () => import('../views/Breathe.vue'),
    meta: { fullscreen: true },
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('../views/Home.vue'),
  },
  {
    path: '/stress-relief',
    name: 'StressRelief',
    component: () => import('../views/StressRelief.vue'),
  },
  {
    path: '/tao-message',
    name: 'TaoMessage',
    component: () => import('../views/TaoMessage.vue'),
  },
  {
    path: '/cost',
    name: 'AngerCost',
    component: () => import('../views/AngerCost.vue'),
  },
  {
    path: '/reflect',
    name: 'Reflect',
    component: () => import('../views/Reflect.vue'),
  },
  {
    path: '/quotes',
    name: 'Quotes',
    component: () => import('../views/Quotes.vue'),
  },
  {
    path: '/happy',
    name: 'Happy',
    component: () => import('../views/Happy.vue'),
  },
  {
    path: '/gratitude',
    name: 'Gratitude',
    component: () => import('../views/Gratitude.vue'),
  },
  {
    path: '/future-letter',
    name: 'FutureLetter',
    component: () => import('../views/FutureLetter.vue'),
  },
  {
    path: '/achievement',
    name: 'Achievement',
    component: () => import('../views/Achievement.vue'),
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/Admin.vue'),
  },
  {
    path: '/settings',
    name: 'Settings',
    component: () => import('../views/Settings.vue'),
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
})

export default router
