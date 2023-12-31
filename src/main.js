import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'

Vue.config.productionTip = false
import echarts from 'echarts'
Vue.prototype.$echarts = echarts
new Vue({
  vuetify,
  render: h => h(App)
}).$mount('#app')
