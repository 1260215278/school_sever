<template>
	<view class="life-pay-success">
		<uni-nav-bar title="支付成功" leftIcon="back" fixed :statusBar="true" @clickLeft="clickLeft"></uni-nav-bar>
		<view class="container text-df">
			<view class="flex flex-direction align-center padding-tb-xl margin-tb">
				<image src="/static/success-icon.png" class="success-icon" mode=""></image>
				<text class="padding-tb">支付成功</text>
			</view>
			<view class="flex justify-between padding-lr-xl margin-lr-xl">
				<button @click="againOrder" class="cu-btn round bg-green text-white btn">继续取件</button>
				<button @click="viewDetails" class="cu-btn round line-green text-green btn">查看订单</button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			id: ''
		};
	},
	onLoad(option) {
		this.id = option.id;
	},
	methods: {
		clickLeft() {
			uni.switchTab({
				url: '/pages/tabbar/composite'
			});
		},
		againOrder() {
			uni.navigateTo({
				url: '/pages/composite/behalf-issue'
			});
		},
		viewDetails() {
			uni.navigateTo({
				url: `/pages/my/behalf-order-details?id=${this.id}`
			});
		}
	}
};
</script>

<style lang="scss">
.life-pay-success {
	.pay-success-icon {
		width: 148upx;
		height: 134upx;
	}
	.btn {
		width: 260upx;
	}
}
</style>
