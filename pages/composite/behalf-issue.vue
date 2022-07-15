<template>
	<view class="componsite-behalf-issue">
		<uni-nav-bar title="帮取快递" leftIcon="back" fixed :statusBar="true" @clickLeft="clickLeft"></uni-nav-bar>
		<view class="container">
			<view class=""><image src="../../static/behalf-banner.png" class="behalf-banner" mode=""></image></view>
			<view @click="toSelectedAddress" class="card padding-lr padding-tb-sm margin-lr">
				<view v-if="defaultAddress" class="flex align-center">
					<view class="flex-sub padding-right-xl">
						<view class="text-xl text-bold">{{ defaultAddress.site }}</view>
						<view class="text-df padding-top-sm">
							{{ defaultAddress.name }}
							<text class="padding-lr">{{ defaultAddress.phone }}</text>
						</view>
					</view>
					<view class="text-xl"><text class="cuIcon-right text-999"></text></view>
				</view>
				<view v-if="!defaultAddress" class="flex justify-between align-center text-lg text-666">
					<view class="flex-sub">
						<text class="cuIcon-locationfill" style="vertical-align: middle;"></text>
						<text class="padding-lr-sm">请添加收货地址</text>
					</view>
					<view class="text-xl"><text class="cuIcon-right text-999"></text></view>
				</view>
			</view>
			<view class="card margin-lr padding-top-xs padding-lr">
				<view @click="toExpressPicker" class="padding-tb-sm text-999 text-lg flex align-center solid-bottom">
					<view class="">快递名称：</view>
					<view class="flex-sub flex align-center">
						<input
							v-model="form.express_name"
							disabled
							class="flex-sub text-black"
							type="text"
							placeholder="请选择"
							style="text-align: right; padding-left: 10upx;padding-right:10upx"
						/>
						<text class="cuIcon-right"></text>
					</view>
				</view>
				<view class="flex text-lg text-999 padding-tb-sm align-start solid-bottom">
					<view class="flex align-center margin-right-xl">
						快递大小：
						<image src="../../static/question-icon.png" class="question-icon" mode=""></image>
					</view>
					<view class="flex-sub flex flex-direction">
						<view
							@click="selectedSize(item.id, item.tracking_price, item.tracking_name)"
							v-for="(item, index) in expressSize"
							:key="index"
							class=" flex align-center margin-bottom-xs"
						>
							<image v-if="item.id != sizeId" src="../../static/radio-select.png" class="radio-select" mode=""></image>
							<image v-if="item.id == sizeId" src="../../static/radio-selected.png" class="radio-selected" mode=""></image>
							<text class="padding-lr-sm">{{ item.tracking_name }}</text>
						</view>
					</view>
				</view>
				<view @click="toTimeBucketPicker" class="padding-tb-sm text-999 text-lg flex align-center solid-bottom">
					<view class="">期望送达时间：</view>
					<view class="flex-sub flex align-center">
						<input
							v-model="timeBucket"
							class="flex-sub text-black"
							disabled
							type="text"
							placeholder="请选择时间"
							style="text-align: right; padding-left: 10upx;padding-right:10upx"
						/>
						<text class="cuIcon-right"></text>
					</view>
				</view>
				<view class="padding-tb-sm text-999 text-lg flex align-center solid-bottom">
					<view class="">取快递方法：</view>
					<view class="flex-sub flex align-center">
						<input v-model="form.mode" class="flex-sub" type="text" placeholder="如：取件码" style="text-align: right; padding-left: 10upx;padding-right:10upx" />
					</view>
				</view>
				<view class="padding-tb-sm text-999 text-lg flex align-center solid-bottom">
					<view class="">快递位置：</view>
					<view class="flex-sub flex align-center">
						<input v-model="form.seat" class="flex-sub" type="text" placeholder="请输入快递位置" style="text-align: right; padding-left: 10upx;padding-right:10upx" />
					</view>
				</view>
				<view class="padding-tb-sm">
					<view class="text-lg text-999 flex justify-end align-center">
						<text>小计：</text>
						<text class="text-red text-bold">¥{{ !!form.price ? form.price : 0 }}</text>
					</view>
					<view class="padding-top-xs">
						<text class="text-green">温馨提示：</text>
						<text class="text-999">{{ tip }}</text>
					</view>
				</view>
			</view>
			<view class="card margin-lr padding-lr"><textarea @blur="inputBlur" v-model="form.remark" class="textarea" placeholder="备注描述~" /></view>
			<view class="margin padding-xl"><button @click="issueSubmit" :disabled="!disabled" type="" class="cu-btn bg-green round lg block issue-btn">发布</button></view>
		</view>
		<!-- 选择快递 -->
		<uni-popup ref="expressPickerPopup" type="bottom">
			<view v-if="visible" class="picker-container">
				<view class="picker-header flex justify-between align-center">
					<view @click="cancelPopup(0)" class="text-999">取消</view>
					<view class="picker-title">选择快递</view>
					<view @click="confirmPopup(0)" class="text-green">确定</view>
				</view>
				<picker-view :indicator-style="indicatorStyle" :value="expressValue" @change="bindChange($event, 0)">
					<picker-view-column>
						<view class="item" :class="index == expressValue[0] ? 'active' : ''" v-for="(item, index) in expressList" :key="index">{{ item.express_name }}</view>
					</picker-view-column>
				</picker-view>
			</view>
		</uni-popup>
		<!-- 选择时间段 -->
		<uni-popup ref="timeBucketPickerPopup" type="bottom">
			<view v-if="visible" class="picker-container">
				<view class="picker-header flex justify-between align-center">
					<view @click="cancelPopup(1)" class="text-999">取消</view>
					<view class="picker-title">选择期望送达时间</view>
					<view @click="confirmPopup(1)" class="text-green">确定</view>
				</view>
				<picker-view :indicator-style="indicatorStyle" :value="timeBucketValue" @change="bindChange($event, 1)">
					<picker-view-column>
						<view class="item" :class="index == timeBucketValue[0] ? 'active' : ''" v-for="(item, index) in days" :key="index">{{ item }}</view>
					</picker-view-column>
					<picker-view-column>
						<view class="item" :class="index == timeBucketValue[1] ? 'active' : ''" v-for="(item, index) in timeBucketList" :key="index">{{ item }}</view>
					</picker-view-column>
				</picker-view>
			</view>
		</uni-popup>

		<login-modal></login-modal>
	</view>
