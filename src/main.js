import Vue from 'vue'
import Cookies from 'js-cookie'
import router from '@/router/router.js'
import store from '@/store/index.js'
import './permisson.js'
import './directives'
// import ElementUI from '@/components/element-ui.js'
// import './mock'
import ElementUI from 'element-ui'
import './utils/layout.js'
import './utils/errorLog.js'
import './utils/constant.js'
import '@/style/style.scss'
import App from './App.vue'
import { btnPermission } from '@/utils/btnPermission.js'
import Icon from 'vue-svg-icon/Icon.vue'
import i18n from './lang'
Vue.component('icon', Icon)
// import VueAMap from 'vue-amap'
// Vue.use(VueAMap)
import * as filters from './filters' // global filters
// register global utility filters.
Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// VueAMap.initAMapApiLoader({
//   key: '81339b9a7dc95b45358f545c74f3b797',
//   plugin: ['AMap.Autocomplete', 'AMap.PlaceSearch', 'AMap.Scale', 'AMap.OverView', 'AMap.ToolBar', 'AMap.MapType', 'AMap.PolyEditor', 'AMap.CircleEditor'],
//   v: '1.4.4'
// });
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
Vue.prototype.hasPerm = btnPermission
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})
Vue.config.productionTip = false
new Vue({
  i18n,
  router,
  store,
  render: h => h(App)
}).$mount('#app')
// console.log(Vue.config)
// console.log(Vue.config, 'vue')
