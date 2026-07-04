export default [
    {
        path: '/instructors',
        name: 'InstructorsList',
        component: () => import('@/pages/instructors/InstructorsList.vue'),
        meta: { requiresAuth: true, roles: ['OWNER'] }
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
    }
]