// 文档 https://cn.vuejs.org/v2/guide/custom-directive.html

import Vue from 'vue'

// v-loadmore                元素可滚动的
Vue.directive('loadmore', { 
	bind(el, binding) { 
		el.addEventListener('scroll', function() {  
			
		}) 
	}
})

//让元素可滚动  v-scroll
Vue.directive('scroll', {
	inserted: function(el) {
		el.addEventListener('touchstart', function() {
			var top = el.scrollTop;
			var totalScroll = el.scrollHeight;
			var currentScroll = top + el.offsetHeight;
			if(top === 0) {
				//el.scrollTop = 0;
			} else if(currentScroll === totalScroll) {
				el.scrollTop = top - 1;
			}
		});
		el.addEventListener('touchmove', function(evt) {
			if((el.scrollTop + el.offsetHeight - 10) < el.scrollHeight) {
				evt._isScroller = true;
			}
		});
	}
});