import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'

Vue.use(router)
Vue.config.productionTip = false

import axios from 'axios'
axios.defaults.timeout = 5000 //响应时间
axios.defaults.headers.post['Content-Type'] =
  'application/x-www-form-urlencoded'
axios.defaults.headers.get['Content-Type'] = 'application/x-www-form-urlencoded'
axios.defaults.transformRequest = [
  function(data) {
    let ret = ''
    for (let it in data) {
      ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
    }
    return ret
  }
]
axios.defaults.baseURL = 'http://94.191.59.11' //配置接口地址
Vue.prototype.$axios = axios

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
