<template>
	<view>
		<u-navbar title="提现"></u-navbar>
		<view class="box">
			<view class="title">提现金额</view>
			<view class="money">
				<text class="unit">￥</text>
				<input class="input" type="text" v-model="money">
			</view>
			<view class="tips">
				<text>零钱余额￥{{userinfo.money}},提现手续费{{userinfo.withdrawal_rate}}%,</text>
				<text @click="all">全部提现</text>
			</view>
			<view class="submit">
				<text @click="submit">提现</text>
			</view>
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
				},
				money:'',
				isSubmit:false
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
			all(){
				this.money = this.userinfo.money
			},
			submit(){
				if(this.isSubmit){
					return
				}
				this.isSubmit = true
				this.$http.post('/api/personal/withdraw',{money:this.money}).then(res => {
					if (res.code == 0) {
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
						this.isSubmit = false
						setTimeout(function(){
							uni.switchTab({
								url:'/pages/tabbar/my'
							})
						},1500)
					}else{
						this.isSubmit = false
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
					
					}
				});
			}
		}
	}
</script>

<style lang="scss">
	page{
		background: #F8F8F8;
	}
	.box{
		background: #FFFFFF;
		margin: 50rpx;
		padding: 30rpx;
		border-radius: 20rpx;
		padding-bottom: 80rpx;
		.title{
			font-size: 32rpx;
			margin-top: 30rpx;
		}
		.money{
			margin-top: 69rpx;
			display: flex;
			border-bottom: 1px solid #ccc;
			.unit{
				font-weight: bold;
				font-size: 53rpx;
			}
			.input{
				width: 100%;
				font-weight: bold;
				height: 68rpx;
				line-height: 60rpx;
				font-size: 50rpx;
				padding-left: 16rpx;
			}
		}
		.tips{
			margin-top: 50rpx;
			text{
				
				color: #999999;
				&:nth-child(1){
					
				}
				&:nth-child(2){
					color: #26D499;
				}
			}
		}
		.submit{
			margin-top: 60rpx;
			width: 100%;
			text-align: center;
			text{
				width: 80%;
				display: inline-block;
				background-color: #26D499;
				height: 80rpx;
				line-height: 80rpx;
				color: #FFFFFF;
				border-radius: 50rpx;
			}
		}
	}
</style>
