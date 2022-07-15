<script>
import Vue from 'vue';
// #ifdef H5
var jweixin = require('./utils/jweixin-module');
// #endif
import { mapActions } from 'vuex';
import store from './store/index.js';
export default {
	globalData: {
		currentPage: 'home'
	},
	onLaunch: async function(options) {
		if (options.query.invite_code) {
			uni.setStorageSync('lzp_invite_code', options.query.invite_code);
		}

		// uni.setStorageSync('lzp_location_position', { latitude: 34.74821, longitude: 113.61332, errMsg: 'getLocation:ok' });
		// uni.setStorageSync(
		// 	'lzp_schoolinfo',
		// 	'{"id":6,"pid":1,"school_name":"郑州大学(新校区)","school_initial":"Z","school_province":"河南省","school_city":"郑州市","school_map":"113.542246,34.823207","school_map_address":"郑州市中原区郑州大学","school_lon":"113.542246","school_lat":"34.823207","addtime":1577783722,"del":0}'
		// );

		uni.getSystemInfo({
			success: function(e) {
				// #ifndef MP
				Vue.prototype.StatusBar = e.statusBarHeight;
				if (e.platform == 'android') {
					Vue.prototype.CustomBar = e.statusBarHeight + 50;
				} else {
					Vue.prototype.CustomBar = e.statusBarHeight + 45;
				}
				// #endif

				// #ifdef MP-WEIXIN
				Vue.prototype.StatusBar = e.statusBarHeight;
				let custom = wx.getMenuButtonBoundingClientRect();
				Vue.prototype.Custom = custom;
				Vue.prototype.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
				// #endif

				// #ifdef MP-ALIPAY
				Vue.prototype.StatusBar = e.statusBarHeight;
				Vue.prototype.CustomBar = e.statusBarHeight + e.titleBarHeight;
				// #endif
			}
		});
		// #ifdef H5
		// 微信定位及分享(要先定位-获取最近学校id 后面有接口必须得学校id)
		// 获取最近学校id 没有学校id 锁住$http往后请求
		if (!uni.getStorageSync('lzp_location_position')) {
			this.$http.lock();
		}
		if (options.query.school_id) {
			this.$http.lock();
			let re = await this.$schoolinfoFly.post('/api/express/school', { school_id: options.query.school_id });
			if (re.data.code == 0) {
				store.dispatch('setSchoolinfo', JSON.stringify(re.data.data));
				// 解锁往后请求
				this.$http.unlock();
			}
		} else {
			// 1.配置JSDk信息
			let url = location.href;
			let jsdk = await this.$schoolinfoFly.post('/api/wxlogin/getTicket', { url: url });
			if (jsdk.data.data) {
				// 配置config
				jweixin.config({
					debug: false,
					appId: jsdk.data.data.appId,
					timestamp: jsdk.data.data.timestamp,
					nonceStr: jsdk.data.data.nonceStr,
					signature: jsdk.data.data.signature,
					jsApiList: ['getLocation', 'updateAppMessageShareData', 'updateTimelineShareData']
				});

				// 获取经纬度
				jweixin.ready(() => {
					if (!uni.getStorageSync('lzp_location_position')) {
						jweixin.getLocation({
							type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
							success: res => {
								var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
								var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
								uni.setStorageSync('lzp_location_position', res);
								this.$schoolinfoFly.post('/api/express/school', { lon: longitude, lat: latitude }).then(schoolinfo => {
									store.dispatch('setSchoolinfo', JSON.stringify(schoolinfo.data.data));
									// 解锁往后请求
									this.$http.unlock();
								});
							}
						});
					}

					// 分享
					this.$schoolinfoFly.post('/api/school/rest').then(response => {
						jweixin.updateAppMessageShareData({
							title: response.data.data.title, // 分享标题
							desc: response.data.data.desc, // 分享描述
							link: 'https://shequ.longzipai.cn/h5/#/', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
							imgUrl: response.data.data.image, // 分享图标
							success: function() {
								// 设置成功
							}
						});
						jweixin.updateTimelineShareData({
							title: response.data.data.title, // 分享标题
							link: 'https://shequ.longzipai.cn/h5/#/', // 分享链接，该链接域名或路径必须与当前页面对应的公众号JS安全域名一致
							imgUrl: response.data.data.image, // 分享图标
							success: function() {
								// 设置成功
							}
						});
					});
				});
			}
		}
		// #endif
		// #ifdef MP
		if (!uni.getStorageSync('lzp_location_position')) {
			this.$http.lock();
			uni.getLocation({
				type: 'gcj02',
				altitude: true,
				success: res => {
					var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
					var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
					uni.setStorageSync('lzp_location_position', res);
					uni.showLoading({ title: '请稍等...', mask: true });
					this.$schoolinfoFly.post('/api/express/school', { lon: longitude, lat: latitude }).then(schoolinfo => {
						uni.hideLoading();
						store.dispatch('setSchoolinfo', JSON.stringify(schoolinfo.data.data));
						// 解锁往后请求
						this.$http.unlock();
						this.getShareData();
						this.getUserinfo();
					});
				},
				fail: error => {
					this.getSetting();
				}
			});
		} else {
			this.getShareData();
			this.getUserinfo();
		}
		// #endif
		Vue.prototype.ColorList = [
			{
				title: '嫣红',
				name: 'red',
				color: '#FF3E47'
			},
			{
				title: '桔橙',
				name: 'orange',
				color: '#FB8C04'
			},
			{
				title: '明黄',
				name: 'yellow',
				color: '#FFD200'
			},
			{
				title: '橄榄',
				name: 'olive',
				color: '#8dc63f'
			},
			{
				title: '森绿',
				name: 'green',
				color: '#26D499'
			},
			{
				title: '天青',
				name: 'cyan',
				color: '#1cbbb4'
			},
			{
				title: '海蓝',
				name: 'blue',
				color: '#0081ff'
			},
			{
				title: '姹紫',
				name: 'purple',
				color: '#6739b6'
			},
			{
				title: '木槿',
				name: 'mauve',
				color: '#9c26b0'
			},
			{
				title: '桃粉',
				name: 'pink',
				color: '#e03997'
			},
			{
				title: '棕褐',
				name: 'brown',
				color: '#a5673f'
			},
			{
				title: '玄灰',
				name: 'grey',
				color: '#8799a3'
			},
			{
				title: '草灰',
				name: 'gray',
				color: '#aaaaaa'
			},
			{
				title: '墨黑',
				name: 'black',
				color: '#333333'
			},
			{
				title: '雅白',
				name: 'white',
				color: '#ffffff'
			}
		];
	},
	created() {
		// #ifdef H5
		if (this.$route.query.token) {
			this.setToken(this.$route.query.token);
		}
		if (this.$route.query.invite_code) {
			uni.setStorageSync('lzp_invite_code', this.$route.query.invite_code);
		}
		// #endif
	},
	onShow: function() {
		this.getBadgeNum();
	},
	onHide: function() {},
	methods: {
		...mapActions(['setToken', 'setUserinfo']),
		// 我的消息红点
		getBadgeNum() {
			if (!store.getters.token) return;
			this.$http.post('/api/personal/has_unread_msg').then(res => {
				if (res.code == 0) {
					if (res.data.total) {
						uni.showTabBarRedDot({ index: 4 });
					} else {
						uni.hideTabBarRedDot({ index: 4 });
					}
				}
			});
		},

		// 获取用户当前设置
		async getSetting() {
			let [error, res] = await uni.getSetting();
			if (!res.authSetting['scope.userLocation']) {
				uni.showModal({
					title: '获取位置失败',
					content: '需要您的位置信息，请在设置界面打开相关权限',
					success: res => {
						if (res.confirm) {
							this.openSetting();
						}
					}
				});
			}
		},
		// 打开小程序设置页面
		async openSetting() {
			let [error, res] = await uni.openSetting();
			if (res.authSetting['scope.userLocation']) this.getLocation();
			else this.getSetting();
		},

		getLocation() {
			uni.getLocation({
				type: 'gcj02',
				altitude: true,
				success: res => {
					var latitude = res.latitude; // 纬度，浮点数，范围为90 ~ -90
					var longitude = res.longitude; // 经度，浮点数，范围为180 ~ -180。
					uni.setStorageSync('lzp_location_position', res);
					this.$schoolinfoFly.post('/api/express/school', { lon: longitude, lat: latitude }).then(schoolinfo => {
						store.dispatch('setSchoolinfo', JSON.stringify(schoolinfo.data.data));
						// 解锁往后请求
						this.$http.unlock();
					});
				},
				fail: error => {
					this.getSetting();
				}
			});
		},

		// 分享自定义数据
		async getShareData() {
			let res = await this.$http.post('/api/school/rest');
			if (res.code == 0) {
				store.commit('SHAREDATA', res.data);
			}
		},

		getUserinfo() {
			if (!store.getters.token) return;
			this.$http.post('/api/express/personal_information').then(res => {
				if (res.code == 0) {
					this.setUserinfo(res.data);
				}
			});
		}
	}
};
</script>
<style lang="scss">
@import "uview-ui/index.scss";
</style>
<style>
@import 'colorui/main.css';
@import 'colorui/icon.css';

