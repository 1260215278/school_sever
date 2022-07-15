import store from '../store/index.js'

var Fly = require('flyio/dist/npm/wx')
var fly = new Fly
var schoolinfoFly = new Fly

// 接口域名地址


const interfaceUrl = 'https://xiaoyuanyun.net' // 二期域名

// 配置请求基地址
if (process.env.NODE_ENV === 'development') {
	// #ifdef H5
	fly.config.baseURL = 'https://xiaoyuanyun.net'
	// #endif
	// #ifdef MP
	fly.config.baseURL = interfaceUrl
	// #endif
} else {
	fly.config.baseURL = interfaceUrl
}

// 设置超时
fly.config.timeout = 10000

schoolinfoFly.config = fly.config;

// 添加请求拦截器
fly.interceptors.request.use((request) => {
	// header 添加 token
	// if(!request.headers.token) request.headers["token"] = store.getters.token
	request.headers["token"] = store.getters.token

	if (request.body && request.body.school_id === undefined) {
		request.body.school_id = JSON.parse(uni.getStorageSync('lzp_schoolinfo')).id
	}

	return request
})
// 添加响应拦截器
fly.interceptors.response.use((response) => {

	if (response.data.code == '201') {
		uni.showToast({
			title: '登录过期,请重新登录!',
			icon: 'none'
		})
		store.dispatch('setLoginModal', true)
		store.dispatch('setToken', '')
		store.dispatch('setUserinfo', '')
	} else {
		return response.data
	}
}, (err) => {
	//发生网络错误后会走到这里
	uni.hideLoading()
	// return Promise.resolve(err)
})

module.exports = {
	interfaceUrl,
	fly,
	schoolinfoFly
}
