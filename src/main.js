import Vue from 'vue'
import App from './App.vue'

// grid
import vGrig from './index.js'
Vue.use(vGrig)

new Vue({
  el: '#app',
  render: h => h(App)
})
