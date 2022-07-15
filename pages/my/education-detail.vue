<template>
	<view>
		<uni-nav-bar fixed statusBar leftIcon="back" title="详情" @clickLeft="clickLeft" :border="false" shadow></uni-nav-bar>
		<view v-if="info" class="container">
			<view class="card class-card">
				<view class="card-title">班型费用</view>
				<view class="price text-price">{{ info.class_info.price }}</view>
				<view class="class">{{ info.class_info.name }}</view>
				<view class="time">{{ info.class_info.time }}</view>
			</view>
			<view class="card">
				<view class="card-title">教育信息</view>
				<view class="organ-card">
					<image class="organ-logo" :src="info.institution_info.logo" mode="aspectFill"></image>
					<view class="organ-desc">
						<view class="organ-name">{{ info.institution_info.name }}</view>
						<view class="organ-tags">
							<view v-for="(item, index) in info.institution_info.category.split(',')" :key="index" class="organ-tag">{{ item }}</view>
						</view>
						<view class="organ-detail text-two-omit">{{ info.institution_info.description }}</view>
						<navigator :url="`/pages/composite/organization-detail?id=${info.institution_info.id}&title=${info.institution_info.name}`" class="organ-view">查看详情&gt;</navigator>
					</view>
				</view>
			</view>
			<view class="card">
				<view class="card-title">报名信息</view>
				<view class="signup-item">学员姓名：{{ info.user_indo.name }}</view>
				<view class="signup-item">联系方式：{{ info.user_indo.phone }}</view>
				<view class="signup-item">所在学校：{{ info.user_indo.school }}</view>
				<view class="signup-item">报名时间：{{ info.user_indo.time }}</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			id: '',
			info: ''
		};
	},
	onLoad(options) {
		this.id = options.id;
		this.getDetails();
	},
	methods: {
		async getDetails() {
			let res = await this.$http.post('/api/training/my_order_detail', { order_id: this.id });
			if (res.code == 0) {
				this.info = res.data;
			}
		},
		
		clickLeft() {
			uni.navigateBack()
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: #f2f2f2;
}
.container {
	padding: 20rpx 30rpx;
	.card {
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 0px 6rpx rgba(0, 0, 0, 0.16);
		border-radius: 20rpx;
		padding: 25rpx 30rpx;
		margin-bottom: 20rpx;

		.card-title {
			font-size: 30rpx;
			font-weight: 600;
			position: relative;
			display: flex;
			align-items: center;
			&::before {
				content: '';
				width: 6rpx;
				height: 30rpx;
				background: rgba(38, 212, 153, 1);
				border-radius: 10rpx;
				margin-right: 20rpx;
			}
		}

		.signup-item {
			font-size: 26rpx;
			color: #999;
			padding-top: 15rpx;
		}
	}
	.class-card {
		text-align: center;
		.price {
			font-size: 80rpx;
			color: #ff3e47;
		}
		.class {
			font-size: 36rpx;
			font-weight: bold;
			padding-bottom: 10rpx;
		}
		.time {
			font-size: 26rpx;
			color: #999;
		}
	}
	.organ-card {
		display: flex;
		align-items: center;
		.organ-logo {
			width: 158rpx;
			height: 118rpx;
			margin-right: 15rpx;
		}
		.organ-desc {
			flex: 1;
			position: relative;
			.organ-name {
				font-size: 32rpx;
				font-weight: bold;
				padding-right: 100rpx;
			}
			.organ-tags {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
				padding: 18rpx 0 8rpx 0;
			}
			.organ-tag {
				margin-right: 10rpx;
				margin-bottom: 10rpx;
				padding: 2rpx 10rpx 4rpx 10rpx;
				border: 2rpx solid rgba(38, 212, 153, 1);
				border-radius: 5rpx;
				color: #26d499;
			}
			.organ-detail {
				font-size: 24rpx;
				overflow: hidden;
			}
			.organ-view {
				position: absolute;
				top: 5rpx;
				right: 0;
				color: #26d499;
			}
		}
	}
}
</style>
