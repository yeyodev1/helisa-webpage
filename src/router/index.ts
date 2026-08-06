import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/HomeView.vue'),
    meta: { title: 'HELISA | Health & Life S.A.' },
  },
  {
    path: '/productos',
    name: 'Products',
    component: () => import('../views/ProductsView.vue'),
    meta: { title: 'Productos | HELISA' },
  },
  {
    path: '/productos/:category/:product',
    name: 'ProductDetail',
    component: () => import('../views/ProductDetailView.vue'),
    meta: { title: 'Detalle de producto | HELISA' },
  },
  {
    path: '/proyectos',
    name: 'Projects',
    component: () => import('../views/ProjectsView.vue'),
    meta: { title: 'Proyectos | HELISA' },
  },
  {
    path: '/proyectos/:slug',
    name: 'ProjectDetail',
    component: () => import('../views/ProjectDetailView.vue'),
    meta: { title: 'Detalle de proyecto | HELISA' },
  },
  {
    path: '/nosotros',
    name: 'About',
    component: () => import('../views/AboutView.vue'),
    meta: { title: 'Nosotros | HELISA' },
  },
  {
    path: '/calificar',
    name: 'Rating',
    component: () => import('../views/RatingView.vue'),
    meta: { title: 'Calificar y CRM | HELISA' },
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../views/LoginView.vue'),
    meta: { title: 'Iniciar Sesión | HELISA' },
  },
  {
    path: '/admin',
    name: 'Admin',
    component: () => import('../views/AdminView.vue'),
    meta: { title: 'Panel de Administración | HELISA', requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior() {
    return { left: 0, top: 0, behavior: 'smooth' }
  },
})

router.beforeEach((to, _from, next) => {
  const hasToken = !!localStorage.getItem('access_token')
  const requiresAuth = to.matched.some((record) => record.meta?.requiresAuth)

  if (requiresAuth && !hasToken) {
    return next({ path: '/login', replace: true })
  }

  if (to.path === '/login' && hasToken) {
    return next({ path: '/admin', replace: true })
  }

  next()
})

export default router
