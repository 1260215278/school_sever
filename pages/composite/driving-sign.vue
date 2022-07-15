<template>
	<view class="driving-sign">
		<uni-nav-bar title="立即报名" fixed @clickLeft="clickLeft" :statusBar="true" leftIcon="back"></uni-nav-bar>
		<view class="container padding-lr padding-tb-sm">
			<view class="bg-white flex flex-direction align-center card padding">
				<view class="price text-price text-red">{{ driving_price }}</view>
				<view class="text-xl text-bold text-black">
					<text class="text-green">C</text>
					<text style="position: relative;top:-3upx;padding: 0 15upx;">|</text>
					{{ driving_class }}
				</view>
				<view class="text-df text-999">车辆分配：{{ driving_referral }}</view>
				<view class="flex align-center text-999">
					<image src="../../static/car-icon.png" class="car-icon" mode=""></image>
					<text class="padding-lr-xs">{{ driving_name }}</text>
				</view>
			</view>
			<view class="bg-white card padding-lr text-lg">
				<view class="solid-bottom flex align-center input-wrap">
					<view class="">姓名：</view>
					<input v-model="form.name" class="flex-sub input" type="text" placeholder="请输入姓名" />
				</view>
				<view class="solid-bottom flex align-center input-wrap">
					<view class="">联系方式：</view>
					<input @input="phoneInput" v-model="form.phone" class="flex-sub input" type="number" placeholder="请输入联系方式" />
				</view>
				<view class="solid-bottom flex align-center input-wrap">
					<view class="">学校：</view>
					<input v-model="form.school" class="flex-sub input" type="text" placeholder="请输入学校名称" />
				</view>
			</view>
			<view class="padding-lr" style="padding-top: 100upx;">
				<button @click="toPay" :disabled="!disabled" type="" class="cu-btn bg-red round sign-up-btn block lg">立即报名</button>
			</view>
		</view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';

export default {
	components: { uniNavBar },
	data() {
		return {
			driving_class: '',
			driving_first: '',
			driving_price: '',
			driving_referral: '',
			id: '',
			driving_name: '',
			form: {
				name: '',
				phone: '',
				school: ''
			}
		};
	},
	computed: {
		...mapGetters(['schoolinfo']),
		disabled() {
			return !!this.form.phone.trim() && !!this.form.name.trim() && !!this.form.school.trim();
		}
	},
	onLoad(option) {
		this.driving_class = option.driving_class;
		this.driving_first = option.driving_first;
		this.driving_price = option.driving_price;
		this.driving_referral = option.driving_referral;
		this.id = option.id;
		this.driving_name = option.driving_name;
	},
	methods: {
		clickLeft() {
			uni.navigateBack();
		},
		toPay() {
			if (!/^(?:13\d|14\d|15\d|16\d|17\d|18\d|19\d)\d{5}(\d{3}|\*{3})$/.test(this.form.phone)) {
				uni.showToast({
					title: '手机号码格式有误',
					icon: 'none'
				});
				return;
			}
			this.form.cid = this.id;
			this.form.school_id = this.schoolinfo.id;
			uni.showLoading({ title: '提交中...', mask: true });
			this.$http.post('/api/driving/sign', this.form).then(async res => {
				uni.hideLoading();
				if (res.code == 0) {
					// #ifdef H5
					location.href = `${this.$domain}/api/wxpay/pay_order?order_id=${res.data.id}`;
					// #endif
					// #ifdef MP
					uni.showLoading({ title: '提交中...', mask: true });
					let result = await this.$http.post('/api/appletspay/driving_order_pay', { order_id: res.data.id });
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
									url: `/pages/composite/driving-sign-success?id=${res.data.id}&name=${this.driving_name}`
								});
							}
						});
					}
					// #endif
				}
			});
		},
		phoneInput(e) {
			let val = e.target.value;
			val = val.replace(/[^\d]/g, '');
			this.form.phone = val;
		}
	}
};
</script>

<style lang="scss">
page {
	background: #f2f2f2;
}
.driving-sign {
	/deep/.uni-navbar--border {
		border-color: transparent;
	}
	.card {
		box-shadow: 0px 0px 10px 0px rgba(152, 152, 152, 0.2);
		border-radius: 20upx;
		margin-bottom: 20upx;
		.price {
			font-size: 80upx;
		}
		.car-icon {
			width: 36upx;
			height: 36upx;
		}
		.input-wrap {
			height: 88upx;
		}
		.input {
			height: 88upx;
			line-height: 88upx;
			text-align: right;
		}
	}
	.sign-up-btn {
		box-shadow: 0px 2px 10px 0px rgba(255, 62, 71, 0.5);
	}
}
</style>
