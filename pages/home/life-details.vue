<template>
	<view class="life-details">
		<!-- header -->
		<uni-nav-bar
			class="navBar"
			:title="info.store_name"
			leftIcon="back"
			color="#fff"
			:statusBar="true"
			:shadow="false"
			backgroundColor="transparent"
			@clickLeft="clickLeft"
		></uni-nav-bar>

		<!-- banner -->
		<view class="swiper-wrap">
			<swiper class="swiper-card" :autoplay="true" :interval="3000" :duration="1000">
				<swiper-item>
					<view class="swiper-item"><image :src="info.store_avatar_path" class="swiper-img" mode="aspectFill"></image></view>
				</swiper-item>
			</swiper>
		</view>

		<!-- card info -->
		<view class="card-info bg-white">
			<view class="flex align-center justify-between">
				<view class="flex-sub text-cut text-bold text-df text-black">{{ info.store_name }}</view>
				<view class="text-xxl flex align-center">
					<text @click="collect" class="cuIcon-favorfill margin-lr" :class="!!info.is_collect ? 'text-yellow' : 'text-ccc'"></text>
					<!-- <text @click="clipboard" class="cuIcon-share text-ccc"></text> -->
					<button class="btn-share" open-type="share"><text @click="clipboard" class="cuIcon-share text-ccc"></text></button>
				</view>
			</view>
			<view class="flex padding-top-xs map-navigation-wrap margin-tb-xs">
				<image src="../../static/location-gray-icon.png" class="location-gray-icon" mode=""></image>
				<text class="flex-sub text-cut padding-lr-xs address">{{ info.store_address }}</text>
				<view @click="openMap" class="navigation-btn">地图/导航</view>
			</view>
			<view class="flex align-center padding-top-xs">
				<image src="../../static/phone-icon.png" class="phone-icon" mode=""></image>
				<text class="flex-sub text-cut padding-lr-xs">{{ info.service_phone }}</text>
			</view>
			<view v-if="coupons.length" class="tags">
				<view v-for="(item, index) in coupons" :key="index" class="tag cu-tag line-red sm radius">{{ tagsTxt(item) }}</view>
			</view>
		</view>

		<!-- tab 栏 -->
		<view class="tab-wrap grid col-3 text-lg">
			<view @click="changeTab(0)" class="tab-item" :class="currentTab === 0 ? 'active text-green' : ''">商品</view>
			<view @click="changeTab(1)" class="tab-item" :class="currentTab === 1 ? 'active text-green' : ''">评分</view>
			<view @click="changeTab(2)" class="tab-item" :class="currentTab === 2 ? 'active text-green' : ''">商家</view>
		</view>

		<scroll-view @scrolltoupper="scrolltoupper" @scrolltolower="scrolltolower" scroll-y style="height: calc(100vh - 88upx)">
			<!-- list-card -->
			<view v-if="currentTab === 0" class="list-card bg-white">
				<view class="list-header-wrap">
					<view @click="openCalendar" class="list-header flex justify-between align-center">
						<view class="">
							<block v-if="startDate">
								<text class="text-df">{{ startDate }}</text>
								<text class="padding-lr-xs">{{ myWeekDay(startDate) + '入住' }}</text>
							</block>
							<block v-else><text>请选择入住日期</text></block>
						</view>
						<view v-if="diff" class="cu-tag round sm header-tag">{{ diff + '晚' }}</view>
						<view class="">
							<block v-if="endDate">
								<text>{{ endDate }}</text>
								<text class="padding-lr-xs">{{ myWeekDay(endDate) + '离店' }}</text>
							</block>
							<text v-else>请选择离店时间</text>
							<text class="cuIcon-right"></text>
						</view>
					</view>
					<view class="tags flex flex-wrap">
						<view
							@click="storeClassTagsClick(item.id)"
							v-for="(item, index) in this.storeClassTags"
							:key="index"
							class="tag cu-tag df radius margin-top-sm margin-right-xs"
							:class="storeClassTagsId == item.id ? 'line-green' : 'line-gray'"
						>
							{{ item.cate_title }}
						</view>
					</view>
				</view>
				<view class="list">
					<view
						@click="viewDetails(item.id)"
						v-for="(item, index) in list"
						:key="index"
						class="list-item flex justify-between align-center"
						:class="list.length - 1 != index ? 'padding-bottom' : ''"
					>
						<view class="flex-sub overflow flex">
							<image :src="item.goods_img_path" class="list-item-img" mode="aspectFill"></image>
							<view class="flex-sub overflow padding-lr-sm flex flex-direction justify-between">
								<view class="text-bold text-black text-cut text-df">{{ item.goods_name }}</view>
								<view class="textg-gray text-cut">
									<text v-for="(em, i) in item.sku" :key="i" class="margin-right-sm">{{ em.attr_value }}</text>
								</view>
								<view class="text-red text-price text-lg">{{ item.goods_price }}</view>
							</view>
						</view>
						<view><button @click.stop="toOrderConfirm($event, item.id, item.goods_price)" class="cu-btn bg-red">预定</button></view>
					</view>
					<tui-tips v-if="nodata" imgUrl="../../static/img_nodata.png">暂无数据</tui-tips>
					<uni-load-more v-if="list.length > 7" :status="loadingStatus"></uni-load-more>
				</view>
			</view>

			<!-- 评分 -->
			<view v-if="currentTab === 1" class="rating-wrap">
				<view class="flex align-center justify-center padding-sm bg-white">
					<view class="margin-right">综合评分</view>
					<rate :current="Number(scoreinfo.com_star)" active="#FFD200" disabled :size="20"></rate>
					<view class="text-xl text-yellow margin-left">{{ parseFloat(scoreinfo.com_star).toFixed(1) }}分</view>
				</view>
				<view class="comments-wrap">
					<view class="flex align-center padding-sm bg-white text-black solid-bottom">
						<image src="../../static/comment-icon.png" class="comment-icon" mode=""></image>
						<text class="text-lg padding-lr-sm">全部评论({{ scoreinfo.counts }})</text>
					</view>
					<view class="list bg-white padding-left">
						<view v-for="(item, index) in commentList" :key="index" class="list-item padding-tb padding-right" :class="index !== 0 ? 'solid-top' : ''">
							<view class="flex justify-between align-center">
								<view class="flex-sub flex overflow">
									<image :src="item.icon" class="avatar" mode="aspectFill"></image>
									<view class="flex-sub padding-lr-sm overflow flex flex-direction justify-between">
										<view class="text-cut text-black">{{ item.nickname }}</view>
										<rate :current="item.star" :size="14" :hollow="true" active="#FFD200" :disabled="true"></rate>
									</view>
								</view>
								<view class="text-gray">{{ item.addtime }}</view>
							</view>
							<view class="comment-content padding-top-xs">{{ item.content }}</view>
							<view class="images">
								<view class="img" v-for="(img,i) in item.img_path">
									<image :src="img" @click="preImg(item.img_path,i)" mode="aspectFill"></image>
								</view>
							</view>
						</view>
						<tui-tips v-if="commentNodata" :fixed="false" imgUrl="../../static/img_nodata.png">暂无数据</tui-tips>
						<uni-load-more v-if="commentList.length" :status="commentLoadingStatus"></uni-load-more>
					</view>
				</view>
			</view>

			<!-- 商家 -->
			<view v-if="currentTab === 2" class="shops-card-wrap">
				<view class="shops-card margin-lr margin-tb-sm bg-white text-df">
					<view class="item margin-lr solid-bottom padding-tb">
						<view class="title">门店简介</view>
						<view class="text-black">{{ info.store_desc }}</view>
					</view>
					<view class="item padding-tb-sm margin-lr solid-bottom flex justify-between align-center">
						<view class="title">经营范围</view>
						<view class="flex-sub text-black text-cut padding-left text-right">{{ info.manage_scope }}</view>
					</view>
					<view class="item padding-tb-sm margin-lr solid-bottom flex justify-between align-center">
						<view class="title">客服电话</view>
						<view class="flex-sub text-black text-cut padding-left text-right">{{ info.service_phone }}</view>
					</view>
					<view class="item padding-tb-sm margin-lr solid-bottom flex justify-between">
						<view class="title">地址</view>
						<view class="flex-sub text-black padding-left text-right">{{ info.store_address }}</view>
					</view>
					<view class="item padding-tb-sm margin-lr solid-bottom flex justify-between align-center">
						<view class="title">营业时间</view>
						<view class="flex-sub text-black text-cut padding-left text-right">{{ info.manage_time }}</view>
					</view>
				</view>
			</view>
		</scroll-view>

		<!-- 详情弹窗 -->
		<uni-popup ref="detailsPopup" type="bottom" class="detailsPopup" @change="detailsPopupChange">
			<view class="popup-container bg-white">
				<text @click="detailsPopupClose" class="cuIcon-roundclose popup-close-icon"></text>
				<view class="text-lg text-black text-bold padding-tb-sm padding-lr">{{ detailsinfo.goods_name }}</view>
				<view class="popup-swiper-wrap">
					<swiper class="popup-swiper" :autoplay="true" :interval="3000" :duration="1000" @change="swiperChange" circular>
						<swiper-item v-for="(item, index) in detailsinfo.goods_img_path" :key="index">
							<view class="swiper-item"><image :src="item" class="popup-details-img" mode="aspectFill"></image></view>
						</swiper-item>
					</swiper>
					<view v-if="detailsinfo.goods_img_path" class="swiper-dots">{{ detailsSwiperIndex + 1 + '/' + detailsinfo.goods_img_path.length }}</view>
				</view>
				<view class="popup-desc padding-lr padding-tb-sm text-df grid col-2">
					<view v-for="(item, index) in detailsinfo.sku" :key="index" class="margin-bottom-xs flex align-center overflow">
						<text class="">{{ item.attr_key }}</text>
						<text class="flex-sub padding-lr-sm text-black text-cut">{{ item.attr_value }}</text>
					</view>
				</view>
				<view class="popup-actions flex">
					<view class="flex-sub text-black flex align-center padding-xl text-xxl">{{ '￥' + detailsinfo.goods_price }}</view>
					<view @click="toOrderConfirm($event, detailsinfo.id, detailsinfo.goods_price)" data-type="1" class="popup-btn text-white bg-red text-xl flex align-center justify-center">
						立即预订
					</view>
				</view>
			</view>
		</uni-popup>

		<!-- 打开日历弹窗 -->
		<uni-calendar ref="uniCalendar" :startDate="dataStart" :insert="false" :showMonth="false" :range="true" @confirm="uniConfirm"></uni-calendar>
	</view>
