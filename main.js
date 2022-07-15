import Vue from 'vue'
import App from './App'
import store from './store/index.js'
import {
	interfaceUrl,
	fly,
	schoolinfoFly
} from './utils/fly.js'
import uView from 'uview-ui';
Vue.use(uView);
import cuCustom from './colorui/components/cu-custom.vue'
Vue.component('cu-custom', cuCustom)

Vue.prototype.$store = store
Vue.prototype.$http = fly
Vue.prototype.$schoolinfoFly = schoolinfoFly
Vue.prototype.$domain = interfaceUrl
Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
	...App,
	store
})
app.$mount()
