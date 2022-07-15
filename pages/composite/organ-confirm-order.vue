<template>
	<view>
		<uni-nav-bar
			class="navBar"
			title="确认订单"
			leftIcon="back"
			color="#333"
			:fixed="true"
			:statusBar="true"
			:shadow="false"
			@clickLeft="clickLeft"
			:border="false"
			backgroundColor="#fff"
		></uni-nav-bar>

		<view class="organconfirm-info">
			<image src="/static/second-phase/organ-confirmorder-bg.png" mode="aspectFill" class="organ-cofirmorder-bg"></image>
			<view class="baseinfo">【{{ class_name }} 】{{ class_time }}</view>
			<view class="price text-price">{{ class_price }}</view>
		</view>

		<view class="organ-form">
			<view class="form-cell">
				<view class="form-label">姓名</view>
				<input v-model="form.name" class="form-input" type="text" placeholder="请输入您的姓名" />
			</view>
			<view class="form-cell">
				<view class="form-label">电话</view>
				<input v-model="form.phone" class="form-input" type="number" :maxlength="11" placeholder="请输入手机号码" />
			</view>
			<picker @change="pickerSchool" mode="selector" :range="schoolList" range-key="school_name" class="form-picker">
				<view class="form-cell">
					<view class="form-label">所在学校</view>
					<view class="form-value">
						<view v-if="!schoolSelected" class="form-value-placeholder">请选择学校</view>
						<view v-else class="form-value-selected">{{ schoolSelected }}</view>
						<uni-icons type="arrowdown" color="#999" :size="20"></uni-icons>
					</view>
				</view>
			</picker>

			<view class="form-cell">
				<view class="form-label">报名学校</view>
				<input v-model="form.school" class="form-input" type="text" placeholder="请输入你所意向的学校名称" />
			</view>
			<view class="form-cell">
				<view class="form-label">报名专业</view>
				<input v-model="form.major" class="form-input" type="text" placeholder="请输入你所报名的专业" />
			</view>
			<navigator :url="`/pages/composite/organization-add-remark?remark=${form.note ? form.note : ''}`" class="form-cell">
				<view class="form-label">备注留言</view>
				<view class="form-value">
					<view v-if="!form.note" class="form-value-placeholder">特殊的说明</view>
					<view v-else class="text-cut ">{{ form.note }}</view>
					<uni-icons type="arrowright" color="#999" :size="20"></uni-icons>
				</view>
			</navigator>
			<view class="form-cell">
				<view class="form-label">应付金额</view>
				<view class="form-value">
					<view class="form-price text-price">{{ class_price }}</view>
				</view>
			</view>
		</view>
		<view class="form-agreement">
			<uni-icons @click="agreeChange(true)" v-if="!isAgree" type="circle" :size="16" color="#666"></uni-icons>
			<uni-icons @click="agreeChange(false)" v-else type="checkbox-filled" :size="16" color="#26D499"></uni-icons>
			<navigator :url="`/pages/composite/organization-agreement?c_id=${class_id}`">《同意尚德机构报名协议》</navigator>
		</view>
		<button @click="submitPay" class="bnt-pay" :disabled="!disabledPay">立即支付</button>
	</view>
</template>

