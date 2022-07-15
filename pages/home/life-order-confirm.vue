<template>
	<view class="life-order-confirm">
		<uni-nav-bar @clickLeft="clickLeft" class="navBar" leftIcon="back" :statusBar="true" :title="title" :shadow="false"></uni-nav-bar>

		<block v-if="!isShowCoupons">
			<view class="container">
				<view class="text-white header-card">
					<image src="../../static/hotel-bg.png" class="hotel-img" mode=""></image>
					<view class="text-df text-bold">宜居大床房</view>
					<view class="padding-tb-xs">{{ start + ' - ' + end + '（共' + diff + '晚）' }}</view>
				</view>
				<!-- 预定信息 -->
				<view class="reserve-mg-wrap bg-white text-lg padding-lr">
					<view class="flex padding-tb-sm solid-bottom">
						<view class="">数量：</view>
						<view class="flex-sub justify-end flex align-center">
							<input @input="inputChange" class="text-right" type="number" v-model="form.goods_num" placeholder="请输入数量" />
						</view>
					</view>
					<view class="flex padding-tb-sm solid-bottom">
						<view class="">姓名：</view>
						<view class="flex-sub justify-end flex align-center"><input class="text-right" type="text" v-model="form.name" placeholder="请输入姓名" /></view>
					</view>
					<view class="flex padding-tb-sm solid-bottom">
						<view class="">联系电话：</view>
						<view class="flex-sub justify-end flex align-center"><input class="text-right" type="text" v-model="form.mobile" placeholder="请输入联系电话" /></view>
					</view>
					<view @click="timePicker" class="flex padding-tb-sm solid-bottom">
						<view class="">预计到达：</view>
						<view class="flex-sub justify-end flex align-center">
							<input class="text-right" type="text" v-model="form.appoint_time" disabled placeholder="请输入预计到达时间" />
						</view>
					</view>
					<view @click="selectedCoupons" class="flex padding-tb-sm">
						<view class="">优惠券：</view>
						<view class="flex-sub justify-end flex align-center">
							<text v-if="!coupon_id" class="text-999">{{ !list.length ? '无可用的优惠券' : '选择优惠券' }}</text>
							<text v-else class="">{{ couponAmount + '元优惠券' }}</text>
							<text class="cuIcon-right text-666"></text>
						</view>
					</view>
				</view>
				<!-- 预定规则 -->
				<view class="rules-explain bg-white padding-lr margin-tb">
					<view class="">预定规则</view>
					<view class="padding-top-xs">{{ reserveRule }}</view>
				</view>
			</view>

			<!-- 底部操作条 -->
			<view class="actions-wrap flex align-center">
				<view class="text-lg flex-sub padding-lr-xl flex align-center">
					<text style="align-self: baseline;">总价</text>
					<text class="text-xxl" style="align-self: baseline;">￥{{ totalAmount }}</text>
				</view>
				<button @click="toPay" class="actions-btn bg-red text-xl text-white flex justify-center align-center" :disabled="!disabled" type="">立即预定</button>
			</view>
			<!-- 时间 picker -->
			<uni-popup ref="timePickerPopup" type="bottom">
				<view v-if="visible" class="picker-container">
					<view class="picker-header flex justify-between align-center">
						<view @click="cancelPopup" class="text-999">取消</view>
						<view class="picker-title">选择到达时间</view>
						<view @click="confirmPopup" class="text-green">确定</view>
					</view>
					<picker-view :indicator-style="indicatorStyle" :value="timeValue" @change="bindChange">
						<picker-view-column>
							<view class="item time-picker-left" v-for="(item, index) in hours" :key="index">{{ item }}</view>
						</picker-view-column>
						<picker-view-column class="time-middle"><view class="time-colon">:</view></picker-view-column>
						<picker-view-column>
							<view class="item time-picker-right" v-for="(item, index) in minutes" :key="index">{{ item }}</view>
						</picker-view-column>
					</picker-view>
				</view>
			</uni-popup>
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
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import { mapGetters } from 'vuex';
import common from '@/utils/mixins/common.js';