</template>

<script>
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
import rate from '@/components/rate/rate.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import uniCalendar from '@/components/uni-calendar/uni-calendar.vue';
import common from '@/utils/mixins/common.js';
import { mapGetters, mapActions } from 'vuex';
import tuiTips from '@/components/tips/tips.vue';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
const thorui = require('@/components/utils/clipboard.thorui.js');

var _format = function(number) {
	return number < 10 ? '0' + number : number;
};
var now = new Date();
now = now.getFullYear() + '-' + _format(now.getMonth() + 1) + '-' + _format(now.getDate());

export default {
	mixins: [common],
	components: {
		uniNavBar,
		rate,
		uniPopup,
		uniCalendar,
		tuiTips,
		uniLoadMore
	},
	data() {
		return {
			showCalendar: false,
			id: '',
			info: {},
			coupons: [], // 优惠券tags
			currentTab: 0, // 0--商品 1--评分 2--商家
			screenWidth: '',
			calendarInfo: {
				insert: false
			},
			storeClassTags: [],
			storeClassTagsId: '',

			dataStart: now, // 日期选择开始时间
			diff: '',
			startDate: '',
			endDate: '',

			list: [],
			page: 1,
			lastPage: 1,
			nodata: false,
			loadingStatus: 'more',
			detailsinfo: {},
			detailsSwiperIndex: 0, // 详情弹窗 指示点
			commentList: [],
			commentPage: 1,
			commentLastPage: 1,
			commentNodata: false,
			commentLoadingStatus: 'more',
			scoreinfo: {}
		};
	},
	computed: {
		...mapGetters(['token', 'shareData', 'userinfo'])
	},
	onLoad(option) {
		this.id = option.id;
		this.screenWidth = uni.getSystemInfoSync().screenWidth;
		this.getData();
		this.getCoupons();
		this.getList();
		this.getCommentList();
		this.getStoreClassTags();
	},
	onReachBottom() {},
	onShareAppMessage() {
		return {
			title: this.shareData ? this.shareData.title : '',
			path: this.shareData && this.userinfo ? `/pages/home/life-details?invite_code=${this.userinfo.invite_code}&id=${this.id}` : ''
		};
	},
	methods: {
		...mapActions(['setReserveRule']),

		// 酒店分类标签
		getStoreClassTags() {
			this.$http.post('/api/life/cate_life', { store_id: this.id }).then(res => {
				if (res.code == 0) {
					this.storeClassTags = res.data;
				}
			});
		},
		// 酒店分类标签-点击
		storeClassTagsClick(id) {
			if (id == this.storeClassTagsId) {
				this.storeClassTagsId = '';
				this.getList();
			} else {
				this.storeClassTagsId = id;
				this.page = 1;
				this.searchClassTags();
			}
		},
		// 酒店分类标签-搜索
		searchClassTags() {
			this.$http.post('/api/life/goods_live_list', { store_id: this.id, cate_id: this.storeClassTagsId, page: this.page }).then(res => {
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
				}
			});
		},

		// 打开地图查看位置
		openMap() {
			// #ifdef H5
			if (uni.getSystemInfoSync().platform == 'ios') {
				location.href = `https://apis.map.qq.com/tools/poimarker?type=0&marker=coord:${parseFloat(this.info.lat)},${parseFloat(this.info.lng)};title:${this.info.store_name};addr:${
					this.info.store_address
				}&key=OB4BZ-D4W3U-B7VVO-4PJWW-6TKDJ-WPB77&referer=myapp`;
			} else {
				uni.openLocation({
					latitude: parseFloat(this.info.lat),
					longitude: parseFloat(this.info.lng),
					name: this.info.store_name,
					address: this.info.store_address,
					success: function() {}
				});
			}
			// #endif
			// #ifdef MP
			uni.openLocation({
				latitude: parseFloat(this.info.lat),
				longitude: parseFloat(this.info.lng),
				name: this.info.store_name,
				address: this.info.store_address,
				success: function() {}
			});
			// #endif
		},

		uniConfirm(data) {
			var diffValue = new Date(data.range.before).getTime() - new Date(data.range.after).getTime();
			if (diffValue < 0) {
				this.startDate = data.range.before;
				this.endDate = data.range.after;
			} else {
				this.startDate = data.range.after;
				this.endDate = data.range.before;
			}
			this.diff = data.range.data.length - 1;
		},

		// 详情轮播图 change
		swiperChange(e) {
			this.detailsSwiperIndex = e.detail.current;
		},
		clickLeft() {
			let pages = getCurrentPages();
			if (pages.length > 1) {
				uni.navigateBack();
			} else {
				uni.switchTab({ url: '/pages/tabbar/home' });
			}
		},
		changeTab(val) {
			val !== this.currentTab && (this.currentTab = val);
		},
		// 查看详情
		viewDetails(id) {
			this.$http.post('/api/life/goods_life_detail', { goods_id: id }).then(res => {
				if (res.code == 0) {
					this.detailsinfo = res.data;
					this.$refs.detailsPopup.open();
				}
			});
		},
		// 弹窗关闭
		detailsPopupClose() {
			this.$refs.detailsPopup.close();
		},
		// 详情弹窗变化
		detailsPopupChange(e) {
			if (!e.show) {
				this.detailsSwiperIndex = 0;
			}
		},
		// 去订单确认页面
		toOrderConfirm(e, id, price) {
			if (!(this.startDate && this.endDate)) {
				uni.showToast({
					title: '请先选择入住、离店时间',
					icon: 'none'
				});
				return;
			}
			this.setReserveRule(this.info.appoint_rule ? this.info.appoint_rule : '');
			if (e.currentTarget.dataset.type == 1) {
				this.$refs.detailsPopup.close();
			}
			uni.navigateTo({
				url: `/pages/home/life-order-confirm?start=${this.startDate}&end=${this.endDate}&diff=${this.diff}&goods_id=${id}&store_id=${this.id}&goods_price=${price}`
			});
		},
		// 打开日历
		openCalendar() {
			this.$refs.uniCalendar.open();
		},

		// 计算日期是周几
		myWeekDay(s) {
			var weekDay = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

			var now = new Date();
			now = now.getFullYear() + '-' + _format(now.getMonth() + 1) + '-' + _format(now.getDate());
			var today = new Date(now.replace(/\-/g, '/')).getTime();
			var tomorrow = today + 24 * 60 * 60 * 1000;
			var tomorrowFormat = new Date(tomorrow).getFullYear() + '-' + _format(new Date(tomorrow).getMonth() + 1) + '-' + _format(new Date(tomorrow).getDate());
			var afterTomorrow = tomorrow + 24 * 60 * 60 * 1000;
			var afterTomorrowFormat = new Date(afterTomorrow).getFullYear() + '-' + _format(new Date(afterTomorrow).getMonth() + 1) + '-' + _format(new Date(afterTomorrow).getDate());
			if (!s) return '';
			if (s == now) {
				return '今天';
			} else if (s == tomorrowFormat) {
				return '明天';
			} else if (s == afterTomorrowFormat) {
				return '后天';
			} else {
				var b = new Date(Date.parse(s.replace(/\-/g, '/')));
				return weekDay[b.getDay()];
			}
		},

		// 详情
		getData() {
			this.$http.post('/api/service/store_detail', { store_id: this.id }).then(res => {
				if (res.code == 0) {
					this.info = res.data;
				}
			});
		},

		// 店铺优惠券
		getCoupons() {
			this.$http.post('/api/service/store_coupon', { store_id: this.id }).then(res => {
				if (res.code == 0) {
					this.coupons = res.data;
				} else {
					this.coupons = [];
				}
			});
		},

		// 优惠券tags
		tagsTxt(item) {
			if (item) {
				if (item.type == 1) {
					return item.condition + '减' + item.discount;
				} else if (item.type == 2) {
					return item.discount + '无门槛';
				} else {
					return '首单减' + item.discount;
				}
			} else {
				return '';
			}
		},

		// 商品列表
		getList() {
			this.$http.post('/api/life/goods_life_list', { store_id: this.id, page: this.page }).then(res => {
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
				}
			});
		},

		scrolltolower() {
			uni.pageScrollTo({
				scrollTop: 1000,
				duration: 150
			});

			if (this.currentTab == 0) {
				this.loadingStatus = 'loading';
				if (this.page < this.lastPage) {
					this.page++;
					if (!this.storeClassTagsId) {
						this.getList();
					} else {
						this.searchClassTags();
					}
				} else {
					this.loadingStatus = 'noMore';
				}
			} else if (this.currentTab == 1) {
				this.commentLoadingStatus = 'loading';
				if (this.commentPage < this.commentLastPage) {
					this.commentPage++;
					this.getCommentList();
				} else {
					this.commentLoadingStatus = 'noMore';
				}
			}
		},
		scrolltoupper() {
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 150
			});
		},
		// 收藏
		collect() {
			if (!this.token) {
				this.setLoginModal(true);
				return;
			}
			this.$http.post('/api/service/collect_store', { store_id: this.id }).then(res => {
				if (res.code == 0) {
					this.info.is_collect = this.info.is_collect == 0 ? 1 : 0;
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			});
		},
		// 分享
		clipboard() {
			let path = location.href;
			thorui.getClipboardData(path, res => {
				// #ifdef H5
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
				// #endif
			});
		},
		// 评分
		getCommentList() {
			// store_type 店铺类型1：外卖，2：生活
			this.$http.post('/api/service/store_praise', { store_id: this.id, store_type: 2, page: this.commentPage }).then(res => {
				if (res.code == 0) {
					this.scoreinfo = res.data;
					this.commentLastPage = res.data.list.last_page;
					this.commentNodata = !res.data.list.data.length;
					if (this.commentPage > 1) {
						this.commentList.push(...res.data.list.data);
						this.commentLoadingStatus = 'more';
					} else {
						this.commentList = res.data.list.data;
						if (res.data.list.data.length < 10) {
							this.commentLoadingStatus = 'noMore';
						} else {
							this.commentLoadingStatus = 'more';
						}
					}
				} else {
					this.commentList = [];
					this.commentNodata = true;
				}
			});
		},
		preImg(urls,index){
			uni.previewImage({
				urls:urls,
				current:index
			})
		}
	}
};
</script>

