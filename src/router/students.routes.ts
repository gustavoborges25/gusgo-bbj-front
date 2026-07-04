export default [
  {
    path: '/students',
    name: 'StudentsList',
    component: () => import('@/pages/students/StudentsList.vue'),
    meta: { requiresAuth: true, roles: ['OWNER', 'PROFESSOR'] }
  },
  {
    path: '/students/create',
    name: 'StudentsCreate',
    component: () => import('@/pages/students/StudentsCreate.vue'),
    meta: { requiresAuth: true, roles: ['OWNER', 'PROFESSOR'] }
  },  
  {
    path: '/students/import',
    name: 'StudentsImport',
    component: () => import('@/pages/students/StudentsImport.vue'),
    meta: { requiresAuth: true, roles: ['OWNER', 'PROFESSOR'] }
  },
  {
    path: '/students/:id',
    name: 'StudentsEdit',
    component: () => import('@/pages/students/StudentsEdit.vue'),
    meta: { requiresAuth: true, roles: ['OWNER', 'PROFESSOR'] }
  }
]
