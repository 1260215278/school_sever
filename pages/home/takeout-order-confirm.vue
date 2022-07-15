<template>
	<view class="takeout-order-confirm">
		<uni-nav-bar fixed statusBar leftIcon="back" :title="title" @clickLeft="clickLeft"></uni-nav-bar>
		<view class="delivery-ways">
			<view @click="deliveryChange(item.value)" v-for="(item, index) in deliveryWays" :key="index" :class="['delivery-way', { active: deliveryValue == item.value }]">
				{{ item.title }}
			</view>
		</view>

		<block v-if="!isShowCoupons">
			<view class="container padding-lr padding-tb-sm">
				<!-- 地址 -->
				<view class="card padding-tb-sm margin-bottom-sm padding-lr address-bg">
					<image v-if="deliveryValue == 1" src="/static/second-phase/address-bg.png" mode="aspectFill" class="address-bg-img"></image>
					<view @click="toSelectedAddress" v-if="deliveryValue == 0 && defaultAddress" class="flex align-center address-value">
						<view class="flex-sub padding-right-xl">
							<view class="text-xl text-bold">{{ defaultAddress.site }}</view>
							<view class="text-df padding-top-sm">
								{{ defaultAddress.name }}
								<text class="padding-lr">{{ defaultAddress.phone }}</text>
							</view>
						</view>
						<view class="text-xl"><text class="cuIcon-right text-999"></text></view>
					</view>
					<block v-if="deliveryValue == 1">
						<view v-if="groupinfo && groupinfo.store_info" class="flex align-center address-value">
							<view class="flex-sub padding-right-xl">
								<view class="text-xl text-bold">{{ groupinfo.store_info.store_address }}</view>
								<view class="text-df padding-top-sm">
									{{ groupinfo.store_info.boss_name }}
									<text class="padding-lr">{{ groupinfo.store_info.service_phone }}</text>
								</view>
							</view>
							<view class="distance-wrap">
								<!-- <view class="distance-txt">距你1km</view> -->
								<view class="distance-img-wrap">
									<image src="/static/second-phase/distance-img.png" class="distance-img"></image>
									<image :src="groupinfo.store_info.store_avatar" mode="aspectFill" class="distance-avatar"></image>
								</view>
							</view>
						</view>
						<view v-if="cart_id" class="flex align-center address-value">
							<view class="flex-sub padding-right-xl">
								<view class="text-xl text-bold">{{ cartinfo.store_info.store_address }}</view>
								<view class="text-df padding-top-sm">
									{{ cartinfo.store_info.boss_name }}
									<text class="padding-lr">{{ cartinfo.store_info.service_phone }}</text>
								</view>
							</view>
							<view class="distance-wrap">
								<view class="distance-img-wrap">
									<image src="/static/second-phase/distance-img.png" class="distance-img"></image>
									<image :src="cartinfo.store_info.store_avatar" mode="aspectFill" class="distance-avatar"></image>
								</view>
							</view>
						</view>
					</block>
					<view @click="toSelectedAddress" v-if="deliveryValue == 0 && !defaultAddress" class="flex justify-between align-center text-lg text-666 address-no">
						<view class="flex-sub">
							<text class="cuIcon-locationfill" style="vertical-align: middle;"></text>
							<text class="padding-lr-sm">请添加收货地址</text>
						</view>
						<view class="text-xl"><text class="cuIcon-right text-999"></text></view>
					</view>
				</view>

				<block v-if="deliveryValue == 1">
					<view class="card padding-tb-sm margin-bottom-sm padding-lr address-bg">
						<view @click="toSelectedAddress" v-if="defaultAddress" class="flex align-center address-value">
							<view class="flex-sub padding-right-xl">
								<view class="text-xl text-bold">{{ defaultAddress.site }}</view>
								<view class="text-df padding-top-sm">
									{{ defaultAddress.name }}
									<text class="padding-lr">{{ defaultAddress.phone }}</text>
								</view>
							</view>
							<view class="text-xl"><text class="cuIcon-right text-999"></text></view>
						</view>
						<view @click="toSelectedAddress" v-if="!defaultAddress" class="flex justify-between align-center text-lg text-666 address-no">
							<view class="flex-sub">
								<text class="cuIcon-locationfill" style="vertical-align: middle;"></text>
								<text class="padding-lr-sm">请添加收货地址</text>
							</view>
							<view class="text-xl"><text class="cuIcon-right text-999"></text></view>
						</view>
					</view>
				</block>

				<!-- 菜品信息-->
				<view class="item">
					<view class="text-lg text-green padding-tb-sm">
						<text class="cuIcon-titles text-lg"><text class="text-black">菜品信息</text></text>
					</view>
					<block v-if="cart_id">
						<view class="list">
							<view v-for="(item, index) in cartinfo.goods" :key="index" class="list-item flex justify-between">
								<image :src="item.goods_img_path" class="order-confirm-img" mode="aspectFill"></image>
								<view class="flex-sub overflow flex flex-direction justify-between text-df">
									<view class="text-cut">{{ item.goods_name }}</view>
									<view class="flex justify-between align-center">
										<text class="text-price text-xl text-red text-bold">{{ item.goods_price }}</text>
										<text>x{{ item.num }}</text>
									</view>
								</view>
							</view>
						</view>
						<view v-if="deliveryValue == 0" class="flex justify-between align-center text-lg padding-tb solid-top">
							<view class="text-666">配送费</view>
							<view class="">{{ cartinfo.delive_fee }}元</view>
						</view>
						<view class="flex justify-between align-center text-lg padding-tb solid-top">
							<view class="text-666">包装费</view>
							<view class="">{{ cartinfo.pack_fee }}元</view>
						</view>
					</block>
					<block v-if="groupinfo">
						<view class="list">
							<view class="list-item flex justify-between">
								<image :src="groupinfo.goods_img" class="order-confirm-img" mode="aspectFill"></image>
								<view class="flex-sub overflow flex flex-direction justify-between text-df">
									<view class="text-cut">{{ groupinfo.goods_name }}</view>
									<view class="flex justify-between align-center">
										<text class="text-price text-xl text-red text-bold">{{ groupinfo.goods_amount }}</text>
										<text>x1</text>
									</view>
								</view>
							</view>
						</view>
						<view v-if="deliveryValue == 0" class="flex justify-between align-center text-lg padding-tb solid-top">
							<view class="text-666">配送费</view>
							<view class="">{{ groupinfo.deliver_fee }}元</view>
						</view>
						<view class="flex justify-between align-center text-lg padding-tb solid-top">
							<view class="text-666">包装费</view>
							<view class="">{{ groupinfo.pack_fee }}元</view>
						</view>
					</block>
					<view @click="selectedCoupons" class="flex justify-between align-center text-lg padding-tb solid-top">
						<view class="text-666">优惠券</view>
						<view class="">
							<text v-if="!coupon_id" class="text-999">{{ !list.length ? '无可用的优惠券' : '选择优惠券' }}</text>
							<text v-else class="">{{ couponAmount + '元优惠券' }}</text>
							<text class="cuIcon-right text-666"></text>
						</view>
					</view>
					<view class="flex justify-end text-lg text-red solid-top padding-tb">总计：￥{{ totalPrice }}</view>
				</view>
				<!-- 备注描述 -->
				<view class="textarea-wrapper"><textarea class="notes-textarea" v-model="notes" placeholder="备注描述" /></view>
			</view>
			<!-- 立即支付 操作条 -->
			<view class="flex justify-between actions-bar">
				<view class="flex-sub flex align-center padding-lr text-df">
					<text class="txt">总价</text>
					<text class="text-xxl">￥{{ totalPrice }}</text>
				</view>
				<button @click="immediatePay" class="actions-btn flex align-center justify-center bg-red" :disabled="!disabled" type="">立即支付</button>
			</view>
		</block>
		<block v-if="isShowCoupons">
			<view class="coupons-wrap">
				<!-- 列表 -->
				<view class="list padding-lr padding-tb-xs">
					<view v-for="(item, index) in list" :key="index" class="list-item margin-tb-xs text-white">
						<image class="coupons-bg" src="../../static/coupons-bg.png" mode="aspectFill"></image>
						<view class="coupons-left flex flex-direction align-center">
							<text class="discout-amout text-bold">¥{{ item.discount }}</text>
							<view v-if="item.type == 1" class="reach-condition">满{{ item.condition }}可用</view>
							<view v-if="item.type == 2" class="reach-condition">无门槛</view>
							<view v-if="item.type == 3" class="reach-condition">首单优惠</view>
						</view>
						<view class="coupons-right flex flex-direction justify-between padding-tb-sm">
							<view class="flex align-center text-lg">
								<image class="store-icon" src="../../static/store-icon.png" mode=""></image>
								<text class="flex-sub padding-lr-sm text-cut">{{ item.store_name }}</text>
							</view>
							<view class="text-xs">有效期：{{ item.start_time + '~' + item.due_time }}</view>
							<block>
								<button @click="useCoupons(item, index)" v-if="!item.selected" class="coupons-receive cu-btn round sm bg-white text-orange">立即使用</button>
								<button v-if="item.selected" class="coupons-receive cu-btn round sm bg-white bg-orange">已选择</button>
							</block>
						</view>
					</view>
				</view>
			</view>
		</block>
		<login-modal></login-modal>
	</view>