export default {
	mixins: [common],
	components: { uniNavBar, uniPopup },
	data() {
		const roomsNums = [],
			hours = [],
			minutes = [];
		for (let i = 1; i < 11; i++) {
			roomsNums.push(i);
		}
		for (let i = 0; i < 24; i++) {
			hours.push(i);
		}
		for (let i = 0; i < 60; i++) {
			if (i < 10) {
				minutes.push('0' + i);
			} else {
				minutes.push(i);
			}
		}
		return {
			title: '境合酒店',
			visible: false, // picker view 显示隐藏
			roomsValue: [0], // 默认值
			roomsNums: roomsNums, // 房间数组
			roomsNum: '', // 选择房间数
			hours: hours, // 小时数组
			minutes: minutes, // 分钟数组
			timeValue: [9, 0, 30], // 默认值
			indicatorStyle: `height: ${Math.round(uni.getSystemInfoSync().screenWidth / (750 / 100))}px;`,
			start: '', // 入住时间
			end: '', // 离店时间
			diff: '', // 入住几晚
			goods_id: '', // 商品id
			goods_price: '', //商品价格
			store_id: '', // 店铺id
			form: {
				name: '',
				mobile: '',
				goods_num: '',
				appoint_time: '' //预计到店时间
			},
			list: [],
			coupon_id: '', // 优惠券id
			couponAmount: 0, // 优惠券金额
			isShowCoupons: false
		};
	},
	computed: {
		...mapGetters(['reserveRule']),
		disabled() {
			let flag = true;
			for (let key in this.form) {
				if (!this.form[key]) {
					flag = false;
				}
			}
			return flag;
		},
		totalAmount() {
			let goods_num = this.form.goods_num ? this.form.goods_num : 1;
			return (Number(this.goods_price) * Number(this.diff) * Number(goods_num) - Number(this.couponAmount)).toFixed(2);
		}
	},
	onLoad(option) {
		this.start = option.start;
		this.end = option.end;
		this.diff = option.diff;
		this.goods_id = option.goods_id;
		this.store_id = option.store_id;
		this.goods_price = option.goods_price;
		this.getCoupons();
	},
	methods: {
		inputChange(e) {
			let val = e.target.value;
			val = val.replace(/^0/g, '');
			val = val.replace(/[^\d]/g, ''); //清除"数字以外的字符
			this.$nextTick(() => {
				this.form.goods_num = val;
			});
		},
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
		// picker change
		bindChange() {
			const val = e.detail.value;
			this.timeValue = val;
		},

		// 选择时间
		timePicker() {
			this.$refs.timePickerPopup.open();
			this.visible = true;
		},
		confirmPopup() {
			this.visible = false;
			this.form.appoint_time = this.hours[this.timeValue[0]] + ':' + this.minutes[this.timeValue[2]];
			this.$refs.timePickerPopup.close();
		},
		cancelPopup() {
			this.visible = false;
			this.$refs.timePickerPopup.close();
		},
		toPay() {
			this.form.date_time = this.start + ',' + this.end;
			this.form.goods_id = this.goods_id;
			this.form.day = this.diff;
			if (this.coupon_id) {
				this.form.coupon_id = this.coupon_id;
			}
			uni.showLoading({ title: '提交中...', mask: true });
			this.$http.post('/api/life/appiont', this.form).then(async res => {
				uni.hideLoading();
				if (res.code == 0) {
					// #ifdef H5
					location.href = `${this.$domain}/api/life/pay_order_life?order_id=${res.data.order_id}&from=1`;
					// #endif
					// #ifdef MP
					uni.showLoading({ title: '支付中...', mask: true });
					let result = await this.$http.post('/api/appletspay/life_order_pay', { order_id: res.data.order_id });
					uni.hideLoading();
					if (result.code == 0) {
						uni.requestPayment({
							timeStamp: result.data.timeStamp,
							nonceStr: result.data.nonceStr,
							package: result.data.package,
							signType: result.data.signType,
							paySign: result.data.paySign,
							success: response => {
								uni.redirectTo({
									url: `/pages/home/life-pay-success?id=${res.data.order_id}`
								});
							}
						});
					}
					// #endif
				}
			});
		},
		getCoupons() {
			this.$http.post('/api/service/usable_coupon', { store_id: this.store_id, amount: this.goods_price }).then(res => {
				if (res.code == 0) {
					this.list = res.data;
				}
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background: #fefefe;
}
.life-order-confirm {
	.navBar {
		position: relative;
		z-index: 99;
		/deep/.uni-navbar--border {
			border-color: transparent;
		}
	}
	.container {
		padding-bottom: 100upx;
		.header-card {
			margin: 20upx 30upx;
			padding: 25upx;
			background: rgba(38, 212, 153, 1);
			box-shadow: 0px 0px 10upx 0px rgba(152, 152, 152, 0.1);
			border-radius: 20upx;
			position: relative;
			.hotel-img {
				width: 110upx;
				height: 110upx;
				position: absolute;
				bottom: 0;
				right: 16upx;
			}
		}
		.reserve-mg-wrap {
			box-shadow: 0px 0px 10upx 0px rgba(152, 152, 152, 0.1);
			border-radius: 20upx;
			margin: 0 30upx;
		}
	}
	// actions
	.actions-wrap {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		height: 100upx;
		background: #ffffff;
		box-shadow: 0px 0px 10upx 0px rgba(235, 235, 235, 0.59);
		.actions-btn {
			flex: 0 0 215upx;
			height: 100upx;
			border-radius: 0;
			&::after {
				border: 0;
			}
		}
	}
	.picker-container {
		// position: fixed;
		// left: 0;
		// right: 0;
		// bottom: 0;
		background: #ffffff;
		border-radius: 30upx 30upx 0px 0px;
		.picker-header {
			padding: 30upx;
			border-bottom: 2upx solid #ebebeb;
			font-size: 28upx;
			.picker-title {
				font-size: 32upx;
			}
		}
		picker-view {
			width: 100%;
			height: 600upx;
			margin-top: 20upx;
		}
		.time-middle {
			flex: 0 0 80upx;
			.time-colon {
				display: flex;
				justify-content: center;
				align-items: center;
			}
		}
		.item {
			line-height: 100upx;
			text-align: center;
			&.time-picker-left {
				text-align: right;
			}

			&.time-picker-right {
				text-align: left;
			}
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
