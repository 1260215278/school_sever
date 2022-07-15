<template>
	<view class="driving-details">
		<!-- #ifdef H5 -->
		<text @click="clickLeft" class="cuIcon-roundrightfill"></text>
		<!-- #endif -->

		<view class="swper">
			<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" indicator-color="#fff" indicator-active-color="#2FE1A5" circular>
				<swiper-item v-for="(item, index) in info.driving_banner_images" :key="index">
					<view class="swiper-item"><image :src="item" mode="aspectFill" class="driving-banner"></image></view>
				</swiper-item>
			</swiper>
		</view>

		<view class="organinfo-wrap">
			<view class="organ-info">
				<text class="organ-title text-cut">{{ info.driving_name }}</text>
				<image @click="makePhone" src="/static/second-phase/organ-phone.png" class="organ-phone"></image>
			</view>
			<view @click="openMap" class="organ-address">
				<image src="/static/second-phase/organ-add-icon.png" class="organ-address-icon"></image>
				<text class="organ-add-title">{{ info.driving_map_address }}</text>
				<uni-icons type="arrowright" color="#000" :size="20"></uni-icons>
			</view>
		</view>

		<view class="organ-details">
			<view class="organ-tabs">
				<view @click="organTabChange(item.value)" v-for="(item, index) in organTabs" :key="index" :class="['organ-tab', { active: item.value == organTabValue }]">
					{{ item.title }}
				</view>
			</view>
			<view v-if="organTabValue == 1" class="organ-intro"><jyf-parser ref="article" :html="info.driving_detail"></jyf-parser></view>
			<view v-if="organTabValue == 2" class="padding-tb">
				<navigator
					:url="`/pages/composite/driving-class-detail?id=${item.id}&title=${item.driving_class}`"
					v-for="(item, index) in info.list"
					:key="index"
					class="charge-item flex flex-direction"
				>
					<view class="text-xl text-black text-bold">
						<text class="text-green">{{ item.driving_first }}</text>
						<text class="padding-lr-xs" style="position: relative;top: -3upx">|</text>
						{{ item.driving_class }}
					</view>
					<view class="text-999 text-df padding-top-xs">车辆分配：{{ item.driving_referral }}</view>
					<view class="charge-price text-price text-red text-lg">{{ item.driving_price }}</view>
					<button @click.stop="toConfirmInfo(item)" class="cu-btn bg-red sign-up-btn round">立即报名</button>
				</navigator>
			</view>
		</view>

		<login-modal></login-modal>
	</view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import common from '@/utils/mixins/common.js';