</template>

<script>
import common from '@/utils/mixins/common.js';
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
import { mapGetters } from 'vuex';
export default {
	mixins: [common],
	components: { uniNavBar },
	data() {
		return {
			title: '订单确认',
			notes: '',
			cart_id: '', // 购物车id
			store_id: '', // 店铺id
			cartinfo: {},
			defaultAddress: {},
			isShowCoupons: false,
			list: [], // 优惠券列表
			remark: '', // 备注
			coupon_id: '', // 优惠券id
			couponAmount: 0, // 优惠券金额

			deliveryWays: [{ title: '外卖配送', value: '0' }, { title: '到店自取', value: '1' }],
			deliveryValue: 0,

			// 拼团信息
			sku_id: '',
			goods_id: '',
			groupbuy_id: '', // 拼团id
			groupinfo: ''
		};
	},
	computed: {
		...mapGetters(['schoolinfo']),
		disabled() {
			if (this.cart_id) {
				return !!this.defaultAddress && !!this.cart_id;
			} else {
				return !!this.defaultAddress && !!this.goods_id && !!this.sku_id;
			}
		},
		totalPrice() {
			// 总金额
			if (this.cartinfo.goods_amount) {
				let total = 0;
				if (this.deliveryValue == 0) {
					total = Number(this.cartinfo.goods_amount) + Number(this.cartinfo.delive_fee) + Number(this.cartinfo.pack_fee) - Number(this.couponAmount);
				} else {
					total = Number(this.cartinfo.goods_amount) + Number(this.cartinfo.pack_fee) - Number(this.couponAmount);
				}
				return total.toFixed(2);
			}
			if (this.groupinfo) {
				let total = 0;
				if (this.deliveryValue == 0) {
					total = Number(this.groupinfo.goods_amount) + Number(this.groupinfo.deliver_fee) + Number(this.groupinfo.pack_fee) - Number(this.couponAmount);
				} else {
					total = Number(this.groupinfo.goods_amount) + Number(this.groupinfo.pack_fee) - Number(this.couponAmount);
				}
				return total.toFixed(2);
			} else {
				return '';
			}
		}
	},
	onLoad(option) {
		if (option.cart_id && option.store_id) {
			this.cart_id = option.cart_id;
			this.store_id = option.store_id;
			this.getCartList();
		}
		if (option.goods_id && option.sku_id) {
			this.goods_id = option.goods_id;
			this.sku_id = option.sku_id;
			this.groupbuy_id = option.groupbuy_id;
			this.getGroupinfo();
		}

		this.getDefaultAddress();
	},
	methods: {
		selectedCoupons() {
			if (this.list.length) {
				this.title = '优惠券';
				this.isShowCoupons = true;
			}
		},
		useCoupons(item, index) {
			let list = this.list.map((em, i) => {
				if (i == index) {
					em.selected = true;
				} else {
					em.selected = false;
				}
				return em;
			});
			this.list = list;
			this.coupon_id = item.id;
			this.couponAmount = item.discount;
			this.isShowCoupons = false;
		},
		clickLeft() {
			if (!this.isShowCoupons) {
				uni.navigateBack();
			} else {
				this.isShowCoupons = false;
			}
		},
		toSelectedAddress() {
			uni.navigateTo({
				url: '/pages/my/address?from=behalf'
			});
		},
		getDefaultAddress() {
			this.$http.post('/api/personal/express_address', { school_id: this.schoolinfo.id }).then(res => {
				if (res.code == 0) {
					this.defaultAddress = res.data;
				}
			});
		},
		getCartList() {
			this.$http.post('/api/takeout/shopcar_detail', { store_id: this.store_id }).then(res => {
				if (res.code == 0) {
					this.cartinfo = res.data;
					this.getCoupons();
				}
			});
		},
		getCoupons() {
			this.$http.post('/api/service/usable_coupon', { store_id: this.store_id, amount: this.cartinfo.goods_amount }).then(res => {
				if (res.code == 0) {
					this.list = res.data;
				}
			});
		},
		async immediatePay() {
			if (this.cart_id && this.store_id) {
				this.$http
					.post('/api/takeout/create_takeout_order', {
						cart_id: this.cart_id,
						address_id: this.defaultAddress.id,
						coupon_id: this.coupon_id,
						remark: this.remark,
						pick_self: this.deliveryValue
					})
					.then(async res => {
						if (res.code == 0) {
							// #ifdef H5
							location.href = `${this.$domain}/api/takeout/pay_order_takeout?order_id=${res.data.order_id}&from=1`;
							// #endif
							// #ifdef MP
							uni.showLoading({ title: '提交中...', mask: true });
							let result = await this.$http.post('/api/appletspay/takeout_order_pay', { orderid: res.data.order_id });
							uni.hideLoading();
							if (result.code == 0) {
								console.log(result);
								uni.requestPayment({
									timeStamp: result.data.timeStamp,
									nonceStr: result.data.nonceStr,
									package: result.data.package,
									signType: result.data.signType,
									paySign: result.data.paySign,
									success: response => {
										uni.redirectTo({
											url: `/pages/home/takeout-pay-success?id=${res.data.order_id}&store_id=${this.store_id}`
										});
									}
								});
							}
							// #endif
						}
					});
			} else if (this.goods_id && this.sku_id && !this.groupbuy_id) {
				uni.showLoading({ title: '提交中...', mask: true });
				let result = await this.$http.post('/api/takeout/create_groupbuy_order', {
					goods_id: this.goods_id,
					sku_id: this.sku_id,
					address_id: this.defaultAddress.id,
					coupon_id: this.coupon_id,
					remark: this.remark,
					pick_self: this.deliveryValue
				});
				uni.hideLoading();
				if (result.code == 0) {
					// #ifdef H5
					location.href = `${this.$domain}/api/takeout/pay_order_takeout?order_id=${result.data.order_id}&from=1`;
					// #endif
					// #ifdef MP
					let re = await this.$http.post('/api/appletspay/takeout_order_pay', { orderid: result.data.order_id });
					if (re.code == 0) {
						uni.requestPayment({
							timeStamp: re.data.timeStamp,
							nonceStr: re.data.nonceStr,
							package: re.data.package,
							signType: re.data.signType,
							paySign: re.data.paySign,
							success: response => {
								uni.redirectTo({
									url: `/pages/home/takeout-pay-success?id=${result.data.order_id}&store_id=${this.store_id}`
								});
							}
						});
					}
					// #endif
				}
			} else if (this.goods_id && this.sku_id && this.groupbuy_id) {
				uni.showLoading({ title: '提交中...', mask: true });
				let re = await this.$http.post('/api/takeout/join_groupbuy', {
					groupbuy_id: this.groupbuy_id,
					sku_id: this.sku_id,
					address_id: this.defaultAddress.id,
					coupon_id: this.coupon_id,
					remark: this.remark,
					pick_self: this.deliveryValue
				});
				uni.hideLoading();
				if (re.code == 0) {
					// #ifdef H5
					location.href = `${this.$domain}/api/takeout/pay_order_takeout?order_id=${re.data.order_id}&from=1`;
					// #endif
					// #ifdef MP
					let result = await this.$http.post('/api/appletspay/takeout_order_pay', { orderid: re.data.order_id });
					if (result.code == 0) {
						uni.requestPayment({
							timeStamp: result.data.timeStamp,
							nonceStr: result.data.nonceStr,
							package: result.data.package,
							signType: result.data.signType,
							paySign: result.data.paySign,
							success: response => {
								uni.redirectTo({
									url: `/pages/home/takeout-pay-success?id=${re.data.order_id}&store_id=${this.store_id}`
								});
							}
						});
					}
					// #endif
				} else {
					uni.showToast({ title: re.msg, icon: 'none' });
				}
			}
		},

		deliveryChange(value) {
			this.deliveryValue = value;
		},
		// 拼团信息
		async getGroupinfo() {
			let res = await this.$http.post('/api/takeout/groupbuy_order_pre', { goods_id: this.goods_id, sku_id: this.sku_id, store_id: this.store_id });
			if (res.code == 1) {
				this.groupinfo = res.data;
			}
		}
	}
};
</script>

