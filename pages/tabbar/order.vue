<template>
	<view class="order">
		<!-- tab标题 -->
		<view class="order-header flex justify-center align-center text-lg" :style="style">
			<text @click="changeTab(0)" class="line flex align-center padding-lr-xl" :class="currentTab == 0 ? 'text-bold text-xl active' : ''">外卖</text>
			<text @click="changeTab(1)" class="line flex align-center padding-lr-xl" :class="currentTab == 1 ? 'text-bold text-xl active' : ''">生活</text>
		</view>
		<block v-if="currentTab == 0">
			<!-- order navbar -->
			<view class="order-navbars padding-lr-sm text-gray flex justify-between align-center shadow" :style="{ top: CustomBar + 'px' }">
				<view @click.self="changeNavbar" :data-type="0" class="line flex align-center" :class="currentNavbar == 0 ? 'text-green active' : ''">全部</view>
				<view @click.self="changeNavbar" :data-type="1" class="line flex align-center" :class="currentNavbar == 1 ? 'text-green active' : ''">
					待付款
					<text v-if="redDotsInfo.new1" class="dot-position cuIcon-title text-red"></text>
				</view>
				<view @click.self="changeNavbar" :data-type="3" class="line flex align-center" :class="currentNavbar == 3 ? 'text-green active' : ''">
					已接单
					<text v-if="redDotsInfo.new3" class="dot-position cuIcon-title text-red"></text>
				</view>
				<view @click.self="changeNavbar" :data-type="4" class="line flex align-center" :class="currentNavbar == 4 ? 'text-green active' : ''">
					配送接单
					<text v-if="redDotsInfo.new4" class="dot-position cuIcon-title text-red"></text>
				</view>
				<view @click.self="changeNavbar" :data-type="5" class="line flex align-center" :class="currentNavbar == 5 ? 'text-green active' : ''">
					配送中
					<text v-if="redDotsInfo.new5" class="dot-position cuIcon-title text-red"></text>
				</view>
				<view @click.self="changeNavbar" :data-type="6" class="line flex align-center" :class="currentNavbar == 6 ? 'text-green active' : ''">
					待评价
					<text v-if="redDotsInfo.new6" class="dot-position cuIcon-title text-red"></text>
				</view>
			</view>
			<!-- 列表 -->
			<view class="list padding-lr" :style="{ paddingTop: CustomBar + 50 + 'px' }">
				<view @click="toOrderDetails(item.id)" v-for="(item, index) in takeoutList" :key="index" class="list-item padding-lr margin-bottom-sm">
					<view class="padding-tb-sm flex justify-between align-center">
						<view class="text-gray text-df">{{ item.addtime }}</view>
						<view class="text-df text-green">{{ orderStatusText(item.status) }}</view>
						<view v-if="item.status == 10 && item.groupbuy_status == '拼团中'" class="text-df text-green">{{ `待分享，差${item.groupbuy_less_num}人` }}</view>
						<view v-if="item.status == 10 && item.groupbuy_status == '已过期'" class="text-df text-red">拼团失败</view>
						<view v-if="item.status == 10 && item.groupbuy_status == '发起者未支付'" class="text-df text-red">拼团订单，待支付</view>
						<view v-if="item.status == 11 && item.groupbuy_status == '已过期'" class="text-df text-red">待退款</view>
					</view>
					<view class="order-desc padding-tb-sm flex">
						<image :src="item.store_avatar_path" class="order-img margin-right-sm" mode="aspectFill"></image>
						<view class=" flex-sub flex flex-direction overflow">
							<view class="text-cut text-df text-bold">{{ item.store_name }}</view>
							<view class="text-gray padding-tb-xs">订单编号：{{ item.order_sn }}</view>
							<view class="text-red text-xl text-bold">¥{{ item.pay_money }}</view>
						</view>
					</view>
					<view v-if="!(item.status == 11) && !(item.status == 10 && item.groupbuy_status)" class="flex justify-end padding-tb-sm" style="position: relative;">
						<button v-if="item.status == 1" @click.stop="canCelOrder(item.id)" class="cancel cu-btn margin-left-sm sm text-gray">取消订单</button>
						<button v-if="(item.status == 2 || item.status == 3 || item.status == 4) && item.refund" @click.stop="refundOrder(item.id)" class="cancel cu-btn margin-left-sm sm text-gray">订单退款</button>
						<button v-if="item.status == 1" @click.stop="payNow(item.id)" class="cu-btn bg-green margin-left-sm sm">立即付款</button>
						<button v-if="item.status == 7 || item.status == 8 || item.status == 9" @click.stop="delOrder(item.id)" class="cu-btn line-gray margin-left-sm sm">删除订单</button>
						<button v-if="item.status == 6" @click.stop="toOrderEvaluate(item.id, item.store_id)" class="cu-btn bg-green margin-left-sm sm">立即评价</button>
						<button
							v-if="(item.status == 3 && item.pick_self) || item.status == 4 || item.status == 5"
							@click.stop="confirmReceipt(item.id)"
							class="cu-btn bg-green margin-left-sm sm"
						>
							确认收货
						</button>
						<view v-if="item.pick_self==1" class="picker-self text-green" >到店自取</view>
					</view>
					<view v-if="item.status == 10 && item.groupbuy_status" class="flex justify-end padding-tb-sm" style="position: relative;">
						<button @click.stop="canCelGroupOrder(item.id)" class="cancel cu-btn margin-left-sm sm text-gray">取消订单</button>

						<button
							v-if="item.groupbuy_status == '拼团中'"
							@click.stop="clipboard(item)"
							open-type="share"
							:data-id="item.goods_id"
							:data-school_id="item.user_school_id"
							:data-group_buy_id="item.group_buy_id"
							class="cu-btn bg-green margin-left-sm sm"
						>
							邀请好友拼团
						</button>
						<button v-if="item.groupbuy_status !== '拼团中'" @click.stop="delOrder(item.id)" class="cu-btn line-gray margin-left-sm sm">删除订单</button>
						<button v-if="item.groupbuy_status == '已完成'" @click.stop="toOrderEvaluate(item.id, item.store_id)" class="cu-btn bg-green margin-left-sm sm">立即评价</button>
						<view v-if="item.pick_self==1" class="picker-self text-green" >到店自取</view>
					</view>
				</view>
				<tui-tips v-if="takeoutNodata" fixed imgUrl="../../static/img_nodata.png">暂无数据</tui-tips>
				<uni-load-more v-if="takeoutList.length" :status="takeoutLoadingStatus"></uni-load-more>
			</view>
		</block>
		<block v-if="currentTab == 1">
			<!-- order navbar -->
			<view class="order-navbars margin-lr padding-lr text-gray flex justify-between align-center" :style="{ top: CustomBar + 'px' }">
				<view @click="changeNavbar" :data-type="5" class="line flex align-center" :class="currentLifeNavbar == 5 ? 'text-green active' : ''">全部</view>
				<view @click.self="changeNavbar" :data-type="1" class="line flex align-center" :class="currentLifeNavbar == 1 ? 'text-green active' : ''">
					待付款
					<text v-if="redDotsInfo.new1" class="dot-position cuIcon-title text-red"></text>
				</view>
				<view @click.self="changeNavbar" :data-type="2" class="line flex align-center" :class="currentLifeNavbar == 2 ? 'text-green active' : ''">
					待接单
					<text v-if="redDotsInfo.new2" class="dot-position cuIcon-title text-red"></text>
				</view>
				<view @click.self="changeNavbar" :data-type="3" class="line flex align-center" :class="currentLifeNavbar == 3 ? 'text-green active' : ''">
					待使用
					<text v-if="redDotsInfo.new3" class="dot-position cuIcon-title text-red"></text>
				</view>
				<view @click.self="changeNavbar" :data-type="4" class="line flex align-center" :class="currentLifeNavbar == 4 ? 'text-green active' : ''">
					待评价
					<text v-if="redDotsInfo.new4" class="dot-position cuIcon-title text-red"></text>
				</view>
			</view>
			<!-- 列表 -->
			<view class="list padding-lr padding-top-sm" :style="{ marginTop: CustomBar + 40 + 'px' }">
				<view @click="toOrderDetails(item.id)" v-for="(item, index) in lifeList" :key="index" class="list-item padding-lr margin-bottom-sm">
					<view class="padding-tb-sm flex justify-between align-center">
						<view class="text-gray text-df">{{ item.addtime }}</view>
						<view class="text-df text-green">{{ lifeOrderStatusText(item.status) }}</view>
					</view>
					<view class="order-desc padding-tb-sm flex">
						<image :src="item.store_avatar_path" class="order-img margin-right-sm" mode="aspectFill"></image>
						<view class=" flex-sub flex flex-direction overflow">
							<view class="text-cut text-df text-bold">{{ item.store_name }}</view>
							<view class="text-gray padding-tb-xs">订单编号：{{ item.order_sn }}</view>
							<view class="text-red text-xl text-bold">¥{{ item.pay_money }}</view>
						</view>
					</view>
					<view v-if="!(item.status == 2 || item.status == 3)" class="flex justify-end padding-tb-sm">
						<button v-if="item.status == 5 || item.status == 6 || item.status == 7" @click.stop="delOrder(item.id)" class="cu-btn line-gray margin-left-sm sm">删除订单</button>
						<button v-if="item.status == 1" @click.stop="canCelOrder(item.id)" class="cancel cu-btn margin-left-sm sm text-gray">取消订单</button>
						<button v-if="item.status == 1" @click.stop="payNow(item.id)" class="cu-btn bg-green margin-left-sm sm">立即付款</button>
						<button v-if="item.status == 4" @click.stop="toOrderEvaluate(item.id, item.store_id)" class="cu-btn bg-green margin-left-sm sm">立即评价</button>
					</view>
				</view>
				<tui-tips v-if="lifeNodata" imgUrl="../../static/img_nodata.png" fixed>暂无数据</tui-tips>
				<uni-load-more v-if="lifeList.length" :status="lifeLoadingStatus"></uni-load-more>
			</view>
		</block>

		<login-modal></login-modal>
	</view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import LoginModal from '@/components/login/login-modal.vue';
