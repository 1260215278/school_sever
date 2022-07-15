<template>
	<view class="page">
		<image class="logo" src="/static/logo.jpg" mode="widthFix"></image>
		<view class="title">龙子派小程序</view>
		<view class="subtitle">提供有温度的校园服务</view>
		<view class="btns">
			<button @click="cancel" class="btn cancel" plain>取消</button>
			<button open-type="getPhoneNumber" @getphonenumber="getPhoneNumber" class="btn confirm">微信登录</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			form: { code: '', encryptedData: '', iv: '', token: '' }
		};
	},
	onLoad(options) {
		this.form.token = options.token;
	},
	methods: {
		cancel() {
			uni.navigateBack();
		},

		async getPhoneNumber(e) {
			await this.getweixinCode();
			if (e.detail.iv) {
				this.form.encryptedData = e.detail.encryptedData;
				this.form.iv = e.detail.iv;
				let res = await this.$http.post('/api/applets/get_phone', { ...this.form });
				if (res.code == 0) {
					this.$store.commit('TOKEN', this.form.token);
					uni.reLaunch({ url: '/pages/tabbar/home' });
				}
			}
		},

		// 获取小程序code
		async getweixinCode() {
			// #ifdef MP
			let [error, res] = await uni.login();
			if (res.code) {
				this.form.code = res.code;
			}
			// #endif
		}
	}
};
</script>

<style lang="scss" scoped>
.page {
	display: flex;
	flex-direction: column;
	align-items: center;
	height: 100vh;
	padding-top: 200rpx;
	.logo {
		width: 160rpx;
		margin-bottom: 30rpx;
		border-radius: 10rpx;
	}
	.title {
		font-size: 36rpx;
		font-weight: 600;
		margin-bottom: 20rpx;
	}
	.subtitle {
		font-size: 32rpx;
		color: #999;
	}
	.btns {
		display: flex;
		justify-content: space-between;
		width: 100%;
		padding: 100rpx 30rpx;
	}
	.btns .btn {
		flex: 1;
		border-radius: 46rpx;
	}
	.btns .cancel {
		margin-right: 30rpx;
		color: #999;
		border-color: #ccc;
	}
	.btns .cancel.button-hover {
		background-color: #f5f5f5;
	}
	.btns .confirm {
		background-color: #26d499;
		color: #ffffff;
	}
	.btns .confirm.button-hover {
		background-color: #26c499;
	}
}
</style>
