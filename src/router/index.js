import { createRouter, createWebHistory } from 'vue-router'
import Login from '../views/Login.vue'
import Lottery from '../views/Lottery.vue'
import Profile from '../views/Profile.vue'
import Redeem from '../views/Redeem.vue'
import Admin from '../views/Admin.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/login' },
    { path: '/login', component: Login },
    { path: '/lottery', component: Lottery },
    { path: '/profile', component: Profile },
    { path: '/redeem/:id', component: Redeem }
    { path: '/admin', component: Admin }
  ]
})
export default router
