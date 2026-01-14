import { createRouter, createWebHashHistory } from 'vue-router'
const routes = [
    {
        path: '/',
        name: 'home',
        component: () => import('@/views/home/index.vue')
    },
    {
        path: '/sub-frondSystem',
        name: 'sub-frondSystem',
        component: () => import('@/views/sub-frondSystem/index.vue')
    }
]
const  router  = createRouter({
    history: createWebHashHistory(),
    routes
})
export default router
