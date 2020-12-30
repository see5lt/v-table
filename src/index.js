import Vue from 'vue'
//样式初始化
import  '@/assets/master.css'

// 使用icon组件
import '@/assets/iconfont.js'

// ie 兼容性
import "@babel/polyfill";
import "@/utils/classList";

import methods from '@/utils/methods.js';
import config from '@/utils/config.js';
Vue.prototype.$dyMethods = methods;
Vue.prototype.$dyConfig = config;

import button from '@/packages/vbutton/index.js';
import vGrig from '@/packages/vgrid/index.js';

const components = [
  button,
  vGrig
]

const install = function(Vue, opts = {}) {
  components.map(component => {
    Vue.component(component.name, component);
  })
}

/* 支持使用标签的方式引入 */
if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export default {
  install,
  button,
  vGrig
}
