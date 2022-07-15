<template>
	<view class="life-order-details">
		<uni-nav-bar @clickLeft="clickLeft" class="uniNavBar" title="详情" left-icon="back" color="white" :shadow="false" :statusBar="true" backgroundColor="transparent"></uni-nav-bar>
		<view class="header">
			<view class="status text-xxl text-blod text-white">{{ lifeOrderStatusText(info.status) }}</view>
			<image src="../../static/order-bg-icon.png" class="order-bg-icon" mode=""></image>
		</view>
		<view class="container">
			<!-- 商家信息 -->
			<view class="item flex justify-between align-center padding-sm">
				<view class="flex-sub flex overflow">
					<image :src="info.store_avatar_path" class="order-details-img" mode="aspectFill"></image>
					<view class="flex-sub flex flex-direction justify-between overflow padding-lr-sm">
						<view class="text-df text-bold text-cut">{{ info.store_name }}</view>
						<view class="flex align-center text-666">
							<image src="../../static/location-gray-icon.png" class="location-gray-icon" mode=""></image>
							<text class="flex-sub padding-lr-sm text-cut">{{ info.store_address }}</text>
						</view>
					</view>
				</view>
				<view class="text-xl text-666"><text class="cuIcon-right"></text></view>
			</view>
			<!-- 商品信息-->
			<view class="item">
				<view class="text-lg text-green padding-sm">
					<text class="cuIcon-titles"><text class="text-black">商品信息</text></text>
				</view>
				<view class="margin-lr-sm padding-lr padding-bottom-sm">
					<view class="text-df text-bold">{{ info.goods_name }}</view>
					<view class="padding-tb-xs">{{ dateTxt(info.date_time) }}</view>
					<!-- <view class="">大床·含早·无线网</view> -->
				</view>
				<view class="margin-lr-sm text-df solid-top padding-lr padding-tb-sm">
					<view class="margin-bottom-xs">
						<text class="text-666 usreinfo-label">入住人</text>
						<text class="padding-lr text-black">{{ info.name }}</text>
					</view>
					<view class="margin-bottom-xs">
						<text class="text-666 usreinfo-label">房间数</text>
						<text class="padding-lr text-black">{{ info.goods_num }}间</text>
					</view>
					<view class="margin-bottom-xs">
						<text class="text-666 usreinfo-label">联系电话</text>
						<text class="padding-lr text-black">{{ info.mobile }}</text>
					</view>
					<view class="margin-bottom-xs">
						<text class="text-666 usreinfo-label">预计到店</text>
						<text class="padding-lr text-black">{{ info.appoint_time }}</text>
					</view>
					<view class="margin-bottom-xs">
						<text class="text-666 usreinfo-label">优惠券</text>
						<text class="padding-lr text-black">{{ info.coupon == '无' ? info.coupon : info.coupon + '元优惠券' }}</text>
					</view>
					<view class="">
						<text class="text-666 usreinfo-label">总价</text>
						<text class="padding-lr text-black">{{ info.pay_money }}</text>
					</view>
				</view>
			</view>
			<!-- 核销二维码 -->
			<view class="item padding-tb-sm flex justify-center align-center"><image :src="info.qrcode_path" class="verify-qrcode" mode="aspectFit"></image></view>
			<!-- 订单信息 -->
			<view class="item">
				<view class="text-lg text-green padding-sm">
					<text class="cuIcon-titles"><text class="text-black">订单信息</text></text>
				</view>
				<view class="text-df padding-left-xl padding-bottom-xs">
					<view class="flex align-center info-txt">
						<text class="text-666">订单号</text>
						<text class="flex-treble">{{ info.order_sn }}</text>
					</view>
					<view class="flex align-center info-txt ">
						<text class="text-666">下单时间</text>
						<text class="flex-treble">{{ info.addtime }}</text>
					</view>
					<view v-if="info.status == 4 || info.status == 5" class="flex align-center info-txt">
						<text class="text-666">使用时间</text>
						<text class="flex-treble">{{ info.finish_time }}</text>
					</view>
					<view v-if="info.status == 6" class="flex align-center info-txt">
						<text class="text-666">退款时间</text>
						<text class="flex-treble">{{ info.finish_time }}</text>
					</view>
				</view>
			</view>
			<!-- 联系客服 -->
			<view @click="contactService" class="item padding-lr padding-tb-sm contact-wrap flex justify-between align-center">
				<view class="flex align-center">
					<image src="../../static/contact-icon.png" class="contact-icon" mode=""></image>
					<text class="text-lg padding-lr-sm">联系客服</text>
				</view>
				<view class="text-xl"><text class="cuIcon-right text-666"></text></view>
			</view>
		</view>
		<!-- 底部操作条 -->
		<view v-if="!(info.status == 2 || info.status == 3)" class="actions-wrapper">
			<button v-if="info.status == 1" @click="canCelOrder" class="cu-btn line-gray margin-left-sm">取消订单</button>
			<button v-if="info.status == 1" @click="payNow(info.id)" class="cu-btn bg-green margin-left-sm">立即付款</button>
			<button v-if="info.status == 5 || info.status == 6 || info.status == 7" @click="delOrder" class="cu-btn line-gray margin-left-sm">删除订单</button>
			<button v-if="info.status == 4" @click="tolifeOrderEvaluate" class="cu-btn bg-green margin-left-sm">立即评价</button>
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
			info: {},
			CustomBar: this.CustomBar,
			notes: ''
		};
	},
	onLoad(option) {
		this.id = option.id;
		this.getData();
	},
	methods: {
		contactService() {
			uni.makePhoneCall({
				phoneNumber: this.info.store_phone
			});
		},
		dateTxt(val) {
			if (val) {
				return val.split(',')[0] + ' - ' + val.split(',')[1] + ' （共' + this.info.day + '晚）';
			} else {
				return '';
			}
		},
		// 生活订单状态
		lifeOrderStatusText(status) {
			switch (status) {
				case 1:
					return '待付款';
				case 2:
					return '待接单';
				case 3:
					return '待使用';
				case 4:
					return '待评价';
				case 5:
					return '已完成';
				case 6:
					return '已退款';
				case 7:
					return '已取消';
				default:
					return '';
			}
		},
		clickLeft() {
			uni.navigateBack();
		},
		tolifeOrderEvaluate() {
			uni.navigateTo({ url: `/pages/order/life-order-evaluate?id=${this.id}&store_id=${this.info.store_id}` });
		},
		getData() {
			this.$http.post('/api/life/order_life_detail', { order_id: this.id }).then(res => {
				if (res.code == 0) {
					this.info = res.data;
				}
			});
		},
		canCelOrder() {
			this.$http.post('/api/life/cancel_order_life', { order_id: this.id }).then(res => {
				if (res.code == 0) {
					this.getData();
				}
			});
		},
		delOrder() {
			this.$http.post('/api/life/del_order_life', { order_id: this.id }).then(res => {
				if (res.code == 0) {
					uni.navigateBack();
				}
			});
		},

		// 生活订单立即付款
		async payNow(id) {
			// #ifdef H5
			location.href = `${this.$domain}/api/life/pay_order_life?order_id=${id}`;
			// #endif
			// #ifdef MP
			uni.showLoading({ title: '提交中...', mask: true });
			let result = await this.$http.post('/api/appletspay/life_order_pay', { order_id: id });
			uni.hideLoading();
			if (result.code == 0) {
				uni.requestPayment({
					timeStamp: result.data.timeStamp,
					nonceStr: result.data.nonceStr,
					package: result.data.package,
					signType: result.data.signType,
					paySign: result.data.paySign,
					success: response => {
						this.getData();
					}
				});
			}
			// #endif
		}
	}
};
</script>
<style lang="scss">
page {
	background: #fafafa;
}
.life-order-details {
	.uniNavBar {
		/deep/.uni-navbar--border {
			border-bottom-color: transparent;
		}
		/deep/.uni-navbar__content {
			background: linear-gradient(94deg, rgba(20, 201, 140, 1), rgba(72, 232, 178, 1)) !important;
		}
	}
	.header {
		height: 150upx;
		background: linear-gradient(94deg, rgba(20, 201, 140, 1), rgba(72, 232, 178, 1));
		position: relative;
		.status {
			position: absolute;
			bottom: 40upx;
			left: 0;
			padding: 0 60upx;
		}
		.order-bg-icon {
			width: 80upx;
			height: 80upx;
			position: absolute;
			bottom: 15upx;
			right: 70upx;
		}
	}
	.container {
		margin-top: 20upx;
		padding-bottom: 100upx;
		.item {
			box-shadow: 0px 0px 10upx 0px rgba(152, 152, 152, 0.1);
			border-radius: 20upx;
			margin: 0 30upx;
			margin-bottom: 20upx;
			background: #ffffff;
			.order-details-img {
				width: 100upx;
				height: 88upx;
				border-radius: 8upx;
			}
			.order-confirm-img {
				width: 120upx;
				height: 120upx;
				border-radius: 12upx;
				margin-right: 20upx;
			}
			.usreinfo-label {
				display: inline-block;
				width: 130upx;
			}
			.verify-qrcode {
				width: 260upx;
				height: 260upx;
			}
		}
		.contact-icon {
			width: 44upx;
			height: 44upx;
		}
		.info-txt {
			padding: 5upx 0;
			> text:first-child {
				flex: 0 0 200upx;
			}
		}
	}
	.actions-wrapper {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		height: 100upx;
		padding: 0 30upx;
		background: #ffffff;
		display: flex;
		justify-content: flex-end;
		align-items: center;
	}
}
</style>
