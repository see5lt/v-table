import Vue from 'vue'
import App from './App.vue'

// grid
import vGrig from './index.js'
import vForm from './index.js'

Vue.use(vGrig).use(vForm)

new Vue({
  el: '#app',
  render: h => h(App)
})
