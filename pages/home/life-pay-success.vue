<template>
	<view class="life-pay-success">
		<uni-nav-bar title="支付成功" leftIcon="back" fixed :statusBar="true" @clickLeft="clickLeft"></uni-nav-bar>

		<view class="container text-df">
			<view class="flex flex-direction align-center padding-tb-xl margin-tb">
				<image src="../../static/success-icon.png" class="success-icon" mode=""></image>
				<text class="padding-tb">支付成功</text>
			</view>
			<view class="flex justify-between padding-lr-xl margin-lr-xl">
				<button @click="againOrder" class="cu-btn round bg-green text-white btn">再来一单</button>
				<button @click="viewDetails" class="cu-btn round line-green text-green btn">查看订单</button>
			</view>
		</view>
	</view>
</template>

<script>
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';

export default {
	components: { uniNavBar },
	data() {
		return {
			id: ''
		};
	},
	onLoad(option) {
		this.id = option.id;
		this.store_id = option.store_id;
	},
	methods: {
		clickLeft() {
			uni.switchTab({
				url: '/pages/tabbar/home'
			});
		},
		againOrder() {
			uni.navigateTo({
				url: `/pages/home/life-details?id=${this.store_id}`
			});
		},
		viewDetails() {
			uni.navigateTo({
				url: `/pages/order/life-order-details?id=${this.id}`
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
