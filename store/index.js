import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		disableScroll: null, // 禁止滚动
		loginModal: null, // 登录弹窗
		locationPosition: null, // 当前位置
		schoolinfo: null, // 学校信息
		token: null, // 登录凭证
		userinfo: null, // 个人信息
		bannerArticle: null, // bannerDetails
		reserveRule: null, // 生活店铺预定规则
		shareData: null, // 分享数据
	},
	getters: {
		disableScroll(state) {
			return state.disableScroll
		},
		loginModal(state) {
			return state.loginModal
		},
		locationPosition(state) {
			return state.locationPosition
		},
		schoolinfo(state) {
			let info = state.schoolinfo || uni.getStorageSync('lzp_schoolinfo')
			return info ? JSON.parse(info) : info
		},
		token(state) {
			return state.token || uni.getStorageSync('lzp_token')
		},
		userinfo(state) {
			return state.userinfo || {}
		},
		bannerArticle(state) {
			return state.bannerArticle || uni.getStorageSync('lzp_banner_article')
		},
		reserveRule(state) {
			return state.reserveRule || uni.getStorageSync('lzp_reserve_rule')
		},
		shareData(state) {
			return state.shareData || uni.getStorageSync('lzp_share_data')
		}
	},
	mutations: {
		DISABLESCROLL(state, val) {
			state.disableScroll = val
		},
		LOGINMODAL(state, val) {
			state.loginModal = val
		},
		LOCATIONPOSITION(state, val) {
			state.locationPosition = val
		},
		SCHOOLINFO(state, info) {
			uni.setStorageSync('lzp_schoolinfo', info)
			state.schoolinfo = info
		},
		TOKEN(state, val) {
			uni.setStorageSync('lzp_token', val);
			state.token = val
		},
		USERINFO(state, data) {
			state.userinfo = data
		},
		BANNERARTICLE(state, val) {
			uni.setStorageSync('lzp_banner_article', val)
			state.bannerArticle = val
		},
		RESERVERULE(state, val) {
			uni.setStorageSync('lzp_reserve_rule', val)
			state.reserveRule = val
		},
		SHAREDATA(state, data) {
			uni.setStorageSync('lzp_share_data', data)
			state.shareData = data
		}
	},
	actions: {
		setCurrentPage({
			commit
		}, val) {
			commit('CURRENTPAGE', val)
		},
		setDisableScroll({
			commit
		}, val) {
			commit('DISABLESCROLL', val)
		},
		setLoginModal({
			commit
		}, val) {
			commit('LOGINMODAL', val)
		},
		setLocationPosition({
			commit
		}, val) {
			commit('LOCATIONPOSITION', val)
		},
		setSchoolinfo({
			commit
		}, info) {
			commit('SCHOOLINFO', info)
		},
		setToken({
			commit
		}, val) {
			commit('TOKEN', val)
		},
		setUserinfo({
			commit
		}, data) {
			commit('USERINFO', data)
		},
		setBannerArticle({
			commit
		}, val) {
			commit('BANNERARTICLE', val)
		},
		setReserveRule({
			commit
		}, val) {
			commit('RESERVERULE', val)
		}
	}
})
export default store
