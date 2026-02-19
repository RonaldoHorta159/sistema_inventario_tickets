import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";


const routes = [
  {
    path: '/',
    name: 'login',
    component: () => import('../views/auth/Login.vue'),
    meta: { requiresAuth: false }
  },
  {
    path: '/app',
    component: () => import('../layouts/AppLayout.vue'),
    meta: { requiresAuth: true },
    children: [
      {
        path: 'dashboard',
        name: 'dashboard',
        component: () => import('../views/Dashboard.vue')
      },
      {
        path: 'inventario',
        name: 'inventario',
        component: () => import('../views/inventario/registroBienes.vue')
      },
      {
        path: 'inventario/InventarioLista',
        name: 'inventarioLista',
        component: () => import('../views/inventario/InventarioLista.vue')
      }
    ]
  }
]
const router = createRouter({
  history: createWebHistory(),
  routes
})


router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore()

  if (!authStore.user) {
    await authStore.initializeAuth()
  }

  const isAtuh = authStore.isAuthenticated()
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth)

  if (requiresAuth && !isAtuh) {
    next({ name: 'login' })
  } else if (to.name === 'login' && isAtuh) {
    next({ name: 'dashboard' })
  } else {
    next()
  }
})
export default router;