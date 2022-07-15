<template>
	<view class="bd">
		<u-navbar title="订单列表"></u-navbar>
		<view class="tabs">
			<u-tabs :list="tabList" active-color="#26D499" :is-scroll="false" :current="current" @change="changeTab"></u-tabs>
		</view>
		<view class="subsection">
			<u-subsection :list="slist" :current="scurrent" @change="changeType" active-color="#26D499"></u-subsection>
		</view>
		<view class="empty" v-if="isEmpty">
			<u-empty text="暂无订单数据" mode="list"></u-empty>
		</view>
		<view class="list" v-else>
			<view class="item" v-for="(item,index) in list" :key="index">
				<view class="top" @click="goDetail(item)">
					<view class="user">
						<view class="avatar">
							<image :src="item.avatar" mode="widthFix"></image>
						</view>
						<view class="nickname">{{ item.nickname }}</view>
					</view>
					<view class="service">送达时间：{{ item.delivery_time }}</view>
				</view>
				<view class="info" @click="goDetail(item)">
					<view>
						<text class="dot orange"></text>
						<text v-if="type == 1">订单类型：代取快递</text>
						<text v-else>订单类型：快餐配送</text>
					</view>
					<view>
						<text class="dot"></text>
						<text>配送位置：{{ item.site }}</text>
					</view>
				</view>
				<view class="bottom">
					<view class="price">跑腿费：<text>￥{{ item.price }}</text></view>
					<view class="btn">
						<text v-if="status == 1" @click="takeOrder(item)">抢单</text>
						<view v-if="status == 2 && type == 1">
							<text @click="receive(item)" v-if="item.type == 2">送达</text>
							<text class="red" @click="del(item)" v-if="item.type == 3">删除</text>
						</view>
						<view v-if="status == 2 && type == 2">
							<text v-if="item.status == 4" @click="delivery(item)">配送</text>
							<text v-if="item.status == 5" @click="receive(item)">送达</text>
							<text class="red" @click="del(item)" v-if="item.status == 6 || item.status == 7">删除</text>
						</view>
					</view>
				</view>
			</view>
		</view>
		<view class="actions-fixed">
			<view class="flex flex-direction align-center">
				<image @click="toMyBehalf" src="../../static/issue-icon.png" class="issue-btn margin-bottom-xl" mode=""></image>
				<image @click="toIssue" src="../../static/add-icon.png" class="issue-my" mode=""></image>
			</view>
		</view>
		<u-popup v-model="showSuccess" mode="center" border-radius="15" width="650" :mask-custom-style="maskCustomStyle">
			<view class="sbox">
				<view class="icon">
					<image src="/static/add-icon.png" mode="widthFix"></image>
				</view>
				<view class="con">
					<view class="title">抢单成功</view>
					<view class="content">您已经抢单成功，为保障服务质量，请立即为您的顾客服务</view>
					<view class="btn"><text>去配送</text></view>
					<view class="grab" @click="showSuccess = false">继续抢单</view>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
	import common from '@/utils/mixins/common.js';
	import { mapGetters } from 'vuex';
	import { dateUtils } from '@/utils/util.js';
	import tuiTips from '@/components/tips/tips.vue';
	import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
	export default {
		components: { uniNavBar, tuiTips, uniLoadMore },
		mixins: [common],
		data() {
			return {
				tabList: [{
					status:1,
					name: '待接单',
				}, {
					status:2,
					name: '已接单'
				}],
				current: 0,
				slist: [
					{
						type:1,
						name: '快递待取'
					}, 
					{
						type:2,
						name: '快餐配送'
					}
				],
				scurrent: 0,
				showSuccess:false,
				maskCustomStyle:{
					background: 'rgba(0, 0, 0, 0.2)'
				},
				page: 1,
				lastPage: 1,
				list: [],
				nodata: false,
				loadingStatus: 'more',
				pullUpOn: false,
				status:1,
				type:1,
				isEmpty:false
			}
		},
		computed: {
			...mapGetters(['token', 'schoolinfo'])
		},
		onLoad() {
			this.getList();
			let that = this
			uni.$on('updateOrderList',function(res){
				that.page = 1;
				that.getList();
			})
		},
		onPullDownRefresh() {
			this.pullUpOn = true;
			this.page = 1;
			this.getList();
		},
		onReachBottom() {
			this.loadingStatus = 'loading';
			if (this.page < this.lastPage) {
				this.page++;
				this.getList();
			} else {
				this.loadingStatus = 'noMore';
			}
		},
		methods: {
			changeTab(index) {
				this.current = index;
				this.status = this.tabList[index].status
				// this.pullUpOn = true;
				this.page = 1;
				this.getList();
			},
			changeType(index) {
				this.scurrent = index;
				this.type = this.slist[index].type
				// this.pullUpOn = true;
				this.page = 1;
				this.getList();
			},
			getList() {
				this.isEmpty = false
				this.$http.post('/api/personal/order_list', { page: this.page,type:this.type,status:this.status }).then(res => {
					if (res.code == 0) {
						this.lastPage = res.data.last_page;
						this.nodata = !res.data.data.length;
						if (this.page > 1) {
							this.list.push(...res.data.data);
							this.loadingStatus = 'more';
						} else {
							this.list = res.data.data;
							if (res.data.data.length < 10) {
								this.loadingStatus = 'noMore';
							} else {
								this.loadingStatus = 'more';
							}
							if(res.data.data.length == 0){
								this.isEmpty = true
							}
						}
						if (this.pullUpOn) {
							this.pullUpOn = false;
							uni.stopPullDownRefresh();
							uni.showToast({
								title: '刷新成功',
								icon: 'none'
							})
						}
					}
				});
			},
			goDetail(item){
				let url = ''
				if(this.type == 1){
					url = '/pages/delivery/express-detail?id='+item.id
				}else{
					url = '/pages/delivery/takeout-detail?id='+item.id
				}
				uni.navigateTo({
					url:url
				})
			},
			takeOrder(item){
				let that = this
				uni.showModal({
					title:'提示',
					content:'是否确定抢单?',
					success(e) {
						if(e.confirm){
							if(that.type == 1){
								that.$http.get('/api/personal/pick_express',{id:item.id}).then(res => {
									uni.showToast({
										title:res.msg,
										icon:'none'
									})
									if(res.code == 0){
										// that.pullUpOn = true;
										that.page = 1;
										that.getList();
									}
								})
							}else{
								that.$http.get('/api/personal/pick_takeout',{id:item.id}).then(res => {
									uni.showToast({
										title:res.msg,
										icon:'none'
									})
									if(res.code == 0){
										// that.pullUpOn = true;
										that.page = 1;
										that.getList();
									}
								})
							}
						}
					}
				})

			},
			delivery(item){
				let that = this
				that.$http.get('/api/personal/takeout_status',{id:item.id,status:5}).then(res => {
					uni.showToast({
						title:res.msg,
						icon:'none'
					})
					if(res.code == 0){
						this.$set(item,'status',5)
					}
				})
			},
			receive(item){
				let that = this
				if(that.type == 1){
					that.$http.get('/api/personal/express_status',{id:item.id,status:3}).then(res => {
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
						if(res.code == 0){
							this.$set(item,'type',3)
						}
					})
				}else{
					that.$http.get('/api/personal/takeout_status',{id:item.id,status:6}).then(res => {
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
						if(res.code == 0){
							this.$set(item,'status',6)
						}
					})
				}

			},
			del(item){
				let that = this
				uni.showModal({
					title:'提示',
					content:'是否确定删除订单？',
					success(e) {
						if(e.confirm){
							if(that.type == 1){
								that.$http.get('/api/personal/express_del',{id:item.id}).then(res => {
									uni.showToast({
										title:res.msg,
										icon:'none'
									})
									if(res.code == 0){
										that.page = 1;
										that.getList();
									}
								})
							}else{
								that.$http.get('/api/personal/takeout_del',{id:item.id}).then(res => {
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
					}
				})
			},
			toIssue() {
				if (!this.token) {
					this.setLoginModal(true);
					return;
				}
				uni.navigateTo({
					url: '/pages/composite/behalf-issue'
				});
			},
			toMyBehalf() {
				uni.navigateTo({
					url: '/pages/my/behalf-order'
				});
			}
		}
	}
</script>

<style lang="scss">
	page{
		background-color: #F8F8F8;
	}
	.tabs{
		
	}
	.subsection{
		width: 80%;
		margin-top: 20rpx;
		margin-left: 10%;
	}
	.list{
		margin: 20rpx;
		.item{
			background-color: #FFFFFF;
			border-radius: 20rpx;
			padding: 20rpx;
			margin-bottom: 20rpx;
			.top{
				display: flex;
				height: 70rpx;
				line-height: 70rpx;
				border-bottom: 1px solid #F1F1F1;
				.user{
					display: flex;
					width: 30%;
					.avatar{
						width: 60rpx;
						height: 60rpx;
						margin-right: 15rpx;
						image{
							width: 100%;
							border-radius: 50%;
							position: relative;
							top: 2rpx;
						}
					}
					.nickname{
						color: #999999;
					}
				}
				.service{
					width: 70%;
					text-align: right;
					color: #999999;
				}
			}
			.info{
				font-size: 30rpx;
				padding: 20rpx 30rpx;
				border-bottom: 1px solid #F1F1F1;
				view{
					width: 100%;
					display: block;
					overflow:hidden;
					white-space: nowrap;
					text-overflow: ellipsis; 
					margin-bottom: 10rpx;
					text{

					}
					.dot{
						width: 12rpx;
						height: 12rpx;
						background-color: #26D499;
						display: inline-block;
						border-radius: 50%;
						margin-right: 10rpx;
						position: relative;
						top: -5rpx;
					}
					.orange{
						background-color: #ff8d1a;
					}
				}
			}
			.bottom{
				display: flex;
				padding: 25rpx 10rpx 15rpx 30rpx;
				.price{
					width: 50%;
					text{
						color: #FF0000;
					}
				}
				.btn{
					width: 50%;
					text-align: right;
					text{
						background: linear-gradient(to right, #26D499,#57e2b3);
						color: #FFFFFF;
						padding: 10rpx 80rpx;
						border-radius: 50rpx;
						box-shadow: #a3c9fa 5rpx 4rpx 20rpx;
					}
					.red{
						background: linear-gradient(to right, #d44848,#e86e6e);
						box-shadow: #FF0063 0rpx 0rpx 0rpx;
					}
				}
			}
		}
	}
	.sbox{
		padding: 50rpx 50rpx 50rpx 50rpx;
		position: relative;
		.icon{
			text-align: center;
			top: -80rpx;
			position: absolute;
			top: -14rpx;
			margin: auto;
			left: 0;
			right: 0;
			image{
				width: 150rpx;
			}
		}
		.con{
			background-color: #FFFFFF;
			padding-top: 120rpx;
			border-radius: 20rpx;
			padding-bottom: 30rpx;
			.title{
				color: #e2582f;
				font-size: 50rpx;
				text-align: center;
			}
			.content{
				margin: 50rpx 0;
				width: 80%;
				margin-left: 10%;
				font-size: 30rpx;
				line-height: 50rpx;
			}
			.btn{
				width: 100%;
				text{
					width: 80%;
					margin-left: 10%;
					display: block;
					background: linear-gradient(to right, #26D499,#57e2b3);
					color: #FFFFFF;
					// padding: 10rpx 80rpx;
					border-radius: 50rpx;
					box-shadow: #a3c9fa 5rpx 4rpx 20rpx;
					text-align: center;
					height: 80rpx;
					line-height: 80rpx;
				}
			}
			.grab{
				margin-top: 30rpx;
				text-align: center;
				color: #999999;
			}
		}
	}
	.empty{
		margin-top: 200rpx;
	}
	.actions-fixed {
		position: fixed;
		right: 30upx;
		bottom: 150upx;
		.issue-btn,
		.issue-my {
			width: 88upx;
			height: 88upx;
		}
	}
</style>
