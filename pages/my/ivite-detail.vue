<template>
	<view>
		<uni-nav-bar left-icon="back" @clickLeft="clickLeft" :statusBar="true" color="#fff" fixed backgroundColor="transparent" :border="false" :shadow="false"></uni-nav-bar>
		<view class="container">
			<image src="/static/second-phase/invite-bg.png" mode="widthFix" class="invite-bg"></image>
			<image src="/static/second-phase/invite-0.png" mode="widthFix" class="invite-0"></image>
			<image src="/static/second-phase/invite-1.png" mode="widthFix" class="invite-1"></image>

			<view class="card-qrcode">
				<view class="qrcode-title">每邀请1名用户，可得现金优惠券</view>
				<!-- #ifdef H5 -->
				<image :src="userinfo.invite_qr_code" mode="scaleToFill" class="qrcode-img"></image>
				<!-- #endif -->
				<!-- #ifdef MP -->
				<image :src="userinfo.invite_applets_qr_code" mode="scaleToFill" class="qrcode-img"></image>
				<!-- #endif -->
				<view class="qrcode-actions">
					<button @click="previewImage" class="btn-save">保存二维码</button>
					<button @click="clipboard" open-type="share" class="btn-share">分享链接</button>
				</view>
			</view>

			<view class="invite-log">
				<view class="invite-log-title">我的邀请记录</view>
				<view class="invite-list">
					<view v-for="(item, index) in list" :key="index" class="invite-list-item">
						<image :src="item.avatar" mode="aspectFill" class="invite-avatar"></image>
						<view class="invite-name text-cut">{{ item.nickname }}</view>
						<view class="invite-money">{{ item.money }}元</view>
					</view>
				</view>
				<tips v-if="nodata" :fixed="false" imgUrl="/static/img_nodata.png">暂无邀请记录</tips>
			</view>
		</view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
const thorui = require('@/components/utils/clipboard.thorui.js');
export default {
	data() {
		return {
			list: [],
			nodata: false
		};
	},
	computed: {
		...mapGetters(['userinfo', 'shareData'])
	},
	onLoad() {
		console.log(this.userinfo)
		this.getInviteList();
	},
	onShareAppMessage() {
		return {
			title: this.shareData ? this.shareData.title : '',
			path: this.shareData && this.userinfo ? `/pages/tabbar/home?invite_code=${this.userinfo.invite_code}` : ''
		};
	},
	methods: {
		async getInviteList() {
			let res = await this.$http.post('/api/express/get_invitation_record');
			if (res.code == 0) {
				this.nodata = !res.data.length;
				this.list = res.data;
			}
		},
		previewImage() {
			uni.previewImage({
				urls: [this.userinfo.invite_qr_code],
				success: res => {
					console.log(res);
				}
			});
		},
		// 分享
		clipboard() {
			// #ifdef H5
			let path = this.$domain + '/h5/#/?invite_code=' + this.userinfo.invite_code;
			thorui.getClipboardData(path, res => {
				if (res) {
					uni.showToast({
						title: '分享链接复制成功',
						icon: 'none'
					});
				} else {
					uni.showToast({
						title: '分享链接复制失败',
						icon: 'none'
					});
				}
			});
			// #endif
		},

		clickLeft() {
			uni.navigateBack();
		}
	}
};
</script>

<style lang="scss" scoped>
.container {
	min-height: 100vh;
	position: position;
	overflow: hidden;
	background-color: #ff4b2b;
	.invite-bg {
		width: 100%;
		vertical-align: middle;
		position: absolute;
		top: 0;
		left: 0;
	}
	.invite-0 {
		position: absolute;
		top: 370rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 600rpx;
	}
	.invite-1 {
		position: absolute;
		top: 430rpx;
		left: 50%;
		transform: translateX(-50%);
		width: 206rpx;
		z-index: 9;
	}

	.card-qrcode {
		border-radius: 40rpx;
		background-color: #ffffff;
		margin: 500rpx 30rpx 30rpx 30rpx;
		display: flex;
		flex-direction: column;
		align-items: center;
		position: relative;
		padding: 90rpx 70rpx 50rpx 70rpx;
		.qrcode-title {
			font-size: 28rpx;
		}
		.qrcode-img {
			width: 354rpx;
			height: 354rpx;
			margin: 30rpx 0 50rpx 0;
		}
		.qrcode-actions {
			display: flex;
			align-items: center;
			justify-content: space-between;
			width: 100%;
			.btn-save,
			.btn-share {
				margin: 0;
				font-size: 28rpx;
				color: #ffffff;
				padding: 0 60rpx;
			}
			.btn-save {
				background-color: #ef3737;
			}
			.btn-share {
				background-color: #ffa92e;
			}
		}
	}

	.invite-log {
		border-radius: 40rpx;
		background-color: #ffffff;
		position: relative;
		padding: 40rpx 30rpx 60rpx 30rpx;
		margin: 30rpx 30rpx;
		.invite-log-title {
			font-size: 32rpx;
			font-weight: bold;
			display: flex;
			align-items: center;
			justify-content: center;
			padding-bottom: 40rpx;
			&::before {
				content: '';
				width: 123rpx;
				height: 4rpx;
				background: linear-gradient(90deg, rgba(255, 169, 46, 1), rgba(239, 55, 55, 1));
				margin-right: 35rpx;
			}
			&::after {
				content: '';
				width: 123rpx;
				height: 4rpx;
				background: linear-gradient(90deg, rgba(239, 55, 55, 1), rgba(255, 169, 46, 1), rgba(255, 169, 46, 1));
				margin-left: 35rpx;
			}
		}
		.invite-avatar {
			width: 87rpx;
			height: 87rpx;
			border-radius: 50%;
		}

		.invite-list-item {
			padding: 20rpx 0;
			border-bottom: 2rpx solid #e8e8e8;
			display: flex;
			align-items: center;
			.invite-name {
				flex: 1;
				padding: 0 20rpx;
				font-size: 30rpx;
			}
			.invite-money {
				font-size: 30rpx;
				color: #f1344c;
			}
		}
	}
}
</style>