export default {
	mixins: [common],
	data() {
		return {
			id: '',
			info: {},

			organTabs: [{ title: '详情', value: 1 }, { title: '班型', value: 2 }],
			organTabValue: 1
		};
	},
	computed: {
		...mapGetters(['token'])
	},
	onLoad(option) {
		this.id = option.id;
		this.getData();
	},
	methods: {
		makePhone() {
			uni.makePhoneCall({
				phoneNumber: this.info.driving_phone
			});
		},
		organTabChange(val) {
			this.organTabValue = val;
		},
		clickLeft() {
			uni.navigateBack();
		},
		getData() {
			this.$http.post('/api/driving/driving', { id: this.id }).then(res => {
				if (res.code == 0) {
					this.info = res.data;
				}
			});
		},
		// 收藏
		collect() {
			if (!this.token) {
				this.setLoginModal(true);
			}
			// 收藏
			if (this.info.enshrine == 0) {
				// type 1是商家2是二手闲置3是驾校
				this.$http.post('/api/driving/addEnshrine', { cid: this.id, type: 3 }).then(res => {
					if (res.code == 0) {
						this.getData();
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			} else {
				// 取消收藏
				this.$http.post('/api/driving/deleteEnshrine', { id: this.info.evaluate_id }).then(res => {
					if (res.code == 0) {
						this.getData();
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			}
		},
		toConfirmInfo(item) {
			uni.navigateTo({
				url: `/pages/composite/driving-sign?driving_first=${item.driving_first}&driving_class=${item.driving_class}&driving_price=${item.driving_price}&driving_referral=${
					item.driving_referral
				}&id=${item.id}&driving_name=${this.info.driving_name}`
			});
		},

		// 打开地图查看位置
		openMap() {
			if (!this.info.driving_map) return;
			let [lng, lat] = this.info.driving_map.split(',');
			// #ifdef H5
			if (uni.getSystemInfoSync().platform == 'ios') {
				location.href = `https://apis.map.qq.com/tools/poimarker?type=0&marker=coord:${parseFloat(lat)},${parseFloat(lng)};title:${this.info.driving_name};addr:${
					this.info.driving_map_address
				}&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp`;
			} else {
				uni.openLocation({
					latitude: parseFloat(lat),
					longitude: parseFloat(lng),
					name: this.info.driving_name,
					address: this.info.driving_map_address,
					success: function() {}
				});
			}
			// #endif
			// #ifdef MP
			uni.openLocation({
				latitude: parseFloat(lat),
				longitude: parseFloat(lng),
				name: this.info.driving_name,
				address: this.info.driving_map_address,
				success: function() {}
			});
			// #endif
		}
	}
};
</script>

<style lang="scss" scoped>
.driving-details {
	/deep/.uni-navbar--border {
		border-color: transparent;
	}
	.driving-img {
		width: 150upx;
		height: 150upx;
		border-radius: 20upx;
	}
	.collect {
		position: absolute;
		top: 10upx;
		right: 0;
		width: 48upx;
		height: 48upx;
	}
	.car-intro-icon,
	.charge-icon {
		width: 36upx;
		height: 36upx;
	}
	.charge-item {
		box-shadow: 0px 0px 10px 0px rgba(152, 152, 152, 0.2);
		border-radius: 20upx;
		padding: 30upx 30upx;
		position: relative;
		margin-bottom: 20upx;
		.charge-price {
			position: absolute;
			top: 15upx;
			right: 70upx;
		}
		.sign-up-btn {
			position: absolute;
			bottom: 15upx;
			right: 30upx;
		}
	}
}
page {
	background-color: #f2f2f2;
}
.cuIcon-roundrightfill {
	position: absolute;
	top: 30rpx;
	left: 20rpx;
	z-index: 9;
	transform: rotate(180deg);
	color: #8f8c89;
	font-size: 56rpx;
}
swiper {
	width: 100%;
	height: 420rpx;
}
.swiper-item,
.driving-banner {
	width: 100%;
	height: 100%;
}
.organinfo-wrap {
	padding: 30rpx;
	background-color: #ffffff;
	.organ-info {
		display: flex;
		align-items: center;
		.organ-logo {
			width: 57rpx;
			height: 44rpx;
		}
		.organ-title {
			flex: 1;
			font-size: 34rpx;
			padding: 0 10rpx;
			font-weight: bold;
		}
		.organ-phone {
			width: 31rpx;
			height: 39rpx;
		}
	}
	.organ-address {
		padding-top: 20rpx;
		display: flex;
		align-items: center;
		.organ-address-icon {
			width: 24rpx;
			height: 30rpx;
		}
		.organ-add-title {
			flex: 1;
			font-size: 24rpx;
			padding: 0 10rpx;
		}
	}
}

.organ-details {
	padding: 0 20rpx;
	background-color: #ffffff;
	margin-top: 20rpx;
	.organ-tabs {
		height: 88rpx;
		display: flex;
		align-items: center;
		border-bottom: 2rpx solid #ebebeb;
		.organ-tab {
			flex: 1;
			line-height: 88rpx;
			text-align: center;
			font-size: 34rpx;
			color: #999;
			position: relative;
			&.active {
				font-weight: bold;
				color: #333;
				&:after {
					background: rgba(38, 212, 153, 1);
				}
			}
			&::after {
				content: '';
				width: 67rpx;
				height: 6rpx;
				background: transparent;
				border-radius: 10rpx;
				position: absolute;
				bottom: 0;
				left: 50%;
				transform: translateX(-50%);
			}
		}
	}

	.organ-intro {
		padding: 20rpx 0;
	}
	.organ-class-intro {
		padding: 30rpx 0;
	}
	.organ-class-item {
		box-shadow: 0px 3rpx 6rpx rgba(0, 0, 0, 0.16);
		border-radius: 8rpx;
		position: relative;
		padding: 30rpx 250rpx 40rpx 30rpx;
		margin-bottom: 30rpx;
		.organclass-title-wrap {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		.organclass-title {
			font-size: 34rpx;
			color: #26d499;
		}
		.organclass-label {
			font-size: 26rpx;
			color: #999;
		}
		.organ-class-desc {
			font-size: 26rpx;
			color: #999;
			padding-top: 20rpx;
		}
		.organclass-price {
			font-size: 32rpx;
			color: #ff3e47;
			font-weight: bold;
			position: absolute;
			top: 35rpx;
			right: 80rpx;
		}
		.btn-apply {
			position: absolute;
			top: 80rpx;
			right: 30rpx;
			font-size: 28rpx;
			background-color: #ff3e47;
			color: #ffffff;
			border-radius: 30rpx;
		}
	}
}
</style>
