import { createRouter, createWebHistory } from 'vue-router'
import LoginView from '../views/LoginView.vue'
import SignView from '../views/SignView.vue'
import HomeView from '../views/HomeView.vue'
import DSolicitationView from '../views/DynamicSolicitationView.vue'

import IntBeginAdvisorSelection from '../views/IntershipBeginning/AdvisorSelection.vue'

import AreaCView from '../views/Coordinator/AreaCView.vue'
import AreaPView from '../views/Advisor/AreaPView.vue'
import AreaSView from '../views/Student/AreaSView.vue'

const routes = [
  {
    path: '/',
    name: 'login',
    component: LoginView,
    meta: { allowedUsers: 'ALL' }
  },
  {
    path: '/sign',
    name: 'sign',
    component: SignView,
    meta: { allowedUsers: 'ALL' }
  },
  {
    path: '/home',
    name: 'home',
    component: HomeView,
    meta: { allowedUsers: 'ALL' }
  },
  {
    path: '/solicitation',
    name: 'solicitation',
    component: DSolicitationView,
    meta: { allowedUsers: 'DYNAMIC' }
  },
  {
    path: '/interbegin/advisorselection',
    name: 'interbegin-advisorselection',
    component: IntBeginAdvisorSelection,
    meta: { allowedUsers: 'ALL' }
  },
  {
    path: '/areacoordinator',
    name: 'areacoordinator',
    component: AreaCView,
    meta: { allowedUsers: ['COO'] }
  },
  {
    path: '/areaadvisor',
    name: 'areaadvisor',
    component: AreaPView,
    meta: { allowedUsers: ['ADV'] }
  },
  {
    path: '/areastudent',
    name: 'areastudent',
    component: AreaSView,
    meta: { allowedUsers: ['STU'] }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router