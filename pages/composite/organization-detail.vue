<template>
	<view v-if="info">
		<uni-nav-bar
			:statusBar="true"
			class="navBar"
			:title="title"
			leftIcon="back"
			color="#333"
			:fixed="true"
			:shadow="false"
			@clickLeft="clickLeft"
			:border="false"
			backgroundColor="#fff"
		></uni-nav-bar>

		<view class="swper">
			<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" indicator-color="#fff" indicator-active-color="#2FE1A5" circular next-margin="20rpx">
				<swiper-item v-for="(item, index) in info.images" :key="index">
					<view class="swiper-item"><image :src="item" mode="aspectFill" class="organ-banner"></image></view>
				</swiper-item>
			</swiper>
		</view>

		<view class="organinfo-wrap">
			<view class="organ-info">
				<image :src="info.logo" mode="aspectFill" class="organ-logo"></image>
				<text class="organ-title text-cut">{{ info.name }}</text>
				<image @click="makePhone" src="/static/second-phase/organ-phone.png" class="organ-phone"></image>
			</view>
			<view @click="openMap" class="organ-address">
				<image src="/static/second-phase/organ-add-icon.png" class="organ-address-icon"></image>
				<text class="organ-add-title">{{ info.province + info.city + info.area + info.address }}</text>
				<uni-icons type="arrowright" color="#000" :size="20"></uni-icons>
			</view>
		</view>

		<view class="organ-details">
			<view class="organ-tabs">
				<view @click="organTabChange(item.value)" v-for="(item, index) in organTabs" :key="index" :class="['organ-tab', { active: item.value == organTabValue }]">
					{{ item.title }}
				</view>
			</view>
			<view v-if="organTabValue == 1" class="organ-intro"><jyf-parser ref="article" :html="info.detail"></jyf-parser></view>
			<view v-if="organTabValue == 2" class="organ-class-intro">
				<navigator :url="`/pages/composite/organization-class-detail?id=${item.id}&title=${item.name}`" v-for="(item, index) in info.class" :key="index" class="organ-class-item">
					<view class="organclass-title-wrap">
						<text class="organclass-title">{{ item.name }}</text>
						<text class="organclass-label">{{ item.summary }}</text>
					</view>
					<view class="organ-class-desc">{{ item.time }}</view>
					<view class="organclass-price text-price">{{ item.price }}</view>
					<button @click.stop="toConfirmApply(item)" class="btn-apply" size="mini">立即报名</button>
				</navigator>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			title: '',
			info: '',
			organTabs: [{ title: '机构简介', value: 1 }, { title: '班型介绍', value: 2 }],
			organTabValue: 1
		};
	},
	onLoad(options) {
		this.id = options.id;
		this.title = options.title;
		this.getDetails();
	},
	methods: {
		async getDetails() {
			let res = await this.$http.post('/api/training/get_institution_detail', { id: this.id }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
			if (res.code == 0) {
				this.info = res.data;
			}
		},
		makePhone() {
			uni.makePhoneCall({
				phoneNumber: this.info.phone
			});
		},
		clickLeft() {
			uni.navigateBack();
		},
		organTabChange(val) {
			this.organTabValue = val;
		},
		toConfirmApply(item) {
			uni.navigateTo({ url: `/pages/composite/organ-confirm-order?class_id=${item.id}&class_name=${item.name}&class_price=${item.price}&class_time=${item.time}` });
		},

		// 打开地图查看位置
		openMap() {
			// #ifdef H5
			if (uni.getSystemInfoSync().platform == 'ios') {
				location.href = `https://apis.map.qq.com/tools/poimarker?type=0&marker=coord:${parseFloat(this.info.lat)},${parseFloat(this.info.lng)};title:${this.info.name};addr:${this
					.info.province +
					this.info.city +
					this.info.area +
					this.info.address}&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp`;
			} else {
				uni.openLocation({
					latitude: parseFloat(this.info.lat),
					longitude: parseFloat(this.info.lng),
					name: this.info.name,
					address: this.info.province + this.info.city + this.info.area + this.info.address,
					success: function() {}
				});
			}
			// #endif
			// #ifdef MP
			uni.openLocation({
				latitude: parseFloat(this.info.lat),
				longitude: parseFloat(this.info.lng),
				name: this.info.name,
				address: this.info.province + this.info.city + this.info.area + this.info.address,
				success: function() {}
			});
			// #endif
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: #f2f2f2;
}

.swper {
	padding: 10rpx 0;
	background-color: #ffffff;
}
swiper {
	width: 100%;
	height: 300rpx;
	padding-left: 30rpx;
	background-color: #ffffff;
}
.swiper-item,
.organ-banner {
	width: 100%;
	height: 100%;
	border-radius: 20rpx;
}
.swiper-item {
	padding-right: 20rpx;
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
