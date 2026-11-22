import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Lottery from '../views/Lottery.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/lottery', component: Lottery }
  ]
})

export default router