body {
	background-color: #ffffff;
	font-size: 24upx;
	font-weight: 500;
}
.bg-gray {
	background-color: #f5f5f5;
}
.bg-fff {
	background: #ffffff;
}
.bg-ebebeb {
	background-color: #ebebeb;
}
.text-ccc {
	color: #cccccc;
}
.text-666 {
	color: #666;
}
.text-999 {
	color: #999;
}
.text-hf {
	font-size: 30upx;
}
.overflow {
	overflow: hidden;
}
.text-two-omit {
	display: -webkit-box;
	-webkit-box-orient: vertical;
	-webkit-line-clamp: 2;
	white-space: normal;
}
.self-baseline {
	align-self: baseline;
}
/* 图标 */
.like-icon,
.liked-icon,
.evaluate-icon,
.views-icon,
.location-gray-icon,
.phone-icon {
	width: 28upx;
	height: 28upx;
}
.location-address-icon {
	width: 22upx;
	height: 28upx;
}
.checked-icon {
	width: 36upx;
	height: 36upx;
}
.comment-icon,
.del-icon {
	width: 40upx;
	height: 40upx;
}
.my-idle-icon,
.my-lost-property,
.my-help-delivery {
	width: 56upx;
	height: 56upx;
}
/* 支付成功 评价成功 */
.success-icon {
	width: 148upx;
	height: 134upx;
}
/* 图标 */
/* custom */
.nav-list {
	display: flex;
	flex-wrap: wrap;
	padding: 0px 40upx 0px;
	justify-content: space-between;
}

