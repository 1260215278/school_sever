<template>
	<!-- 授权弹窗 -->
	<modal :custom="true" :show="loginModal" :maskClosable="false" padding="0">
		<view class="login-modal">
			<view @click="cancel" class="close-icon cuIcon-roundclose text-ccc"></view>
			<view class="logo"><image class="logo-icon" src="/static/logo.jpg" mode="aspectFill"></image></view>
			<view class="login-text">需要您的授权才可以正常使用</view>
			<view class="login-btn"><button @click="confirm" open-type="getUserInfo" @getuserinfo="getUserInfo" class="cu-btn bg-green round lg block">授权登录</button></view>
		</view>
	</modal>
</template>

<script>
import modal from '@/components/modal/modal.vue';
import { mapGetters, mapActions } from 'vuex';
export default {
	components: { modal },
	data() {
		return {
			form: { code: '', nickname: '', avatarurl: '', invite_code: '', encrypteddata: '', iv: '' }
		};
	},
	computed: {
		...mapGetters(['loginModal'])
	},
	watch: {
		loginModal: {
			immediate: true,
			handler: function(newVal) {
				if (newVal) {
					this.getweixinCode();
				}
			}
		}
	},
	created() {
		console.log('loginModal');
	},
	methods: {
		...mapActions(['setLoginModal']),
		confirm() {
			// #ifdef H5
			this.setLoginModal(false);
			let pages = getCurrentPages();
			let pagePath = '';
			if (uni.getStorageSync('lzp_invite_code')) {
				location.href = `${this.$domain}/api/wxlogin/getCodeUserInfo?admin_site=${pagePath}&invite_code=${uni.getStorageSync('lzp_invite_code')}`;
				return;
			}
			location.href = `${this.$domain}/api/wxlogin/getCodeUserInfo?admin_site=${pagePath}`;
			// #endif
		},
		// 小程序获取用户信息
		async getUserInfo(e) {
			console.log(e);
			if (e.detail.userInfo) {
				this.form.nickname = e.detail.userInfo.nickName;
				this.form.avatarurl = encodeURI(e.detail.userInfo.avatarUrl);
				this.form.encrypteddata = encodeURI(e.detail.encryptedData);
				this.form.iv = e.detail.iv;
				this.login();
			}
		},

		// 获取小程序code
		async getweixinCode() {
			// #ifdef MP
			let [error, res] = await uni.login();
			console.log(error, res);
			if (res.code) {
				this.form.code = res.code;
			}
			// #endif
		},

		async login() {
			uni.showLoading({ title: '登录中...', mask: true });
			if (uni.getStorageSync('lzp_invite_code')) this.form.invite_code = uni.getStorageSync('lzp_invite_code');
			let res = await this.$http.post('/api/applets/authlogin', { ...this.form });
			uni.hideLoading();
			if (res.code == 0) {
				this.setLoginModal(false);
				if (res.data.mobile_bind) {
					this.$store.commit('TOKEN', res.data.token);
					uni.reLaunch({ url: '/pages/tabbar/home' });
				} else uni.navigateTo({ url: `/pages/phone-login/phone-login?token=${res.data.token}` });
			} else {
				uni.showToast({
					title: res.msg,
					icon: 'none'
				});
			}
		},

		cancel() {
			this.setLoginModal(false);
		}
	}
};
</script>

<style lang="scss">
.login-modal {
	position: relative;
	display: flex;
	flex-direction: column;
	align-items: center;
	box-sizing: border-box;
	padding: 50upx 0 80upx 0;
	.close-icon {
		position: absolute;
		top: 20upx;
		right: 30upx;
		font-size: 48upx;
	}
	.logo {
		width: 120upx;
		height: 120upx;
		display: flex;
		justify-content: center;
		align-items: center;
		.logo-icon {
			width: 120upx;
			height: 120upx;
		}
	}
	.login-text {
		padding: 60upx 0;
		font-size: 28upx;
	}
	.cu-btn.lg {
		width: 280upx;
	}
}
</style>
