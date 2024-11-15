import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import NoticeView from '@/views/NoticeView.vue'
import MapView from '@/views/MapView.vue'
import AnalysisView from '@/views/AnalysisView.vue'
import QuizView from '@/views/QuizView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/notice',
      name: 'notice',
      component: NoticeView,
    },
    {
      path: '/map',
      name: 'map',
      component: MapView,
    },
    {
      path: '/analysis',
      name: 'analysis',
      component: AnalysisView,
    },
    {
      path: '/quiz',
      name: 'quiz',
      component: QuizView,
    }
  ],
})

export default router