import common from '@/utils/mixins/common.js';
import tuiTips from '@/components/tips/tips.vue';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
const thorui = require('@/components/utils/clipboard.thorui.js');

export default {
	mixins: [common],
	components: { tuiTips, uniLoadMore, LoginModal },
	data() {
		return {
			CustomBar: this.CustomBar,
			currentTab: 0, // 0---外卖 1---生活
			currentNavbar: 0, // 0 全部 1 待付款 3 已接单 4 配送接单 5 配送中
			currentLifeNavbar: 5, // 0---全部 1---待付款 2---待接单 3---待使用 4---待评价
			takeoutList: [],
			takeoutPage: 1,
			takeoutLastPage: 1,
			takeoutLoadingStatus: 'more',
			takeoutNodata: false,
			takeoutPullOnUp: false,
			lifeList: [],
			lifePage: 1,
			lifeLastPage: 1,
			lifeLoadingStatus: 'more',
			lifeNodata: false,
			lifePullOnUp: false,
			redDotsInfo: {} // 小红点信息
		};
	},
	computed: {
		...mapGetters(['token', 'shareData', 'userinfo']),
		style() {
			var StatusBar = this.StatusBar;
			var CustomBar = this.CustomBar;
			var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
			return style;
		}
	},
	onPullDownRefresh() {
		if (this.currentTab == 0) {
			this.takeoutPullOnUp = true;
			this.takeoutPage = 1;
			this.getTakeoutList();
		} else {
			this.lifePullOnUp = true;
			this.lifePage = 1;
			this.getLifeList();
		}
	},
	onReachBottom() {
		if (this.currentTab == 0) {
			this.takeoutLoadingStatus = 'loading';
			if (this.takeoutPage < this.takeoutLastPage) {
				this.takeoutPage++;
				this.getTakeoutList();
			} else {
				this.takeoutLoadingStatus = 'moMore';
			}
		} else {
			this.lifeLoadingStatus = 'loading';
			if (this.lifePage < this.lifeLastPage) {
				this.lifePage++;
				this.getLifeList();
			} else {
				this.lifeLoadingStatus = 'moMore';
			}
		}
	},
	onLoad(option) {
		if (option.tab) {
			this.currentTab = Number(option.tab);
			if (option.tab == 0) {
				this.currentNavbar = Number(option.cur);
			} else if (option.tab == 1) {
				this.currentLifeNavbar = Number(option.cur);
			}
		}
	},
	onShow() {
		if (this.currentTab == 0) {
			this.takeoutPage = 1;
			this.getTakeoutList();
			this.getDots();
		} else {
			this.lifePage = 1;
			this.getLifeList();
			this.getDots();
		}
	},
	onShareAppMessage(res) {
		let id, school_id, group_buy_id;
		if (res.from === 'button') {
			// 来自页面内分享按钮
			id = res.target.dataset.id;
			school_id = res.target.dataset.school_id;
			group_buy_id = res.target.dataset.group_buy_id;
		}
		return {
			title: this.shareData ? this.shareData.title : '',
			path: this.userinfo
				? `/pages/home/food-details?id=${id}&school_id=${school_id}&group_buy_id=${group_buy_id}&invite_code=${this.userinfo.invite_code}`
				: `/pages/home/food-details?id=${id}&school_id=${school_id}&group_buy_id=${group_buy_id}`
		};
	},
	methods: {
		...mapActions(['setLoginModal']),
		// 订单状态
		orderStatusText(status) {
			switch (status) {
				case 1:
					return '待付款';
				case 3:
					return '已接单';
				case 4:
					return '配送接单';
				case 5:
					return '配送中';
				case 6:
					return '待评价';
				case 7:
					return '已完成';
				case 8:
					return '已退款';
				case 9:
					return '订单已取消';
				case 10:
					return '拼团中';
				case 11:
					return '待退款';
				default:
					return '';
			}
		},
		// 生活订单状态
		lifeOrderStatusText(status) {
			switch (status) {
				case 1:
					return '待付款';
				case 2:
					return '待接单';
				case 3:
					return '待使用';
				case 4:
					return '待评价';
				case 5:
					return '已完成';
				case 6:
					return '已退款';
				case 7:
					return '已取消';
				default:
					return '';
			}
		},
		// 小红点
		getDots() {
			this.$http.post('/api/service/order_count', { order_type: this.currentTab + 1 }).then(res => {
				this.redDotsInfo = res.data;
			});
		},
		changeTab(val) {
			val !== this.currentTab && (this.currentTab = val);
			if (val == 1) {
				this.lifePage = 1;
				this.getLifeList();
			}
			this.getDots();
		},
		changeNavbar(e) {
			let val = e.target.dataset.type;
			if (this.currentTab == 0) {
				val != this.currentNavbar && (this.currentNavbar = val);
				this.takeoutPage = 1;
				this.getTakeoutList();
				if (val < 5) {
					this.redDotsInfo[`new${val}`] = 0;
				}
			} else {
				val != this.currentLifeNavbar && (this.currentLifeNavbar = val);
				this.lifePage = 1;
				this.getLifeList();
				if (val < 5) {
					this.redDotsInfo[`new${val}`] = 0;
				}
			}
		},
		toOrderDetails(id) {
			if (this.currentTab == 0) {
				uni.navigateTo({ url: `/pages/order/takeout-order-details?id=${id}` });
			} else {
				uni.navigateTo({ url: `/pages/order/life-order-details?id=${id}` });
			}
		},
		toOrderEvaluate(id, store_id) {
			if (this.currentTab == 0) {
				uni.navigateTo({ url: `/pages/order/takeout-order-evaluate?id=${id}&store_id=${store_id}` });
			} else {
				uni.navigateTo({ url: `/pages/order/life-order-evaluate?id=${id}&store_id=${store_id}` });
			}
		},

		// 外卖订单列表
		getTakeoutList() {
			if (!this.token) {
				this.setLoginModal(true);
				return;
			}
			this.$http.post('/api/takeout/order_takeout_list', { type: this.currentNavbar, page: this.takeoutPage }).then(res => {
				if (res.code == 0) {
					this.takeoutLastPage = res.data.last_page;
					this.takeoutNodata = !res.data.data.length;
					if (this.takeoutPage > 1) {
						this.takeoutList.push(...res.data.data);
						this.takeoutLoadingStatus = 'more';
					} else {
						this.takeoutList = res.data.data;
						if (res.data.data.length < 10) {
							this.takeoutLoadingStatus = 'noMore';
						} else {
							this.takeoutLoadingStatus = 'more';
						}
					}
				} else {
					this.takeoutList = [];
					this.takeoutNodata = true;
				}
				if (this.takeoutPullOnUp) {
					this.takeoutPullOnUp = false;
					uni.stopPullDownRefresh();
					uni.showToast({
						title: '刷新成功',
						icon: 'none'
					});
				}
			});
		},

		// 取消订单
		canCelOrder(id) {
			if (this.currentTab == 0) {
				this.$http.post('/api/takeout/cancel_order_takeout', { order_id: id }).then(res => {
					if (res.code == 0) {
						this.takeoutPage = 1;
						this.getTakeoutList();
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			} else {
				this.$http.post('/api/life/cancel_order_life', { order_id: id }).then(res => {
					if (res.code == 0) {
						this.lifePage = 1;
						this.getLifeList();
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			}
		},
		// 取消拼团订单
		canCelGroupOrder() {
			uni.showModal({
				title: '提示',
				content: '发起拼团24小时后，若未拼团成功将自动取消订单并退款',
				confirmColor: '#26D499',
				confirmText: '知道了',
				showCancel: false,
				success: res => {
					console.log(res);
				}
			});
		},
		// 删除订单
		delOrder(id) {
			if (this.currentTab == 0) {
				this.$http.post('/api/takeout/del_order_takeout', { order_id: id }).then(res => {
					if (res.code == 0) {
						this.takeoutPage = 1;
						this.getTakeoutList();
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			} else {
				this.$http.post('/api/life/del_order_life', { order_id: id }).then(res => {
					if (res.code == 0) {
						this.lifePage = 1;
						this.getLifeList();
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			}
		},
		// 确认收货
		confirmReceipt(id) {
			this.$http.post('/api/takeout/confirm_receipt', { order_id: id }).then(res => {
				if (res.code == 0) {
					this.takeoutPage = 1;
					this.getTakeoutList();
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			});
		},

		// 生活订单列表
		getLifeList() {
			if (!this.token) {
				this.setLoginModal(true);
				return;
			}
			this.$http.post('/api/life/order_life_list', { type: this.currentLifeNavbar, page: this.lifePage }).then(res => {
				if (res.code == 0) {
					this.lifeLastPage = res.data.last_page;
					this.lifeNodata = !res.data.data.length;
					if (this.lifePage > 1) {
						this.lifeList.push(...res.data.data);
						this.lifeLoadingStatus = 'more';
					} else {
						this.lifeList = res.data.data;
						if (res.data.data.length < 10) {
							this.lifeLoadingStatus = 'noMore';
						} else {
							this.lifeLoadingStatus = 'more';
						}
					}
				} else {
					this.lifeList = [];
					this.lifeNodata = true;
				}
				if (this.lifePullOnUp) {
					this.lifePullOnUp = false;
					uni.stopPullDownRefresh();
					uni.showToast({
						title: '刷新成功',
						icon: 'none'
					});
				}
			});
		},

		// 生活订单立即付款
		async payNow(id) {
			if (this.currentTab == 0) {
				// #ifdef H5
				location.href = `${this.$domain}/api/takeout/pay_order_takeout?order_id=${id}`;
				// #endif
				// #ifdef MP
				uni.showLoading({ title: '提交中...', mask: true });
				let result = await this.$http.post('/api/appletspay/takeout_order_pay', { orderid: id });
				uni.hideLoading();
				if (result.code == 0) {
					uni.requestPayment({
						timeStamp: result.data.timeStamp,
						nonceStr: result.data.nonceStr,
						package: result.data.package,
						signType: result.data.signType,
						paySign: result.data.paySign,
						success: response => {
							this.takeoutPage = 1;
							this.getTakeoutList();
							this.getDots();
						}
					});
				}
				// #endif
			} else {
				// #ifdef H5
				location.href = `${this.$domain}/api/life/pay_order_life?order_id=${id}`;
				// #endif
				// #ifdef MP
				uni.showLoading({ title: '支付中...', mask: true });
				let result = await this.$http.post('/api/appletspay/life_order_pay', { order_id: id });
				uni.hideLoading();
				if (result.code == 0) {
					uni.requestPayment({
						timeStamp: result.data.timeStamp,
						nonceStr: result.data.nonceStr,
						package: result.data.package,
						signType: result.data.signType,
						paySign: result.data.paySign,
						success: response => {
							this.lifePage = 1;
							this.getLifeList();
							this.getDots();
						}
					});
				}
				// #endif
			}
		},

		clipboard(item) {
			// #ifdef H5
			let path = `${this.$domain}/h5/#/pages/home/food-details?id=${item.goods_id}&school_id=${item.user_school_id}&group_buy_id=${item.group_buy_id}`;
			thorui.getClipboardData(path, res => {
				if (res) {
					uni.showToast({
						title: '分享链接复制成功',
						icon: 'none'
					});
				} else {
					uni.showToast({
						title: '分享链接复制失败',
						icon: 'none'
					});
				}
			});
			// #endif
		},
		refundOrder(id){
			let that = this
			uni.showModal({
				title:'提示',
				content:'是否确定删除订单？',
				success(e) {
					that.$http.get('/api/personal/takeout_refund',{id:id}).then(res => {
						uni.showToast({
							title:res.msg,
							icon:'none'
						})
						if(res.code == 0){
							that.takeoutPage = 1;
							that.getTakeoutList();
							that.getDots();
						}
					})
				}
			})
		}
	}
};
</script>
<style lang="scss">
.order {
	// tab 标题
	.order-header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		background: #ffffff;
		z-index: 9;
		.line {
			height: 100%;
			position: relative;
			transition: all 0.2s;
			&:before {
				content: '';
				width: 40upx;
				height: 8upx;
				background: transparent;
				border-radius: 4upx;
				position: absolute;
				bottom: 0;
				left: 50%;
				transform: translateX(-50%);
			}
			&.active:before {
				background: #24d39a;
			}
		}
	}
	// order navbars
	.order-navbars {
		position: fixed;
		left: 0;
		right: 0;
		font-size: 30upx;
		height: 80upx;
		background: #ffffff;
		z-index: 99;
		.line {
			height: 100%;
			position: relative;
			transition: all 0.2s;

			&:before {
				content: '';
				width: 36upx;
				height: 4upx;
				border-radius: 2upx;
				background: transparent;
				position: absolute;
				bottom: 0;
				left: 50%;
				transform: translateX(-50%);
			}
			&.active:before {
				background: #24d39a;
			}
			.dot-position {
				position: absolute;
				top: 10upx;
				right: -15upx;
			}
		}
	}
	// 列表
	.list {
		.list-item {
			box-shadow: 0px 0px 10upx 0px rgba(152, 152, 152, 0.2);
			border-radius: 20upx;
			.order-img {
				width: 100upx;
				height: 88upx;
				border-radius: 8upx;
			}
			.order-desc {
				border-top: 2upx solid #ebebeb;
				border-bottom: 2upx solid #ebebeb;
			}
			.cancel {
				border: 2upx solid #cccccc;
				border-radius: 8upx;
				background: transparent;
			}
			.cu-btn.sm {
				font-size: 28upx;
			}
		}
	}
	
	
	.picker-self {
		position: absolute;
		left: 0;
		top: 50%;
		transform: translateY(-50%);
		font-size: 28rpx;
	}
}
</style>
e>
