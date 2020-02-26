import Vue from 'vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

/*
 * If not building with SSR mode, you can
 * directly export the Router instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Router instance.
 */

export default function (/* { store, ssrContext } */) {
  const Router = new VueRouter({
    routes: [{
      path: '/',
      component: () => import('layouts/MainLayout.vue'),
      children: [
        { path: 'pagar', component: () => import('pages/Pagar.vue') },
        { path: 'pagar', component: () => import('pages/Pagar.vue') },
        { path: '', component: () => import('pages/Index.vue') }
      ],
    }
    ],
    mode: 'history',
    base: process.env.VUE_ROUTER_BASE
  })

  return Router
}

