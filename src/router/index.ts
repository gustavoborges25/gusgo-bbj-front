import { createRouter, createWebHistory } from 'vue-router'

// 1. Definição das rotas do sistema
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('@/pages/Home.vue'),
    meta: { requiresAuth: true }
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
    component: () => import('@/pages/students/StudentsList.vue'),
    meta: { 
      requiresAuth: true,
      roles: ['OWNER', 'PROFESSOR']
    }
  },
  {
    path: '/students/create',
    name: 'StudentsCreate',
    component: () => import('@/pages/students/StudentsCreate.vue'),
    meta: { requiresAuth: true, roles: ['OWNER', 'PROFESSOR'] }
  },
  {
    path: '/students/:id',
    name: 'StudentsEdit',
    component: () => import('@/pages/students/StudentsEdit.vue'),
    meta: { requiresAuth: true, roles: ['OWNER', 'PROFESSOR'] }
  },  
  {
    path: '/students/import',
    name: 'StudentsEdit',
    component: () => import('@/pages/students/StudentsImport.vue'),
    meta: { requiresAuth: true, roles: ['OWNER', 'PROFESSOR'] }
  },  
  {
    path: '/instructors',
    name: 'InstructorsList',
    component: () => import('@/pages/instructors/InstructorsList.vue'),
    meta: { 
      requiresAuth: true,
      roles: ['OWNER']
    }
  },
  {
    path: '/instructors/create',
    name: 'InstructorsCreate',
    component: () => import('@/pages/instructors/InstructorsCreate.vue'),
    meta: { requiresAuth: true, roles: ['OWNER'] }
  },
  {
    path: '/instructors/:id',
    name: 'InstructorsEdit',
    component: () => import('@/pages/instructors/InstructorsEdit.vue'),
    meta: { requiresAuth: true, roles: ['OWNER'] }
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('@/pages/NotFound.vue'),
    meta: { requiresAuth: true }
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

// 2. Guarda de Navegação (Navigation Guard) - Executado antes de cada mudança de página
router.beforeEach((to) => {
  const savedUserStr = localStorage.getItem('user_token')
  const isAuthenticated = !!savedUserStr

  // Se a rota exige autenticação e o usuário não está logado, joga para o login
  if (to.meta.requiresAuth && !isAuthenticated) {
    return { name: 'Login' }
  } 
  // Se o usuário já está logado e tenta ir para o login, joga para a dashboard
  else if (to.name === 'Login' && isAuthenticated) {
    return { path: '/' }
  } 
  // Se Usuário está autenticado e mudando de página interna
  else if (to.meta.requiresAuth && isAuthenticated) {
    const user = JSON.parse(savedUserStr)
    const requiredRoles = to.meta.roles
    
    // 🔐 Validação de perfil (Role)
    if (Array.isArray(requiredRoles) && !requiredRoles.includes(user.role)) {
      return { path: '/' }
    } else {
      return true
    }
  } 
  // Caso contrário, permite a navegação normalmente
  else {
    return true
  }
})

export default router