<script>
export default {
	data() {
		return {
			isAgree: false,
			schoolList: [],
			schoolValue: [0],
			schoolSelected: '',

			class_id: '',
			class_name: '',
			class_price: '',
			class_time: '',

			form: { name: '', phone: '', school_id: '', school: '', major: '', note: '', agreement: 1 }
		};
	},
	computed: {
		disabledPay() {
			let flag = true;
			for (let k in this.form) {
				if (k != 'note' && !this.form[k]) flag = false;
			}
			return flag;
		}
	},
	onLoad(options) {
		this.class_id = options.class_id;
		this.class_name = options.class_name;
		this.class_price = options.class_price;
		this.class_time = options.class_time;
		this.getSchoolList();
		uni.$on('saveTextarea', data => {
			this.form.note = data;
		});
	},
	onUnload() {
		uni.$off('saveTextarea');
	},
	methods: {
		async getSchoolList() {
			let res = await this.$http.post('/api/school/schools_List');
			if (res.code == 0) {
				this.schoolList = res.data;
			}
		},
		async submitPay() {
			if (!/^1[3-9]\d{9}$/.test(this.form.phone)) {
				uni.showToast({ title: '手机号格式有误', icon: 'none' });
				return;
			}
			if (!this.isAgree) {
				uni.showToast({ title: '请先同意尚德机构报名协议', icon: 'none' });
				return;
			}
			uni.showLoading({
				title: '提交中...',
				mask: true
			});
			let res = await this.$http.post('/api/training/sign', { class_id: this.class_id, ...this.form }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
			if (res.code == 0) {
				// #ifdef H5
				location.href = `https://lzp.ysxapp.cn/api/training/pay?order_id=${res.data.id}`;
				// #endif
				// #ifdef MP
				let result = await this.$http.post('/api/appletspay/training_order_pay', { order_id: res.data.id });
				if (result.code == 0) {
					uni.requestPayment({
						timeStamp: result.data.timeStamp,
						nonceStr: result.data.nonceStr,
						package: result.data.package,
						signType: result.data.signType,
						paySign: result.data.paySign,
						success: response => {
							uni.redirectTo({
								url: `pages/my/education-order`
							});
						}
					});
				}
				// #endif
			}
			uni.hideLoading();
		},
		clickLeft() {
			uni.navigateBack();
		},
		agreeChange(val) {
			this.isAgree = val;
		},

		pickerSchool(e) {
			console.log(e);
			this.schoolSelected = this.schoolList[e.detail.value].school_name;
			this.form.school_id = this.schoolList[e.detail.value].id;
		}
	}
};
</script>

<style lang="scss" scoped>
.organconfirm-info {
	margin: 0 30rpx;
	height: 260rpx;
	position: relative;
	padding: 30rpx;
	display: flex;
	justify-content: space-between;
	flex-direction: column;
	color: #ffffff;
	.organ-cofirmorder-bg {
		position: absolute;
		top: 0;
		left: 0;
		width: 100%;
		height: 100%;
		z-index: -1;
	}
	.baseinfo {
		font-size: 32rpx;
	}
	.price {
		font-size: 48rpx;
	}
}

.organ-form {
	padding: 30rpx 30rpx 0 30rpx;
	.form-cell {
		display: flex;
		align-items: center;
		&.picker {
		}
		&:not(:last-child) {
			border-bottom: 2rpx solid #ebebeb;
		}

		.form-label {
			font-size: 32rpx;
			line-height: 88rpx;
		}
		.form-input {
			flex: 1;
			line-height: 88rpx;
			font-size: 28rpx;
			text-align: right;
			padding-left: 20rpx;
		}
		.input-placeholder {
			color: #999;
		}
		.form-value {
			flex: 1;
			display: flex;
			justify-content: flex-end;
			align-items: center;
			padding-left: 20rpx;
			font-size: 28rpx;
			overflow: hidden;
		}
		.form-value-placeholder {
			color: #999;
		}
		.form-price {
			font-size: 48rpx;
			color: #ff3e47;
			font-weight: bold;
		}
	}
	.form-picker {
		border-bottom: 2rpx solid #ebebeb;
	}
}

.form-agreement {
	display: flex;
	align-items: center;
	font-size: 28rpx;
	color: #26d499;
	padding: 0 30rpx;
}

.bnt-pay {
	background-color: #26d499;
	color: #ffffff;
	border-radius: 46rpx;
	margin: 20rpx 100rpx;
}

button[disabled].bnt-pay {
	background-color: #26d499;
	opacity: 0.65;
	color: #ffffff;
}
</style>