</template>

<script>
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import { mapGetters } from 'vuex';
import common from '@/utils/mixins/common.js';

export default {
	components: { uniNavBar, uniPopup },
	mixins: [common],
	data() {
		const data = new Date();
		let dateList = [];
		let startDate = new Date();
		let endDate = new Date();
		let currentMonth = startDate.getMonth() + 1;
		endDate.setDate(startDate.getDate() + 30);
		while (endDate.getTime() - startDate.getTime() >= 0) {
			let month = (startDate.getMonth() + 1).toString().length === 1 ? '0' + (startDate.getMonth() + 1).toString() : startDate.getMonth() + 1;
			let day = startDate.getDate().toString().length === 1 ? '0' + startDate.getDate() : startDate.getDate();
			if (startDate.getMonth() + 1 == currentMonth) {
				dateList.push(month + '-' + day);
			} else {
				dateList.push(startDate.getFullYear() + '-' + month + '-' + day);
			}
			startDate.setDate(startDate.getDate() + 1);
		}
		dateList[0] = `今天(${dateList[0]})`;
		return {
			visible: false, // picker view 显示隐藏
			expressList: [],
			expressSize: [],
			sizeId: '', // 快递大小类型id
			expressValue: [0], // 默认值
			defaultAddress: {},
			days: dateList,
			timeBucketList: ['10:00~12:00', '12:00~14:00', '14:00~16:00', '16:00~18:00', '18:00~20:00', '20:00~22:00'],
			timeBucketValue: [0, 0], // 默认值
			timeBucket: '',
			indicatorStyle: `height: ${Math.round(uni.getSystemInfoSync().screenWidth / (750 / 100))}px;`,
			tip: '', // 温馨提示
			form: {
				aid: '', // 地址id
				express_name: '', // 快递名称（德邦快递）
				express_tracking: '', //快递大小（小件/1kg内）
				reach_d: '', // 日期（今天(12-25)）
				reach_time: '', //12:00~15:00
				mode: '', // 取快递方法
				seat: '', // 快递位置
				price: '', // 价格
				remark: '' // 备注
			},
			scrollTopPX: '' //滚动的位置
		};
	},
	computed: {
		...mapGetters(['token', 'schoolinfo']),
		disabled() {
			let flag = true;
			for (let key in this.form) {
				if (!this.form[key]) {
					flag = false;
				}
			}
			return flag;
		}
	},
	watch: {
		defaultAddress() {
			if (this.defaultAddress) {
				this.form.aid = this.defaultAddress.id;
			} else {
				this.form.aid = '';
			}
		}
	},
	onLoad() {
		this.getExpressList();
		this.getExpressSize();
		this.getDefaultAddress();
		this.getTip();
	},
	//监听滚动条滚动的距离
	onPageScroll(res) {
		this.scrollTopPX = res.scrollTop;
	},
	methods: {
		inputBlur() {
			uni.pageScrollTo({
				scrollTop: this.scrollTopPX,
				duration: 0
			});
		},
		clickLeft() {
			uni.navigateBack();
		},
		toSelectedAddress() {
			uni.navigateTo({
				url: '/pages/my/address?from=behalf'
			});
		},
		// 温馨提示
		getTip() {
			this.$http.post('/api/personal/prompt').then(res => {
				if (res.code == 0) {
					this.tip = res.data;
				}
			});
		},
		// 快递公司
		getExpressList() {
			this.$http.post('/api/personal/express_delivery').then(res => {
				if (res.code == 0) {
					this.expressList = res.data;
				}
			});
		},
		// 快递大小
		getExpressSize() {
			this.$http.post('/api/personal/tracking').then(res => {
				if (res.code == 0) {
					this.expressSize = res.data;
				}
			});
		},
		getDefaultAddress() {
			this.$http.post('/api/personal/express_address', { school_id: this.schoolinfo.id }).then(res => {
				if (res.code == 0) {
					this.defaultAddress = res.data;
				}
			});
		},
		selectedSize(id, price, name) {
			this.sizeId = id;
			this.form.price = price;
			this.form.express_tracking = name;
		},
		// picker change
		bindChange(e, val) {
			if (val === 0) {
				const val = e.detail.value;
				this.expressValue = val;
			} else if (val === 1) {
				const val = e.detail.value;
				this.timeBucketValue = val;
			}
		},
		// 选择快递
		toExpressPicker() {
			this.$refs.expressPickerPopup.open();
			this.visible = true;
		},
		// 选择时间段
		toTimeBucketPicker() {
			this.$refs.timeBucketPickerPopup.open();
			this.visible = true;
		},
		confirmPopup(val) {
			this.visible = false;
			if (val === 1) {
				this.timeBucket = this.days[this.timeBucketValue[0]] + ' ' + this.timeBucketList[this.timeBucketValue[1]];
				this.form.reach_d = this.days[this.timeBucketValue[0]];
				this.form.reach_time = this.timeBucketList[this.timeBucketValue[1]];
				this.$refs.timeBucketPickerPopup.close();
			} else {
				this.form.express_name = this.expressList[this.expressValue[0]].express_name;
				this.$refs.expressPickerPopup.close();
			}
		},
		cancelPopup(val) {
			this.visible = false;
			if (val === 1) {
				this.$refs.timeBucketPickerPopup.close();
			} else {
				this.$refs.expressPickerPopup.close();
			}
		},
		issueSubmit() {
			this.form.school_id = this.schoolinfo.id;
			uni.showLoading({ title: '提交中...', mask: true });
			this.$http.post('/api/express/help_express', this.form).then(async res => {
				uni.hideLoading();
				if (res.code == 0) {
					// #ifdef H5
					location.href = `${this.$domain}/api/wxpays/pay_order_wxpay?order_id=${res.data}`;
					// #endif
					// #ifdef MP
					uni.showLoading({ title: '支付中...', mask: true });
					let result = await this.$http.post('/api/appletspay/express_order_pay', { order_id: res.data });
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
									url: `/pages/composite/behalf-issue-success??id=${res.data}`
								});
							}
						});
					}
					// #endif
				}
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background: #f2f2f2;
}
.componsite-behalf-issue {
	/deep/.uni-navbar--border {
		border-color: transparent;
	}
	.container {
		.behalf-banner {
			width: 100%;
			height: 200upx;
		}
		.card {
			box-shadow: 0px 0px 10px 0px rgba(152, 152, 152, 0.1);
			border-radius: 20upx;
			margin-top: 20upx;
			background: #ffffff;
		}
		.cuIcon-right {
			font-size: 35upx;
		}
		.question-icon {
			width: 34upx;
			height: 34upx;
		}
		.radio-select,
		.radio-selected {
			width: 36upx;
			height: 36upx;
		}
		.textarea {
			width: 100%;
			height: 200upx;
			padding: 30upx 0;
		}
		.issue-btn {
			box-shadow: 0px 2px 10px 0px rgba(38, 212, 153, 0.5);
		}
	}
	.picker-container {
		background: #ffffff;
		border-radius: 20upx 20upx 0px 0px;
		.picker-header {
			padding: 30upx;
			border-bottom: 2upx solid #ebebeb;
			font-size: 30upx;
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
			&.active {
				color: #26d499;
				font-weight: bold;
			}
		}
	}
}
</style>
