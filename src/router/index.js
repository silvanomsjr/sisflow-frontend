import { createRouter, createWebHashHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import SignView from '../views/SignView.vue'
import HomeView from '../views/HomeView.vue'

import AreaTView from '../views/Teacher/AreaTView.vue'
import AreaSView from '../views/Student/AreaSView.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView,
    meta: { allowedUsers: ['A','P'] }
  },
  {
    path: '/sign',
    name: 'sign',
    component: SignView,
    meta: { allowedUsers: ['A','P'] }
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta: { allowedUsers: ['A','P'] }
  },
  {
    path: '/areateacher',
    name: 'areateacher',
    component: AreaTView,
    meta: { allowedUsers: ['P'] }
  },
  {
    path: '/areastudent',
    name: 'areastudent',
    component: AreaSView,
    meta: { allowedUsers: ['A'] }
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router