import Vue from 'vue'

import Cookies from 'js-cookie'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import axios from "axios"
import ElementUI from 'element-ui'

import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import './styles/element-variables.scss'

// // Ace start
// import tool from '@/assets/styles/js/tool'
// Vue.prototype.$tool = tool
// import create from '@/assets/styles/js/create'
// Vue.prototype.$create = create
import VueAnimateNumber from 'vue-animate-number'
Vue.use(VueAnimateNumber)
// Ace end

Vue.prototype.$axios = axios
import qs from 'qs'//请求数据
Vue.prototype.$qs = qs;//请求数据
import '@/styles/index.scss' // global css


import App from './App'
import store from './store'
import router from './router'
import moment from 'moment'
import '@/icons' // icon
import '@/permission' // permission control
// /**
//  * If you don't want to use mock-server
//  * you want to use MockJs for mock api
//  * you can execute: mockXHR()
//  *
//  * Currently MockJs will be used in the production environment,
//  * please remove it before going online ! ! !
//  */
// if (process.env.NODE_ENV === 'production') {
//   const { mockXHR } = require('../mock')
//   mockXHR()
// }

import i18n from './lang' // internationalization

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
Vue.use(ElementUI, {
  size: Cookies.get('size') || 'medium', // set element-ui default size
  i18n: (key, value) => i18n.t(key, value)
})

axios.defaults.headers.common['TOKEN'] = sessionStorage.getItem('TOKEN');

Vue.filter('dateformat', function (dataStr, pattern = 'YYYY-MM-DD') {
  if (dataStr) {
    return moment(dataStr).format(pattern)
  } else {
    return ''
  }
})
Vue.filter('monthdateformat', function (dataStr, pattern = 'YYYY-MM') {
  if (dataStr) {
    return moment(dataStr).format(pattern)
  } else {
    return ''
  }
})

Vue.filter('formatMoney', function (num) {
  return utils.formatMoney(num, 4)
})
Vue.filter('datetimeformat', function (
  dataStr,
  pattern = 'YYYY-MM-DD HH:mm:ss'
) {
  if (dataStr) {
    return moment(dataStr).format(pattern)
  } else {
    return ''
  }
});
Array.prototype.indexOf = function (val) {
  for (var i = 0; i < this.length; i++) {
    if (this[i] == val) return i;
  }
  return -1;
};
Array.prototype.remove = function (val) {
  var index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};
// 如果想要中文版 element-ui，按如下方式声明
// Vue.use(ElementUI)

Vue.config.productionTip = false;

new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
