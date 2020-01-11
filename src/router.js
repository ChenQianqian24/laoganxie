import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

export default new Router({
  routes: [
    //一级路由

    {
      path: '/User',
      name: 'User',
      component: () => import('./views/register/User.vue')
    },
    {
      path: '/Administrative',
      name: 'Administrative',
      component: () => import('./views/register/Administrative')
    },
    {
      path: '/approval',
      name: 'approval',
      component: () => import('./views/approval/approval.vue')
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
    },
    {
      path: '/',
      name: 'login',
      component: () => import('./views/login/login.vue'),
      children: []
    }
  ]
})
