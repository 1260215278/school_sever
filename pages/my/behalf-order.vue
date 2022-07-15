<template>
	<view class="behalf-order">
		<cu-custom isBack bgColor="bg-white text-black"><block slot="content">帮取快递</block></cu-custom>
		<view class="container">
			<view class="tabs grid col-3">
				<view @click="changeTab(0)" class="tab-item" :class="currentTab == 0 ? 'active' : ''">待接单</view>
				<view @click="changeTab(1)" class="tab-item" :class="currentTab == 1 ? 'active' : ''">配送中</view>
				<view @click="changeTab(2)" class="tab-item" :class="currentTab == 2 ? 'active' : ''">已完成</view>
			</view>
			<view class="list padding-lr">
				<view @click="toDetails(item.id)" v-for="(item, index) in list" :key="index" class="list-item padding-lr">
					<view class="flex justify-between align-center padding-tb-sm">
						<view class="text-999">{{ item.addtime }}</view>
						<view class="text-df text-green">{{ statusTxt(item.type) }}</view>
					</view>
					<view class="middle">
						<view class="">
							<text class="text-999">快递名称：</text>
							<text>{{ item.express_name }}</text>
						</view>
						<view class="padding-tb-xs">
							<text class="text-999">快递大小：</text>
							<text>{{ item.express_tracking }}</text>
						</view>
						<view class="">
							<text class="text-999">取件方法：</text>
							<text>{{ item.mode }}</text>
						</view>
						<view class="price text-xl text-red">¥{{ item.price }}</view>
					</view>
					<view v-if="!(item.type == 3 || item.type == 4)" class="flex justify-end align-center padding-tb-sm">
						<button @click.stop="cancelOrder(item.id)" v-if="item.type == 1" class="cu-btn line-gray margin-left-sm sm">取消订单</button>
						<button @click.stop="makePhoneCall" v-if="item.type == 1" class="cu-btn bg-green margin-left-sm sm">联系客服</button>
						<button @click.stop="makePhoneCall" v-if="item.type == 2" class="cu-btn line-gray margin-left-sm sm">投诉</button>
						<button @click.stop="confirmReceipt(item.id)" v-if="item.type == 2" class="cu-btn bg-green margin-left-sm sm">确认收货</button>
					</view>
				</view>
				<tui-tips v-if="nodata" fixed imgUrl="../../static/img_nodata.png">暂无数据</tui-tips>
				<uni-load-more v-if="list.length > 9" :status="loadingStatus"></uni-load-more>
			</view>
		</view>

		<login-modal></login-modal>
	</view>
</template>

<script>
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import tuiTips from '@/components/tips/tips.vue';
import common from '@/utils/mixins/common.js';
import { mapGetters } from 'vuex';

export default {
	components: { uniLoadMore, tuiTips },
	mixins: [common],
	data() {
		return {
			currentTab: 0, // 0 待接单 1 配送中 2 已完成
			list: [],
			page: 1,
			lastPage: 1,
			nodata: false,
			loadingStatus: 'more',
			pullUpOn: false,
			serviceTel: '' // 客服电话
		};
	},
	computed: {
		...mapGetters(['schoolinfo'])
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
	onPullDownRefresh() {
		this.pullUpOn = true;
		this.page = 1;
		this.getList();
	},
	onLoad() {
		this.getList();
		this.getServicePhone();
	},
	methods: {
		getServicePhone() {
			this.$http.post('/api/personal/phone', { school_id: this.schoolinfo.id }).then(res => {
				if (res.code == 0) {
					this.serviceTel = res.data;
				}
			});
		},
		makePhoneCall() {
			uni.makePhoneCall({
				phoneNumber: this.serviceTel
			});
		},
		statusTxt(type) {
			// 1 是待接单 2 配送中 3 是已完成 4 是已退款
			if (type) {
				if (type == 1) {
					return '待接单';
				} else if (type == 2) {
					return '配送中';
				} else if (type == 3) {
					return '已完成';
				} else {
					return '已退款';
				}
			} else {
				return '';
			}
		},
		changeTab(val) {
			if (val != this.currentTab) {
				this.currentTab = val;
				this.page = 1;
				this.getList();
			}
		},
		toDetails(id) {
			uni.navigateTo({
				url: `/pages/my/behalf-order-details?id=${id}&tel=${this.serviceTel}`
			});
		},

		getList() {
			this.$http.post('/api/express/express_list', { type: this.currentTab + 1, page: this.page }).then(res => {
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
					}
					if (this.pullUpOn) {
						this.pullUpOn = false;
						uni.stopPullDownRefresh();
						uni.showToast({
							title: '刷新成功',
							icon: 'none'
						});
					}
				}
			});
		},
		// 确认收货
		confirmReceipt(id) {
			this.$http.post('/api/express/express_notarize', { id: id }).then(res => {
				if (res.code == 0) {
					uni.showToast({
						title: res.msg,
						icon: 'none',
						mask: true
					});
					this.changeTab(2);
				}
			});
		},
		// 取消订单
		cancelOrder(id) {
			this.$http.post('/api/express/refund_order', { order_id: id }).then(res => {
				if (res.code == 0) {
					this.page = 1;
					this.getList();
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			});
		}
	}
};
</script>

<style lang="scss">
.behalf-order {
	.container {
		.tabs {
			height: 80upx;
			.tab-item {
				height: 100%;
				display: flex;
				justify-content: center;
				align-items: center;
				font-size: 30upx;
				color: #999;
				position: relative;
				transition: all 0.2s;
				&:after {
					content: '';
					width: 36upx;
					height: 4upx;
					background: transparent;
					border-radius: 2upx;
					position: absolute;
					bottom: 0;
					left: 50%;
					transform: translateX(-50%);
				}
				&.active {
					color: #26d499;
					&:after {
						background: #26d499;
					}
				}
			}
		}
		.list {
			.list-item {
				box-shadow: 0px 0px 10px 0px rgba(152, 152, 152, 0.2);
				border-radius: 20upx;
				margin-top: 20upx;
				.middle {
					position: relative;
					border-top: 2upx solid #ebebeb;
					border-bottom: 2upx solid #ebebeb;
					padding: 25upx 0;
					.price {
						position: absolute;
						right: 0;
						bottom: 25upx;
					}
				}
				.cu-btn.sm {
					font-size: 24upx;
				}
			}
		}
	}
}
</style>
