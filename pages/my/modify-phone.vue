<template>
	<view class="modify-phone">
		<cu-custom isBack bgColor="bg-white text-black"><block slot="content">修改手机号</block></cu-custom>
		<view class="container padding-lr">
			<view class="cell flex align-center">
				<image src="../../static/icon-phone.png" class="icon-phone" mode=""></image>
				<input v-model="form.phone" @input="phoneInput" class="flex-sub" type="number" :maxlength="11" placeholder="请输入新手机号码" />
			</view>
			<view class="cell flex align-center">
				<image src="../../static/icon-verfity.png" class="icon-verfity" mode=""></image>
				<input v-model="form.code" class="flex-sub" type="text" placeholder="请输入验证码" />
				<button @click="getCode" :disabled="counting" class="cu-btn line-green text-green margin-lr-sm sm getcode">{{ counting ? time + 's' : '获取验证码' }}</button>
			</view>
			<view class="submit-wrap margin padding-xl"><button @click="submit" :disabled="!disabled" type="" class="cu-btn bg-green lg round block submit">提交</button></view>
		</view>

		<login-modal></login-modal>
	</view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import common from '@/utils/mixins/common.js';

export default {
	mixins: [common],
	computed: {
		...mapGetters(['token']),
		disabled() {
			return !!this.form.phone.trim() && !!this.form.code.trim();
		}
	},
	data() {
		return {
			form: {
				phone: '',
				code: ''
			},
			counting: false,
			time: 60,
			timer: null
		};
	},
	methods: {
		...mapActions(['setUserinfo']),
		phoneInput(e) {
			let val = e.target.value;
			val = val.replace(/[^\d]/g, ''); //清除"数字以外的字符
			this.form.phone = val;
		},
		getCode() {
			if (!this.form.phone.trim()) {
				uni.showToast({
					title: '请输入手机号',
					icon: 'none'
				});
				return;
			}
			if (!/^(?:13\d|14\d|15\d|16\d|17\d|18\d|19\d)\d{5}(\d{3}|\*{3})$/.test(this.form.phone)) {
				uni.showToast({
					title: '手机号码格式有误',
					icon: 'none'
				});
				return;
			}
			this.counting = true;
			this.$http.post('/api/login/getcode', { phone: this.form.phone }).then(res => {
				if (res.code == 0) {
					this.timer = setInterval(() => {
						if (this.time > 0) {
							this.time--;
						} else {
							clearInterval(this.timer);
							this.counting = false;
							this.timer = null;
							this.time = 60;
						}
					}, 1000);
				}
			});
		},
		submit() {
			if (!this.token) {
				this.setLoginModal(true);
				return;
			}
			if (!/^(?:13\d|14\d|15\d|16\d|17\d|18\d|19\d)\d{5}(\d{3}|\*{3})$/.test(this.form.phone)) {
				uni.showToast({
					title: '手机号码格式有误',
					icon: 'none'
				});
				return;
			}
			this.$http.post('/api/personal/amend_phone', this.form).then(res => {
				if (res.code == 0) {
					this.$http.post('/api/express/personal_information').then(res => {
						if (res.code == 0) {
							this.setUserinfo(res.data);
							uni.navigateBack();
						}
					});
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
.modify-phone {
	.cell {
		background: #ffffff;
		margin-top: 20upx;
		height: 100upx;
		box-shadow: 0px 0px 10px 0px rgba(152, 152, 152, 0.1);
		border-radius: 20upx;
		.icon-verfity,
		.icon-phone {
			width: 48upx;
			height: 48upx;
			margin: 0 30upx;
		}
		.cu-btn.sm {
			font-size: 24upx;
			width: 160upx;
		}
	}
	.submit {
		box-shadow: 0px 2px 10px 0px rgba(38, 212, 153, 0.5);
	}
}
</style>
