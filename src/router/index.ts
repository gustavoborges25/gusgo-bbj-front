import { createRouter, createWebHistory } from 'vue-router'

// 1. Definição das rotas do sistema
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/Home.vue'),
    meta: { requiresAuth: true } // 👈 Informa que esta rota precisa de autenticação
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/pages/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/students',
    name: 'StudentsList',
    component: () => import('@/pages/StudentsList.vue'),
    meta: { requiresAuth: true } // Exige o token ativo
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFound.vue'),
    meta: { requiresAuth: true } // Garante que precisa estar logado para ver o erro 404 interno
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 2. Guarda de Navegação (Navigation Guard) - Executado antes de cada mudança de página
router.beforeEach((to, from, next) => {
  // Verifica se o usuário tem o token salvo no localStorage
  const isAuthenticated = !!localStorage.getItem('user_token')

  // Se a rota exige autenticação e o usuário não está logado, joga para o login
  if (to.meta.requiresAuth && !isAuthenticated) {
    next({ name: 'Login' })
  } 
  // Se o usuário já está logado e tenta ir para o login, joga para a dashboard
  else if (to.name === 'Login' && isAuthenticated) {
    next({ path: '/' })
  } 
  // Caso contrário, permite a navegação normalmente
  else {
    next()
  }
})

export default router