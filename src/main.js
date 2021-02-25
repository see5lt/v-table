import Vue from 'vue'
import App from './App.vue'
import uploader from 'vue-simple-uploader'
import { Dialog } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
// grid
import vGrig from './index.js'
import vForm from './index.js'

window.$ = $;
Vue.use(vGrig).use(vForm).use(uploader).use(Dialog)

new Vue({
  el: '#app',
  render: h => h(App)
})
