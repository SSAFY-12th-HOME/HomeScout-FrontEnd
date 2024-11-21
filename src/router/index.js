import { createRouter, createWebHistory } from 'vue-router'
import { useUserStore } from '@/stores/user'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import SignupView from '@/views/SignupView.vue'
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
      path: '/signup',
      name: 'signup',
      component: SignupView,
    },
    {
      path: '/notice',
      name: 'notice',
      component: NoticeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/map',
      name: 'map',
      component: MapView,
      meta: { requiresAuth: true },
    },
    {
      path: '/analysis',
      name: 'analysis',
      component: AnalysisView,
      meta: { requiresAuth: true },
    },
    {
      path: '/quiz',
      name: 'quiz',
      component: QuizView,
      meta: { requiresAuth: true },
    },
  ],
})

// 네비게이션 가드 설정
router.beforeEach((to, from, next) => {
  const userStore = useUserStore()
  const isAuthenticated = !!userStore.token

  // 인증이 필요한 페이지에 접근하려고 할 때
  if (to.meta.requiresAuth) {
    // 로그인되어 있지 않은 경우
    if (!isAuthenticated) {
      // 현재 시도하려던 경로를 쿼리 파라미터로 포함하여 로그인 페이지로 리다이렉트
      next({
        name: 'login',
        query: { redirect: to.fullPath },
      })
    } else {
      // 로그인되어 있다면 요청한 페이지로 이동
      next()
    }
  } else {
    // 인증이 필요없는 페이지는 그대로 진행
    next()
  }
})

export default router
