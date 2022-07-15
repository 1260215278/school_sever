<template>
	<view>
		<u-navbar title="我的钱包" back-icon-color="#FFFFFF" title-color="#FFFFFF" :border-bottom="false" :background="customStyle"></u-navbar>
		<view class="top">
			<view class="sta">
				<view class="txt">钱包余额</view>
				<view class="money"><text class="unit">￥</text>{{userinfo.money}}</view>
			</view>
		</view>

		<view class="withdraw">
			<navigator url="/pages/my/withdraw" >
				<text>立即提现</text>
			</navigator>
		</view>
	</view>
</template>

<script>
	import { mapGetters, mapActions } from 'vuex';
	import common from '@/utils/mixins/common.js';
	export default {
		mixins: [common],
		data() {
			return {
				customStyle:{
					background:'#26D499'
				}
			}
		},
		onLoad() {
			this.getUserinfo();
		},
		computed: {
			...mapGetters(['userinfo', 'schoolinfo', 'token', 'shareData']),
			
		},
		methods: {
			...mapActions(['setUserinfo', 'setToken', 'setSchoolinfo']),
			getUserinfo() {
				if (!this.token) return;
				this.$http.post('/api/express/personal_information').then(res => {
					if (res.code == 0) {
						this.setUserinfo(res.data);
					}
				});
			},
		}
	}
</script>

<style lang="scss">
	.top{
		background-color: #26D499;
		height: 280rpx;
	}
	.sta{
		text-align: center;
		padding-top: 80rpx;
		.txt{
			font-size: 30rpx;
			color: #FFFFFF;
		}
		.money{
			text{
				font-size: 55rpx;
			}
			margin-top: 10rpx;
			font-size: 70rpx;
			font-weight: bold;
			color: #FFFFFF;
		}
	}
	.withdraw{
		    text-align: center;
		text{
			border: 1px solid #ccc;
			padding: 20rpx 96rpx;
			background: #FFFFFF;
			border-radius: 58rpx;
			color: #26D499;
		}
	}
</style>
