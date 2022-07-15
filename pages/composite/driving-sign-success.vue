<template>
	<view class="driving-sign-success">
		<uni-nav-bar title="报名成功" leftIcon="back" fixed :statusBar="true" @clickLeft="clickLeft"></uni-nav-bar>
		<view class="container">
			<view class="flex flex-direction align-center padding-tb-xl margin-tb">
				<image src="../../static/sign-success-icon.png" class="sign-success-icon" mode=""></image>
				<text class="padding-top-xl text-lg">报名成功</text>
				<view class="text-999 flex align-center padding-top-sm">
					<image src="../../static/car-icon.png" class="car-icon" mode=""></image>
					<text class="padding-lr-xs">{{ name }}</text>
				</view>
			</view>
			<view class="flex justify-between padding-lr-xl margin-lr-xl">
				<button @click="backHome" class="cu-btn round bg-green text-white btn">返回首页</button>
				<button @click="viewDetails" class="cu-btn round line-green text-green btn">查看详情</button>
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
			id: '',
			name: ''
		};
	},
	onLoad(option) {
		this.id = option.id;
		this.name = option.name;
	},
	methods: {
		clickLeft() {
			uni.switchTab({
				url: '/pages/tabbar/composite'
			});
		},
		backHome() {
			uni.switchTab({
				url: '/pages/tabbar/composite'
			});
		},
		viewDetails() {
			uni.navigateTo({
				url: `/pages/my/my-driving-details?id=${this.id}`
			});
		}
	}
};
</script>

<style lang="scss">
.driving-sign-success {
	/deep/.uni-navbar--border {
		border-color: transparent;
	}
	.sign-success-icon {
		width: 200upx;
		height: 154upx;
	}
	.car-icon {
		width: 36upx;
		height: 36upx;
	}
	.btn {
		width: 260upx;
	}
}
</style>
