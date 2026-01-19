import { createRouter, createWebHashHistory } from 'vue-router'

//import.meta.env.BASE_URL
const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      name: 'home1',
      component: ()=>import('@/layout/index.vue'),
      redirect: '/home',
      children: [
        {
          path: '/home',
          name: 'home',
          component: () => import('@/views/home/index.vue')
        },
        {
          path: '/item',
          name: 'item',
          component: () => import('@/views/item/index.vue')
        }
      ]
    }
  ],
})

export default router
