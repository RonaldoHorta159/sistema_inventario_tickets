import { createRouter , createWebHistory } from "vue-router";

const routes = [
  {
    path: '/',
    name: 'login',
    component: ( ) => import('../views/auth/Login.vue'),
  },
  {
    path: '/app',
    component: () => import('../layouts/AppLayout.vue'),
    children : [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('../views/Dashboard.vue')
      },
      {
        path: 'inventario',
        name: 'inventario',
        component: () => import('../views/inventario/InventarioLista.vue')
      }
    ]
  }
]
const router =  createRouter({
  history: createWebHistory(),
  routes
})

export default router;