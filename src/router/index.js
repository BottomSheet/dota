import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('../views/HomeView.vue'),
    meta: { step: 0, title: 'PROLOGUE · The Summons' }
  },
  {
    path: '/quest/1-roshan',
    name: 'roshan',
    component: () => import('../views/Q1Roshan.vue'),
    meta: { step: 1, title: 'I · Awaken Roshan' }
  },
  {
    path: '/quest/2-invoker',
    name: 'invoker',
    component: () => import('../views/Q2Invoker.vue'),
    meta: { step: 2, title: 'II · Invoke The Spell' }
  },
  {
    path: '/quest/3-runes',
    name: 'runes',
    component: () => import('../views/Q3Runes.vue'),
    meta: { step: 3, title: 'III · The Bounty Runes' }
  },
  {
    path: '/quest/4-necropolis',
    name: 'necropolis',
    component: () => import('../views/Q4Necropolis.vue'),
    meta: { step: 4, title: 'IV · Necropolis Trial' }
  },
  {
    path: '/quest/5-shopkeeper',
    name: 'shopkeeper',
    component: () => import('../views/Q5Shopkeeper.vue'),
    meta: { step: 5, title: 'V · The Secret Shop' }
  },
  {
    path: '/quest/6-teamfight',
    name: 'teamfight',
    component: () => import('../views/Q6Teamfight.vue'),
    meta: { step: 6, title: 'VI · Teamfight at Mid' }
  },
  {
    path: '/quest/7-aegis',
    name: 'aegis',
    component: () => import('../views/Q7Aegis.vue'),
    meta: { step: 7, title: 'VII · Aegis of the Immortal' }
  },
  {
    path: '/quest/8-ancient',
    name: 'ancient',
    component: () => import('../views/Q8Ancient.vue'),
    meta: { step: 8, title: 'VIII · Push the Ancient' }
  },
  {
    path: '/finale',
    name: 'finale',
    component: () => import('../views/FinaleView.vue'),
    meta: { step: 9, title: 'IX · Victory · 21' }
  },
  { path: '/:catchAll(.*)', redirect: '/' }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() { return { top: 0 } }
})

export default router