<style lang="scss">
.delivery-ways {
	width: 320rpx;
	height: 60rpx;
	background-color: #26d499;
	border-radius: 30rpx;
	display: flex;
	align-items: center;
	margin: 30rpx 0 10rpx 30rpx;
	.delivery-way {
		flex: 1;
		font-size: 30rpx;
		text-align: center;
		line-height: 60rpx;
		color: #ffffff;
		&.active {
			background-color: #ffffff;
			border-radius: 30rpx;
			color: #26d499;
			font-weight: bold;
		}
	}
}

.distance-wrap {
	display: flex;
	flex-direction: column;
	align-items: center;
	.distance-txt {
		font-size: 18rpx;
		height: 32rpx;
		line-height: 32rpx;
		border-radius: 16rpx;
		background-color: #fff;
		padding: 0 10rpx;
		margin-bottom: 15rpx;
		box-sizing: border-box;
	}
	.distance-img-wrap {
		position: relative;
		.distance-img {
			width: 58rpx;
			height: 69rpx;
		}
		.distance-avatar {
			position: absolute;
			top: 6rpx;
			left: 4rpx;
			width: 50rpx;
			height: 44rpx;
			border-radius: 8rpx;
		}
	}
}
.address-bg {
	position: relative;
	.address-bg-img {
		position: absolute;
		left: 0;
		top: 0;
		bottom: 0;
		right: 0;
		width: 100%;
		height: 100%;
	}
	.address-value,
	.address-no {
		position: relative;
	}
}
/deep/.uni-navbar--border {
	border: 0;
}
.takeout-order-confirm {
	background: #f5f5f5;
	.container {
		padding-bottom: 120upx;
		.card {
			box-shadow: 0px 0px 10px 0px rgba(152, 152, 152, 0.1);
			border-radius: 20upx;
			background: #ffffff;
		}
		.item {
			box-shadow: 0px 0px 10upx 0px rgba(152, 152, 152, 0.1);
			border-radius: 20upx;
			padding-left: 30upx;
			padding-right: 30upx;
			margin-bottom: 20upx;
			background: #ffffff;
			.order-confirm-img {
				width: 120upx;
				height: 120upx;
				border-radius: 12upx;
				margin-right: 20upx;
			}
			.list-item {
				padding-bottom: 30upx;
			}
		}
		.textarea-wrapper {
			width: 100%;
			height: 200upx;
			background: #ffffff;
			box-shadow: 0px 0px 10upx 0px rgba(152, 152, 152, 0.1);
			border-radius: 20upx;
			padding: 30upx;
			.notes-textarea {
				width: 100%;
				height: 200upx;
			}
		}
	}
	.actions-bar {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		height: 100upx;
		background: #ffffff;
		.actions-btn {
			flex: 0 0 215upx;
			font-size: 36upx;
			border-radius: 0;
			&::after {
				border: 0;
			}
		}
		.txt {
			position: relative;
			top: 5upx;
		}
	}

	// 可使用优惠券
	.coupons-wrap {
		.list {
			.list-item {
				position: relative;
				.coupons-bg {
					width: 100%;
					height: 180upx;
				}
				.coupons-left {
					position: absolute;
					top: 50%;
					left: 40upx;
					transform: translateY(-50%);
					.discout-amout {
						font-size: 56upx;
					}
				}
				.coupons-right {
					position: absolute;
					left: 214upx;
					right: 0;
					top: 0;
					bottom: 0;
					.store-icon {
						width: 36upx;
						height: 36upx;
					}
					.coupons-receive {
						width: 150upx;
						font-size: 24upx;
					}
				}
			}
		}
	}
}
</style>
