export default [
    {
        path: '/techniques',
        name: 'TechniquesList',
        component: () => import('@/pages/techniques/TechniquesList.vue'),
        meta: { requiresAuth: true, roles: ['OWNER'] }
    },
    {
        path: '/techniques/create',
        name: 'TechniquesCreate',
        component: () => import('@/pages/techniques/TechniquesCreate.vue'),
        meta: { requiresAuth: true, roles: ['OWNER'] }
    },
    {
        path: '/techniques/:id',
        name: 'TechniquesEdit',
        component: () => import('@/pages/techniques/TechniquesEdit.vue'),
        meta: { requiresAuth: true, roles: ['OWNER'] }
    }    
]