<style lang="scss">
.life-details {
	// header
	.navBar {
		position: relative;
		z-index: 999;
		/deep/.uni-navbar--border {
			border-color: transparent;
		}
	}
	/deep/ .uni-navbar {
		position: relative;
		z-index: 999;
	}
	// banner
	.swiper-wrap {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		height: 440upx;
		.swiper-card {
			height: 440upx;
		}
		.swiper-item {
			width: 100%;
			height: 100%;
			.swiper-img {
				width: 100%;
				height: 100%;
			}
		}
	}

	.btn-share {
		background-color: transparent;
		padding: 0;
		margin: 0;
		border-color: transparent;
		line-height: 1;
		&::after {
			border-color: transparent;
		}
	}
	// card info
	.card-info {
		box-shadow: 0px 0px 20upx 0px rgba(176, 176, 176, 0.15);
		border-radius: 12upx;
		margin: 0 30upx;
		position: relative;
		padding: 20upx;
		margin-top: 290upx;
		.location-gray-icon {
			position: relative;
			top: 2upx;
		}
		.map-navigation-wrap {
			position: relative;
			.address {
				padding-right: 110upx;
				white-space: normal;
			}
			.navigation-btn {
				position: absolute;
				top: 50%;
				transform: translateY(-50%);
				right: 0;
				color: #2828ff;
				display: flex;
				flex-direction: column;
				align-items: center;
				// .map-navigation-icon {
				// 	width: 40upx;
				// 	height: 36upx;
				// }
			}
		}
		.tags {
			.tag {
				margin: 15upx 10upx 0 0;
			}
		}
	}
	// tab 栏
	.tab-wrap {
		height: 88upx;
		.tab-item {
			position: relative;
			height: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			transition: all 0.2s;
			&:after {
				content: '';
				width: 32upx;
				height: 4upx;
				background: transparent;
				border-radius: 2upx;
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				bottom: 0;
			}
			&.active {
				font-weight: bold;
				font-size: 36upx;
				&:after {
					background: rgba(38, 212, 153, 1);
				}
			}
		}
	}
	// list card
	.list-card {
		box-shadow: 0px 0px 20upx 0px rgba(176, 176, 176, 0.15);
		border-radius: 12upx;
		margin: 20upx 30upx;
		.list-header-wrap {
			padding: 30upx 20upx;
			.list-header {
				.header-tag {
					background: #defbf2;
					color: #26d499;
				}
			}
		}
		.list {
			border-top: 2upx solid #ebebeb;
			padding: 20upx;
			.list-item {
				.list-item-img {
					width: 120upx;
					height: 120upx;
					border-radius: 8upx;
				}
			}
		}
	}
	// 评分
	.rating-wrap {
		border-top: 2upx solid #ebebeb;
		background: #f5f5f5;
		.comments-wrap {
			margin-top: 20upx;
			.avatar {
				width: 56upx;
				height: 56upx;
				border-radius: 50%;
			}
		}
	}
	// 商家信息卡片
	.shops-card-wrap {
		border-top: 2upx solid #ebebeb;
	}
	.shops-card {
		box-shadow: 0px 0px 10upx 0px rgba(152, 152, 152, 0.1);
		border-radius: 20upx;
		.item:last-child:after {
			border-bottom: 0;
		}
	}
	// 日历弹窗
	.calendarPopup {
		.popup-container {
			border-radius: 20upx 20upx 0 0;
		}
		.calendar-confirm-btn {
			padding: 30upx 95upx 60upx 95upx;
			background-color: #ffffff;
			// .btn {
			// 	background: #26D499;
			// 	color: #FFFFFF;
			// }
		}
	}
	// 弹窗详情
	.detailsPopup {
		.popup-close-icon {
			position: absolute;
			top: 15upx;
			right: 15upx;
			font-size: 48upx;
			color: #cccccc;
		}
		.popup-container {
			.popup-swiper-wrap {
				height: 404upx;
				padding: 0 30upx;
				border-radius: 20upx;
				overflow: hidden;
				position: relative;
				.swiper-dots {
					position: absolute;
					right: 50upx;
					bottom: 20upx;
					width: 80upx;
					height: 36upx;
					background: rgba(51, 51, 51, 1);
					opacity: 0.6;
					border-radius: 18upx;
					color: #ffffff;
					display: flex;
					align-items: center;
					justify-content: center;
				}
				.popup-swiper {
					width: 100%;
					height: 100%;
					.swiper-item {
						width: 100%;
						height: 100%;
						.popup-details-img {
							width: 100%;
							height: 100%;
						}
					}
				}
			}
		}
		// 操作条
		.popup-actions {
			height: 100upx;
			box-shadow: 0px 0px 10upx 0px rgba(235, 235, 235, 0.59);
			.popup-btn {
				flex: 0 0 215upx;
			}
		}
	}
}
.images{
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	margin-top: 20rpx;
	.img{
		width: 140rpx;
		height: 140rpx;
		margin-right: 10rpx;
		margin-bottom: 10rpx;
		image{
			width: 140rpx;
			height: 140rpx;
			border-radius: 8rpx;
		}
	}
}
</style>
