import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    //一级路由
    {
      path: '/',
      name: 'login',
      component: () => import('./views/register/AdministrativeRegistration')
    },
    {
      path: '/index',
      name: 'index',
      component: () => import('./views/register/UserRegistration.vue')
    },
    {
      path: '/rule',
      name: 'rule',
      component: () => import('./views/register/eeaRule.vue')
    },
    {
      path: '/file',
      name: 'file',
      component: () => import('./views/register/eeAfiles.vue')
    }
  ]
})