.nav-li {
	padding: 30upx;
	border-radius: 12upx;
	width: 45%;
	margin: 0 2.5% 40upx;
	background-image: url(https://cdn.nlark.com/yuque/0/2019/png/280374/1552996358352-assets/web-upload/cc3b1807-c684-4b83-8f80-80e5b8a6b975.png);
	background-size: cover;
	background-position: center;
	position: relative;
	z-index: 1;
}

.nav-li::after {
	content: '';
	position: absolute;
	z-index: -1;
	background-color: inherit;
	width: 100%;
	height: 100%;
	left: 0;
	bottom: -10%;
	border-radius: 10upx;
	opacity: 0.2;
	transform: scale(0.9, 0.9);
}

.nav-li.cur {
	color: #fff;
	background: rgb(94, 185, 94);
	box-shadow: 4upx 4upx 6upx rgba(94, 185, 94, 0.4);
}

.nav-title {
	font-size: 32upx;
	font-weight: 300;
}

.nav-title::first-letter {
	font-size: 40upx;
	margin-right: 4upx;
}

.nav-name {
	font-size: 28upx;
	text-transform: Capitalize;
	margin-top: 20upx;
	position: relative;
}

.nav-name::before {
	content: '';
	position: absolute;
	display: block;
	width: 40upx;
	height: 6upx;
	background: #fff;
	bottom: 0;
	right: 0;
	opacity: 0.5;
}

.nav-name::after {
	content: '';
	position: absolute;
	display: block;
	width: 100upx;
	height: 1px;
	background: #fff;
	bottom: 0;
	right: 40upx;
	opacity: 0.3;
}

.nav-name::first-letter {
	font-weight: bold;
	font-size: 36upx;
	margin-right: 1px;
}

.nav-li text {
	position: absolute;
	right: 30upx;
	top: 30upx;
	font-size: 52upx;
	width: 60upx;
	height: 60upx;
	text-align: center;
	line-height: 60upx;
}

.text-light {
	font-weight: 300;
}

@keyframes show {
	0% {
		transform: translateY(-50px);
	}

	60% {
		transform: translateY(40upx);
	}

	100% {
		transform: translateY(0px);
	}
}

@-webkit-keyframes show {
	0% {
		transform: translateY(-50px);
	}

	60% {
		transform: translateY(40upx);
	}

	100% {
		transform: translateY(0px);
	}
}

.uni-picker-container .uni-picker-action.uni-picker-action-confirm {
	color: #26d499 !important;
}

.uni-tabbar .uni-tabbar__reddot {
	width: 20upx;
	height: 20upx;
	top: -2upx;
	right: -2upx;
}
</style>
