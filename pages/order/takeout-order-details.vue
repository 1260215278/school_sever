<template>
	<view class="takeout-order-details">
		<uni-nav-bar @clickLeft="clickLeft" class="uniNavBar" title="详情" left-icon="back" color="white" :statusBar="true" :shadow="false" backgroundColor="transparent"></uni-nav-bar>
		<view class="header">
			<view class="status text-xxl text-blod text-white">{{ orderStatusText(info.status) }}</view>
			<image src="../../static/order-bg-icon.png" class="order-bg-icon" mode=""></image>
		</view>
		<view class="container">
			<!-- 地址 -->
			<view v-if="info.address" class="item padding">
				<view class="text-xl text-bold">
					{{ info.address.province + info.address.city + info.address.district + info.address.school_name + info.address.build_no + '号楼' + info.address.address }}
				</view>
				<view class="text-df padding-top-sm">
					<text>{{ info.address.name }}</text>
					<text class="padding-lr">{{ info.address.phone }}</text>
				</view>
			</view>
			<!-- 商家信息 -->
			<view class="item flex justify-between align-center padding-sm">
				<view class="flex-sub flex overflow">
					<image :src="info.store_avatar" class="order-details-img" mode="aspectFill"></image>
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
			<!-- 菜品信息-->
			<view class="item">
				<view class="text-lg text-green padding-sm">
					<text class="cuIcon-titles"><text class="text-black">菜品信息</text></text>
				</view>
				<view class="list padding-lr">
					<view v-for="(item, index) in info.goods" :key="index" class="list-item flex justify-between margin-bottom">
						<image :src="item.goods_img_path" class="order-confirm-img" mode="aspectFill"></image>
						<view class="flex-sub overflow flex flex-direction justify-between text-df">
							<view class="text-cut">{{ item.goods_name }}</view>
							<view class="flex justify-between align-center">
								<text class="text-price text-xl text-red text-bold">{{ item.price }}</text>
								<text>x{{ item.num }}</text>
							</view>
						</view>
					</view>
				</view>
				<view class="flex justify-between align-center text-lg padding-tb margin-lr solid-top">
					<view class="text-666">配送费</view>
					<view class="">{{ info.deliver_fee }}元</view>
				</view>
				<view class="flex justify-between align-center text-lg padding-tb margin-lr solid-top">
					<view class="text-666">包装费</view>
					<view class="">{{ info.pack_fee }}元</view>
				</view>
				<view class="flex justify-between align-center text-lg padding-tb margin-lr solid-top">
					<view class="text-666">优惠券</view>
					<view class="">{{ info.coupon ? info.coupon + '元优惠券' : '无' }}</view>
				</view>
				<view class="flex justify-between text-lg padding-tb margin-lr solid-top">
					<view class="text-666">备注</view>
					<view class="flex-sub padding-lr-sm-left text-right">{{ info.remark ? info.remark : '无' }}</view>
				</view>
				<view class="flex justify-end text-lg text-red solid-top padding-tb margin-lr">总计：￥{{ info.pay_money }}</view>
			</view>
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
					<view v-if="info.status == 6" class="flex align-center info-txt">
						<text class="text-666">配送时间</text>
						<text class="flex-treble">{{ info.finish_time }}</text>
					</view>
					<view v-if="info.status == 8" class="flex align-center info-txt">
						<text class="text-666">退款时间</text>
						<text class="flex-treble">{{ info.finish_time }}</text>
					</view>
					<view v-if="info.status == 7" class="flex align-center info-txt">
						<text class="text-666">完成时间</text>
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
		<view v-if="!(info.status == 2 || info.status == 9)" class="actions-wrapper">
			<button v-if="info.status == 1" @click="canCelOrder" class="cu-btn margin-left-sm text-gray">取消订单</button>
			<button v-if="info.status == 1" @click="payNow(info.id)" class="cu-btn bg-green margin-left-sm">立即付款</button>
			<button v-if="info.status == 7 || info.status == 8 || info.status == 9" @click="delOrder" class="cu-btn line-gray margin-left-sm ">删除订单</button>
			<button v-if="info.status == 6" @click="toTakeoutOrderEvaluate" class="cu-btn bg-green margin-left-sm">立即评价</button>
			<button v-if="info.status == 3 || info.status == 4 || info.status == 5" @click="confirmReceipt" class="cu-btn bg-green margin-left-sm">确认收货</button>
		</view>

		<login-modal></login-modal>
	</view>
</template>

<script>
import common from '@/utils/mixins/common.js';
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
export default {
	mixins: [common],
	components: { uniNavBar },
	data() {
		return {
			CustomBar: this.CustomBar,
			notes: '',
			id: '',
			info: {}
		};
	},
	onLoad(option) {
		this.id = option.id;
	},
	onShow() {
		this.getData();
	},
	methods: {
		// 订单状态
		orderStatusText(status) {
			switch (status) {
				case 1:
					return '待付款';
				case 3:
					return '已接单';
				case 4:
					return '配送接单';
				case 5:
					return '配送中';
				case 6:
					return '待评价';
				case 7:
					return '已完成';
				case 8:
					return '已退款';
				case 9:
					return '已取消';
				case 10:
					return '拼团中';
				case 11:
					return '待退款';
				default:
					return '';
			}
		},
		contactService() {
			uni.makePhoneCall({
				phoneNumber: this.info.service_phone
			});
		},
		clickLeft() {
			uni.navigateBack();
		},
		toTakeoutOrderEvaluate() {
			uni.navigateTo({ url: '/pages/order/takeout-order-evaluate' });
		},
		getData() {
			this.$http.post('/api/takeout/order_takeout_detail', { order_id: this.id }).then(res => {
				if (res.code == 0) {
					this.info = res.data;
				}
			});
		},

		// 取消订单
		canCelOrder() {
			this.$http.post('/api/takeout/cancel_order_takeout', { order_id: this.info.id }).then(res => {
				if (res.code == 0) {
					this.takeoutPage = 1;
					this.getData();
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			});
		},
		// 删除订单
		delOrder() {
			this.$http.post('/api/takeout/del_order_takeout', { order_id: this.info.id }).then(res => {
				if (res.code == 0) {
					uni.navigateBack();
				}
			});
		},
		// 确认收货
		confirmReceipt() {
			this.$http.post('/api/takeout/confirm_receipt', { order_id: this.info.id }).then(res => {
				if (res.code == 0) {
					this.getData();
				}
			});
		},

		// 生活订单立即付款
		async payNow(id) {
			// #ifdef H5
			location.href = `${this.$domain}/api/takeout/pay_order_takeout?order_id=${id}`;
			// #endif
			// #ifdef MP
			uni.showLoading({ title: '提交中...', mask: true });
			let result = await this.$http.post('/api/appletspay/takeout_order_pay', { orderid: id });
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
.takeout-order-details {
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
