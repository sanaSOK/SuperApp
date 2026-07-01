import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/services',
      name: 'services',
      component: () => import('../views/ServicesView.vue'),
    },
    {
      path: '/announcements',
      name: 'announcements',
      component: () => import('../views/AnnouncementsView.vue'),
    },
    {
      path: '/profile',
      name: 'profile',
      component: () => import('../views/ProfileView.vue'),
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/LoginView.vue'),
    },
    {
      path: '/signup',
      name: 'signup',
      component: () => import('../views/SignupView.vue'),
    },
    {
      path: '/verify',
      name: 'verify',
      component: () => import('../views/OtpVerifyView.vue'),
    },
    {
      path: '/forgot-password',
      name: 'forgot-password',
      component: () => import('../views/ForgotPasswordView.vue'),
    },
    {
      path: '/reset-password',
      name: 'reset-password',
      component: () => import('../views/ResetPasswordView.vue'),
    },
  ],
  scrollBehavior() {
    return { top: 0, behavior: 'smooth' }
  }
})

// Simple Authentication Navigation Guard
router.beforeEach((to, from, next) => {
  const isAuthenticated = !!localStorage.getItem('user')
  const authRoutes = ['login', 'signup', 'forgot-password', 'verify', 'reset-password']

  if (to.name === 'profile' && !isAuthenticated) {
    next({ name: 'login' })
  } else if (authRoutes.includes(to.name as string) && isAuthenticated) {
    next({ name: 'profile' })
  } else {
    next()
  }
})

export default router


