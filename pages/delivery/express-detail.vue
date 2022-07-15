<template>
	<view>
		<u-navbar title="订单详情"></u-navbar>
		<view class="cell-group">
			<u-cell-group>
				<u-cell-item title="订单类型" value="代取快递" :arrow="false" :value-style="valueStyle"></u-cell-item>
				<u-cell-item title="配送地址" :value="info.site" :arrow="false" :value-style="valueStyle"></u-cell-item>
				<u-cell-item title="代取地址" :value="info.seat" :arrow="false" :value-style="valueStyle"></u-cell-item>
				<u-cell-item title="取件方式" :value="info.mode" :arrow="false" :value-style="valueStyle"></u-cell-item>
				<u-cell-item title="快递单号" :value="info.number" :arrow="false" :value-style="valueStyle"></u-cell-item>
				<u-cell-item title="收货电话" :value="info.phone" :arrow="false" :value-style="valueStyle"></u-cell-item>
				<u-cell-item title="订单编号" :value="info.numbers" :arrow="false" :value-style="valueStyle"></u-cell-item>
				<u-cell-item title="送达时间" :value="info.delivery_time" :arrow="false" :value-style="valueStyle"></u-cell-item>
				<u-cell-item title="订单金额" :value="info.price+'元'" :arrow="false" :value-style="valueStyle"></u-cell-item>
				<!-- <u-cell-item title="退款金额" value="0元" :arrow="false" :value-style="valueStyle"></u-cell-item> -->
			</u-cell-group>
		</view>
		<view class="btn">
			<text class="active" v-if="info.type == 1" @click="takeOrder">抢单</text>
			<text class="active" v-if="info.type == 2" @click="receive(info)">已送达</text>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				id:0,
				valueStyle:{
					"text-align":"left",
					"margin-left":"50rpx"
				},
				info:{}
			}
		},
		onLoad(option) {
			this.id = option.id
			this.getInfo()
		},
		methods: {
			getInfo(){
				this.$http.get('/api/personal/express_info',{id:this.id}).then(res => {
					this.info = res.data
				})
			},
			takeOrder(){
				uni.showModal({
					title:'提示',
					content:'是否确定抢单?',
					success(e) {
						if(e.confirm){
							that.$http.get('/api/personal/pick_express',{id:that.id}).then(res => {
								uni.showToast({
									title:res.msg,
									icon:'none'
								})
								if(res.code == 0){
									that.page = 1;
									that.getList();
								}
							})
						}
					}
				})
			},
			receive(item){
				let that = this
				that.$http.get('/api/personal/express_status',{id:this.id,status:3}).then(res => {
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					if(res.code == 0){
						that.info.type = 3
					}
				})
			},
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F8F8F8;
	}
	.cell-group{
		margin-top: 20rpx;
	}
	.btn{
		width: 100%;
		position: fixed;
		bottom: 80rpx;
		text{
			width: 80%;
			margin-left: 10%;
			display: block;
			background: linear-gradient(to right, #57e2b3,#57e2b3);
			color: #FFFFFF;
			// padding: 10rpx 80rpx;
			border-radius: 50rpx;
			box-shadow: #a3c9fa 5rpx 4rpx 20rpx;
			text-align: center;
			height: 80rpx;
			line-height: 80rpx;
		}
		.active{
			background: linear-gradient(to right, #26D499,#57e2b3);
		}
	}
</style>
