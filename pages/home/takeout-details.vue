<template>
	<view v-if="info" class="takeout-details">
		<block v-if="!showFoodDetail">
			<!-- 导航栏 -->
			<uni-nav-bar class="navBar" :title="title" leftIcon="back" color="#fff" :statusBar="true" :fixed="true" :shadow="false" @clickLeft="clickLeft" :border="false"></uni-nav-bar>

			<!-- 背景 -->
			<view class="header-bg"></view>

			<view class="container">
				<!-- 店铺信息 -->
				<view class="storeinfo margin-lr bg-white">
					<view class="flex">
						<image class="store-img" :src="info.store_avatar_path" mode="aspectFill"></image>
						<view class="flex-sub overflow flex flex-direction justify-between">
							<view class="text-df text-bold flex justify-between align-center overflow">
								<text class="text-cut text-black">{{ info.store_name }}</text>
								<view class="text-xxl flex align-center">
									<text @click="collect" class="cuIcon-favorfill margin-lr" :class="!!info.is_collect ? 'text-yellow' : 'text-ccc'"></text>
									<!-- <text @click="clipboard" class="cuIcon-share text-ccc"></text> -->
									<button class="btn-share" open-type="share"><text @click="clipboard" class="cuIcon-share text-ccc"></text></button>
								</view>
							</view>
							<view class="">起送￥{{ info.send_fee }} | 配送费￥{{ info.delive_fee }}</view>
							<view class="">营业时间：{{ info.manage_time }}</view>
						</view>
					</view>
					<view class="margin-top-xs">
						<text class="notice-bg">公告：{{ info.notice }}</text>
					</view>
					<view class="coupons-tags">
						<view @click="couponReceive(em.id)" v-for="(em, i) in coupons" :key="i" class="coupon-wrap">
							<image src="/static/coupon-long.png" class="coupon-img"></image>
							<view class="coupon-txt">
								<text>{{ tagsTxt(em) }}</text>
								<text class="coupon-dashed"></text>
								<text>领取</text>
							</view>
						</view>
					</view>
				</view>

				<!-- tab 栏 -->
				<view class="tabs">
					<block v-if="!isShowSearch">
						<view class="tab-wrap grid col-3 text-lg">
							<view @click="changeTab(0)" class="tab flex justify-center align-center" :class="currentTab === 0 ? 'text-xl text-bold active' : ''">分类</view>
							<view @click="changeTab(1)" class="tab flex justify-center align-center" :class="currentTab === 1 ? 'text-xl text-bold active' : ''">评分</view>
							<view @click="changeTab(2)" class="tab flex justify-center align-center" :class="currentTab === 2 ? 'text-xl text-bold active' : ''">商家</view>
						</view>
						<view @click="toSearch" class="search text-xl flex align-center padding-right-lg"><text class="cuIcon-search"></text></view>
					</block>
					<block v-if="isShowSearch">
						<view class="search-bar">
							<uni-search-bar
								@cancel="cancelSearch"
								@input="inputChange"
								cancelButton="always"
								class="search-box"
								clearButton="none"
								placeholder="请输入搜索内容"
								:radius="28"
							></uni-search-bar>
						</view>
					</block>
				</view>

				<!-- 菜品 -->
				<block v-if="currentTab === 0">
					<view class="VerticalBox">
						<scroll-view class="VerticalNav nav" scroll-y scroll-with-animation :scroll-top="verticalNavTop" :style="style">
							<view
								class="cu-item text-grey padding-lr-xs"
								:class="index == tabCur ? 'text-black cur' : ''"
								v-for="(item, index) in list"
								:key="index"
								@tap="TabSelect"
								:data-id="index"
							>
								<text>{{ item.cate_title }}</text>
								<view v-if="item.count" class="badge-absolute cu-tag badge">{{ item.count }}</view>
							</view>
						</scroll-view>
						<scroll-view
							class="VerticalMain"
							scroll-with-animation
							:style="style"
							:scroll-into-view="'main-' + mainCur"
							@scroll="VerticalMain"
							:scroll-anchoring="true"
							@scrolltoupper="scrolltoupper"
							@scrolltolower="scrolltolower"
							:scroll-y="scrollEable"
						>
							<view class="" v-for="(item, index) in list" :key="index" :id="'main-' + index">
								<view class="padding-tb-sm padding-lr bg-fff">{{ item.cate_title }}</view>
								<view class="food-list padding-lr">
									<view @click="navFoodDetail(em.id, em, index)" v-for="(em, i) in item.list" :key="i" class="food-item flex align-center">
										<image class="food-img" :src="em.goods_img_path" mode="aspectFill"></image>
										<view class="food-right flex-sub flex flex-direction justify-between overflow">
											<view class="text-lg text-cut">{{ em.goods_name }}</view>
											<view class="text-gray">月售{{ em.sales_num + em.goods_unit }}</view>
											<view class="flex justify-between align-center">
												<view class="text-xl text-red">￥{{ em.goods_price }}</view>
												<view class="amount-wrap flex align-center">
													<block v-if="em.count">
														<text @click.stop="reduce(em, index)" class="reduce"></text>
														<text class="padding-lr-sm text-lg">{{ em.count }}</text>
													</block>
													<text @click.stop="add(em, index)" class="add cuIcon-roundaddfill text-red"></text>
												</view>
											</view>
										</view>
									</view>
								</view>
							</view>
						</scroll-view>
					</view>
				</block>

				<!-- 评分 -->
				<block v-if="currentTab === 1">
					<view class="rating-wrap padding-tb-sm">
						<view class="rating-score bg-white flex align-center">
							<view class="flex-twice overall-rating flex flex-direction align-center">
								<text class="text-yellow text-xl text-bold">{{ parseFloat(scoreinfo.com_star).toFixed(1) }}分</text>
								<text class="text-df padding-tb-xs">综合评分</text>
							</view>
							<view class="flex-treble">
								<view class="flex align-center justify-center">
									<text class="padding-right-sm">菜品味道</text>
									<rate :current="Number(parseFloat(scoreinfo.star).toFixed(1))" :size="18" :hollow="true" active="#FFD200" :disabled="true"></rate>
								</view>
								<view class="flex align-center justify-center">
									<text class="padding-right-sm">商家服务</text>
									<rate :current="Number(parseFloat(scoreinfo.server_star).toFixed(1))" :size="18" :hollow="true" active="#FFD200" :disabled="true"></rate>
								</view>
								<view class="flex align-center justify-center">
									<text class="padding-right-sm">配送服务</text>
									<rate :current="Number(parseFloat(scoreinfo.deliver_star).toFixed(1))" :size="18" :hollow="true" active="#FFD200" :disabled="true"></rate>
								</view>
							</view>
						</view>
					</view>
					<view class="all-comments">
						<view class="" style="height: 20upx;background-color: #CCCCCC;"></view>
						<view class="comment-title flex align-center padding-lr solid-bottom" style="height: 80upx;box-sizing: border-box;">
							<image src="../../static/comment-icon.png" class="comment-icon" mode=""></image>
							<text class="padding-lr-sm text-lg">全部评论({{ scoreinfo.counts }})</text>
						</view>
						<scroll-view scroll-y class="comments-scroll-view" :style="commentStyle" @scrolltolower="scrolltolowerComment">
							<view class="list bg-white padding-left">
								<view v-for="(item, index) in commentList" :key="index" class="list-item padding-tb padding-right" :class="index !== 0 ? 'solid-top' : ''">
									<view class="flex justify-between align-center">
										<view class="flex-sub flex overflow">
											<image :src="item.icon" class="avatar" mode=""></image>
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
						</scroll-view>
					</view>
				</block>

				<!-- 商家 -->
				<block v-if="currentTab === 2">
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
				</block>
			</view>
		</block>
		<block v-if="showFoodDetail">
			<view v-if="foodinfo" class="food-details-body">
				<text @click="cancelShowFoodDetail" class="cuIcon-roundrightfill"></text>
				<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" indicator-color="#fff" indicator-active-color="#14C98C" circular>
					<swiper-item v-for="(item, index) in foodinfo.banner_image_text" :key="index">
						<view class="swiper-item"><image :src="item" mode="aspectFill" class="food-banner"></image></view>
					</swiper-item>
				</swiper>

				<view class="foodinfo-wrap">
					<view class="food-name-wrap">
						<text class="food-name">{{ foodinfo.goods_name }}</text>
					</view>
					<view class="food-sales">月销{{ foodinfo.sales_num }}</view>
					<view class="food-price text-price">{{ foodinfo.goods_price }}</view>
					<view class="food-buy-wrap">
						<view class="food-packing">包装费￥{{ foodinfo.box_fee }}/份</view>
						<button @click="add(food_em, food_index)" class="btn-foodbuy" size="mini">
							<text class="cuIcon-add"></text>
							加入购物车
						</button>
					</view>
				</view>

				<view class="food-details-wrap">
					<view class="food-tabs">
						<view class="food-tab active">详情</view>
						<view @click="bindToView" class="food-tab">评价</view>
					</view>
					<view class="food-desc" id="food-desc">
						<view class="food-desc-txt">{{ foodinfo.goods_detail }}</view>
						<image v-for="(item, index) in foodinfo.detail_image_text" :key="index" :src="item" mode="widthFix" class="food-desc-img"></image>
					</view>
					<view class="food-evaluate" id="food-evaluate">
						<view class="food-evaluate-title">
							<text class="evaluate-label">商品评价</text>
							<text class="evaluate-percent">好评率{{ foodinfo.prasie_rate }}</text>
						</view>
						<view class="evaluate-list">
							<view v-for="(item, index) in evaluateList" :key="index" class="evaluate-list-item">
								<image :src="item.icon" mode="aspectFill" class="evaluate-avatar"></image>
								<view class="evaluate-right">
									<view class="evaluate-info">
										<view class="evaluate-user">
											<view class="evaluate-username">{{ item.nickname }}</view>
											<rate :current="item.star" :size="16" :hollow="true" active="#FFD200" :disabled="true"></rate>
										</view>
										<view class="evaluate-time">{{ item.addtime }}</view>
									</view>
									<view class="evaluate-txt">{{ item.content }}</view>
									<view class="evaluate-imgs"><image v-for="(em, i) in item.images" :key="i" 
									:src="em" mode="aspectFill" @click="preImg(item.images,i)" class="evaluate-img"></image></view>
								</view>
							</view>
							<tips v-if="nodata" :fixed="false" imgUrl="/static/img_nodata.png">暂无评价</tips>
							<view v-if="isShowMore" class="view-more"><button @click="viewMore" type="default" class="btn-more">查看更多评价</button></view>
						</view>
					</view>
				</view>
			</view>
		</block>
		<!-- 购物车 -->
		<view v-if="currentTab === 0" class="shop-cart-wrapper">
			<view class="content flex">
				<view @click="openCartPopup" class="content-left flex-sub flex">
					<view class="logo-wrapper margin-lr">
						<image src="../../static/shop-cart-icon.png" class="shop-cart-icon" mode=""></image>
						<view v-if="cartInfo.goods_num" class="badge-absolute cu-tag badge">{{ cartInfo.goods_num }}</view>
					</view>
					<view v-if="cartInfo.goods_amount" class="flex-sub text-xxl flex align-center">￥{{ cartInfo.goods_amount }}</view>
				</view>
				<button @click="toPay" class="content-right bg-red text-xl" :disabled="!cartId" type="">去结算</button>
				<view class="ball-container"></view>
			</view>
		</view>

		<!-- 购物车弹窗 -->
		<uni-popup class="cart-popup" ref="cartPopup" type="bottom">
			<view class="container">
				<view class="cartPopup-header padding-lr padding-tb-sm flex justify-between align-center text-df">
					<view class="">已选商品</view>
					<view @click="emptyCart" class="text-gray">清空购物车</view>
				</view>
				<scroll-view scroll-y class="cart-scroll-wrapper">
					<view class="list">
						<view v-for="(item, index) in cartInfo.goods" :key="index" class="list-item solid-bottom bg-fff padding-lr padding-tb-xs flex justify-between align-center">
							<view class="flex-sub flex">
								<image class="cart-img" :src="item.goods_img_path" mode=""></image>
								<view class="flex-sub flex flex-direction justify-between overflow padding-lr-sm">
									<view class="text-df text-cut">{{ item.goods_name }}</view>
									<view class="text-lg text-red text-price">{{ item.goods_price }}</view>
								</view>
							</view>
							<view class="amount-wrap flex align-center">
								<text @click="cartReduce(item)" class="reduce"></text>
								<text class="padding-lr-sm text-lg">{{ item.num }}</text>
								<text @click="cartAdd(item)" class="add cuIcon-roundaddfill text-red"></text>
							</view>
						</view>
					</view>
				</scroll-view>
			</view>
		</uni-popup>

		<!-- 规格选择弹窗 -->
		<uni-popup class="options-popup" ref="optionsPopup" type="center">
			<view class="options-container">
				<view @click="optionsClose" class="options-close cuIcon-close"></view>
				<view class="options-title padding-tb text-xl text-bold flex justify-center">{{ selectedItem.goods_name }}</view>
				<view class="options-content padding-lr">
					<view class="text-df">规格选择</view>
					<view class="padding-tb">
						<button
							@click="optionsSelected(item, index)"
							v-for="(item, index) in selectedItem.goods_sku"
							:key="index"
							class="cu-btn round margin-bottom-sm margin-right-sm"
							:class="selectedItem.optionsId == item.id ? 'bg-red' : ''"
						>
							{{ item.sku }}
						</button>
					</view>
				</view>
				<view class="options-bottom padding-lr padding-tb-sm bg-ebebeb flex justify-between align-center">
					<view v-if="!(selectedItem.optionsIndex === '' || selectedItem.optionsIndex == undefined)" class="text-price text-xxl text-red">
						{{ selectedItem.goods_sku[selectedItem.optionsIndex].price }}
					</view>
					<block>
						<button v-if="!currentSpecNum()" @click="addCart" class="cu-btn round bg-red">加入购物车</button>
						<view v-else class="amount-wrap flex align-center" style="height: 64upx;">
							<text @click="reduceCart" class="reduce"></text>
							<text class="padding-lr-sm text-lg">{{ currentSpecNum() }}</text>
							<text @click="addCart" class="add cuIcon-roundaddfill text-red"></text>
						</view>
					</block>
				</view>
			</view>
		</uni-popup>

		<login-modal></login-modal>
	</view>
</template>

<script>
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import rate from '@/components/rate/rate.vue';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import tuiTips from '@/components/tips/tips.vue';
import common from '@/utils/mixins/common.js';
import { mapGetters, mapActions } from 'vuex';
const thorui = require('@/components/utils/clipboard.thorui.js');
import { debounce } from '@/utils/util.js';
import LoginModal from '@/components/login/login-modal.vue';

export default {
	mixins: [common],
	components: {
		uniNavBar,
		uniSearchBar,
		uniPopup,
		rate,
		uniLoadMore,
		tuiTips,
		LoginModal
	},
	data() {
		return {
			id: '',
			info: '',
			coupons: [], // 优惠券tags
			currentTab: 0, // 0---菜品 1---评分 2---商家
			list: [],
			searchCopyList: [], // 搜索数据副本
			scoreinfo: {}, // 评分信息
			commentPage: 1,
			commentLastPage: 1,
			commentNodata: false,
			commentList: [], // 评论列表
			commentLoadingStatus: 'more',
			tabCur: 0,
			mainCur: 0,
			verticalNavTop: 0,
			load: true,
			isShowSearch: false,
			goodsCategory: [],
			selectedItem: {}, // 选择商品信息
			curItemIndex: 1, // 当前商品下标
			selectedIndex: '', // 当前分类下标
			cartInfo: {}, // 购物车信息
			cartId: '', // 购物车id
			scrollEable: true,

			// 食物详情信息
			showFoodDetail: false,
			food_id: '',
			food_em: '',
			food_index: '',
			foodinfo: '',
			page: 1,
			lastPage: 1,
			nodata: false,
			evaluateList: []
		};
	},
	computed: {
		...mapGetters(['token', 'shareData', 'userinfo']),
		title() {
			return !!this.info.store_name ? this.info.store_name : '';
		},
		// 菜品
		style() {
			var StatusBar = this.StatusBar;
			var CustomBar = this.CustomBar;
			// #ifdef H5
			var style = `height: calc(100vh - ${CustomBar + StatusBar + 44}px);padding-bottom: 50px`;
			// #endif
			// #ifdef MP
			var style = `height: calc(100vh - ${StatusBar + 88}px);padding-bottom: 50px`;
			// #endif
			return style;
		},
		// 评分
		commentStyle() {
			var StatusBar = this.StatusBar;
			var CustomBar = this.CustomBar;
			// #ifdef H5
			var style = `height: calc(100vh - ${CustomBar + StatusBar + this.storeinfoHeight + 44}px);`;
			// #endif
			// #ifdef MP
			var style = `height: calc(100vh - ${StatusBar + 88}px);padding-bottom: 50px`;
			// #endif
			return style;
		},
		isShowMore() {
			return this.page < this.lastPage;
		}
	},
	onLoad(option) {
		this.id = option.id;
		this.getData(); //店铺信息
		this.getCoupons();
		this.getScore(); // 评分
		uni.showLoading({
			title: '加载中...',
			mask: true
		});
	},
	onShow() {
		this.getList(); //店铺商品
	},
	onReady() {
		uni.hideLoading();
	},
	onShareAppMessage() {
		return {
			title: this.shareData ? this.shareData.title : '',
			path: this.shareData && this.userinfo ? `/pages/home/takeout-details?invite_code=${this.userinfo.invite_code}&id=${this.id}` : ''
		};
	},
	methods: {
		...mapActions(['setLoginModal']),
		clickLeft() {
			let pages = getCurrentPages();
			if (pages.length > 1) {
				uni.navigateBack();
			} else {
				uni.switchTab({ url: '/pages/tabbar/home' });
			}
		},
		// 领取优惠券
		couponReceive(id) {
			if (!this.token) {
				this.setLoginModal(true);
				return;
			}
			this.$http.post('/api/service/receive_coupon', { coupon_id: id }).then(res => {
				if (res.code == 0) {
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
		},

		scrolltoupper() {
			uni.pageScrollTo({
				scrollTop: 0,
				duration: 150
			});
		},
		scrolltolower() {
			uni.pageScrollTo({
				scrollTop: 300,
				duration: 150
			});
		},

		// 评论 到底加载下一页面
		scrolltolowerComment() {
			this.commentLoadingStatus = 'loading';
			if (this.commentPage < this.commentLastPage) {
				this.commentPage++;
				this.getScore();
			} else {
				this.commentLoadingStatus = 'noMore';
			}
		},
		// 搜索
		inputChange: debounce(function(e) {
			var keywords = e.value;
			var searchList = [];
			var list = JSON.parse(JSON.stringify(this.searchCopyList));
			if (keywords && list.length) {
				for (var i = 0; i < list.length; i++) {
					var queryList = [];
					for (var j = 0; j < list[i].list.length; j++) {
						if (list[i].list[j].goods_name.indexOf(keywords) >= 0) {
							queryList.push(list[i].list[j]);
						}
					}
					if (queryList.length) {
						list[i].list = queryList;
						searchList.push(list[i]);
					}
				}
				this.list = searchList;
			}
		}, 1000),

		// 当前规格购买数量
		currentSpecNum() {
			return this.selectedItem['specNum' + this.selectedItem.optionsId];
		},
		// 清空购物车
		emptyCart() {
			this.$http.post('/api/takeout/truncate_shopcar', { cart_id: this.cartId }).then(res => {
				if (res.code == 0) {
					this.getCartList();
					this.$refs.cartPopup.close();
				}
			});
		},
		// 规格选择
		optionsSelected(item, index) {
			this.selectedItem.optionsIndex = index;
			this.selectedItem.optionsId = item.id;
			this.$set(this.list, this.selectedIndex, this.list[this.selectedIndex]);
			this.$forceUpdate();
		},
		// 规格弹窗关闭
		optionsClose() {
			this.$refs.optionsPopup.close();
		},
		// 添加按钮
		add(em, index) {
			if (!this.token) {
				this.setLoginModal(true);
				return;
			}
			em.optionsIndex = 0;
			em.optionsId = em.goods_sku[0].id; // 规格默认选择第一个的id
			this.selectedItem = em;
			this.selectedIndex = index;
			this.$set(this.list, this.selectedIndex, this.list[this.selectedIndex]);
			this.$refs.optionsPopup.open();
		},
		// 减按钮
		reduce(em, index) {
			em.optionsIndex = 0;
			em.optionsId = em.goods_sku[0].id; // 规格默认选择第一个的id
			this.selectedItem = em;
			this.selectedIndex = index;
			this.$set(this.list, this.selectedIndex, this.list[this.selectedIndex]);
			this.$refs.optionsPopup.open();
		},
		// 购物车商品删除
		reduceCart() {
			this.selectedItem['specNum' + this.selectedItem.optionsId]--;
			uni.showLoading({ title: '删除中...', mask: true });
			this.$http.post('/api/takeout/delete_shopcar_goods', { cart_id: this.cartId, goods_id: this.selectedItem.id, sku_id: this.selectedItem.optionsId }).then(res => {
				uni.hideLoading();
				if (res.code == 0) {
					this.getCartList();
					this.$refs.optionsPopup.close();
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			});
		},
		cartReduce(item) {
			uni.showLoading({ title: '删除中...', mask: true });
			this.$http.post('/api/takeout/delete_shopcar_goods', { cart_id: this.cartId, goods_id: item.goods_id, sku_id: item.sku_id }).then(res => {
				uni.hideLoading();
				if (res.code == 0) {
					this.getCartList();
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			});
		},
		// 加入购物车
		addCart() {
			uni.showLoading({ title: '提交中...', mask: true });
			this.$http.post('/api/takeout/shopcar', { store_id: this.id, goods_id: this.selectedItem.id, sku_id: this.selectedItem.optionsId }).then(res => {
				uni.hideLoading();
				if (res.code == 0) {
					this.getCartList();
					this.$refs.optionsPopup.close();
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			});
		},
		cartAdd(item) {
			uni.showLoading({ title: '提交中...', mask: true });
			this.$http.post('/api/takeout/shopcar', { store_id: this.id, goods_id: item.goods_id, sku_id: item.sku_id }).then(res => {
				uni.hideLoading();
				if (res.code == 0) {
					this.getCartList();
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			});
		},
		// 购物车列表
		getCartList() {
			this.$http.post('/api/takeout/shopcar_detail', { store_id: this.id }).then(res => {
				if (res.code == 0) {
					this.cartInfo = res.data;
					this.cartId = res.data.id;
					let count, goodCount;
					this.list.forEach(item => {
						count = 0;
						item.list.forEach(em => {
							goodCount = 0;
							em.goods_sku.forEach(spec => {
								em['specNum' + spec.id] = 0;
							});
							res.data.goods.forEach(e => {
								if (em.id == e.goods_id) {
									goodCount += e.num;
									count += e.num;
									em['specNum' + e.sku_id] = e.num;
								}
							});
							em.count = goodCount;
						});
						item.count = count;
					});
				} else {
					this.cartInfo = {};
					this.cartId = '';
					this.list.forEach(item => {
						item.count = 0;
						if (item.list) {
							item.list.forEach(em => {
								em.count = 0;
								em.goods_sku.forEach(e => {
									em['specNum' + e.id] = 0;
								});
							});
						}
					});
				}
			});
		},

		// 优惠券tags
		tagsTxt(item) {
			if (item) {
				if (item.type == 1) {
					return item.condition + '减' + item.discount;
				} else if (item.type == 2) {
					return '无门槛' + item.discount;
				} else {
					return '首单减' + item.discount;
				}
			} else {
				return '';
			}
		},
		// 店铺详情
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
		// 店铺商品分类
		getList() {
			this.$http.post('/api/takeout/goods_takeout_list', { store_id: this.id }).then(res => {
				if (res.code == 0) {
					res.data.forEach((em, i) => {
						em.id = i;
					});
					this.list = res.data;
					this.searchCopyList = res.data;
					if (this.token) {
						this.getCartList();
					}
				} else {
					this.list = [];
				}
			});
		},
		// 评分
		getScore() {
			// store_type 店铺类型1：外卖，2：生活
			this.$http.post('/api/service/store_praise', { store_id: this.id, store_type: 1, page: this.commentPage }).then(res => {
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
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
					this.commentList = [];
					this.commentNodata = true;
				}
			});
		},
		// 去结算
		toPay() {
			if (Number(this.cartInfo.goods_amount) < Number(this.info.send_fee)) {
				uni.showToast({
					title: '还差' + (Number(this.info.send_fee) - Number(this.cartInfo.goods_amount)).toFixed(2) + '起送',
					icon: 'none'
				});
				return;
			}
			uni.navigateTo({
				url: `/pages/home/takeout-order-confirm?cart_id=${this.cartId}&store_id=${this.id}`
			});
		},
		toSearch() {
			this.isShowSearch = true;
		},
		// 取消搜索
		cancelSearch(e) {
			this.isShowSearch = false;
			this.getList();
		},
		openCartPopup() {
			if (!this.token) {
				this.setLoginModal(true);
				return;
			}
			if (!this.$refs.cartPopup.showPopup) {
				this.$refs.cartPopup.open();
			} else {
				this.$refs.cartPopup.close();
			}
		},
		changeTab(val) {
			val !== this.currentTab && (this.currentTab = val);
		},
		TabSelect(e) {
			this.tabCur = e.currentTarget.dataset.id;
			this.mainCur = e.currentTarget.dataset.id;
			this.verticalNavTop = (e.currentTarget.dataset.id - 1) * 50;
		},
		VerticalMain(e) {
			// #ifdef MP-ALIPAY
			return false; //支付宝小程序暂时不支持双向联动
			// #endif
			let that = this;
			let tabHeight = 0;
			if (this.load) {
				for (let i = 0; i < this.list.length; i++) {
					let view = uni.createSelectorQuery().select('#main-' + this.list[i].id);
					view
						.fields(
							{
								size: true
							},
							data => {
								this.list[i].top = tabHeight;
								tabHeight = tabHeight + data.height;
								this.list[i].bottom = tabHeight;
							}
						)
						.exec();
				}
				this.load = false;
			}
			let scrollTop = e.detail.scrollTop + 10;
			for (let i = 0; i < this.list.length; i++) {
				if (scrollTop > this.list[i].top && scrollTop < this.list[i].bottom) {
					this.verticalNavTop = (this.list[i].id - 1) * 50;
					this.tabCur = this.list[i].id;
					return false;
				}
			}
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
			// uni.navigateTo({
			// 	url: '/pages/home/takeout-share'
			// });
			// #ifdef H5
			let path = location.href;
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

		// 食物详情信息
		cancelShowFoodDetail() {
			this.showFoodDetail = false;
		},
		async navFoodDetail(id, em, index) {
			this.food_id = id;
			this.food_em = em;
			this.food_index = index;
			uni.showLoading({ title: '加载中...', mask: true });
			this.showFoodDetail = true;
			await this.getFoodDetails(id);
			await this.getEvaluateList(id);
			uni.hideLoading();
		},
		async getFoodDetails() {
			let res = await this.$http.post('/api/takeout/goods_takeout_detail', { goods_id: this.food_id }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
			if (res.code == 0) {
				this.foodinfo = res.data;
			}
		},
		async getEvaluateList() {
			let res = await this.$http.post('/api/takeout/takeout_praise_list', { goods_id: this.food_id, limit: 5, page: this.page });
			if (res.code == 0) {
				this.lastPage = res.data.last_page;
				this.nodata = !res.data.data.length;
				if (this.page > 1) this.evaluateList.push(...res.data.data);
				else this.evaluateList = res.data.data;
			}
		},
		bindToView() {
			const query = uni.createSelectorQuery();
			query.select('#food-evaluate').boundingClientRect();
			query.selectViewport().scrollOffset();
			query.exec(res => {
				if (res[0] && res[1]) {
					uni.pageScrollTo({
						scrollTop: res[0].top + res[1].scrollTop,
						duration: 300
					});
				}
			});
		},
		viewMore() {
			this.page++;
			this.getEvaluateList();
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
<style scoped>
/deep/.cu-custom .cu-bar {
	z-index: 99;
	background: linear-gradient(94deg, rgba(20, 201, 140, 1), rgba(72, 232, 178, 1));
	box-shadow: none;
	border: 0;
}

/deep/ .uni-navbar__header.uni-navbar__content_view {
	background: linear-gradient(94deg, rgba(20, 201, 140, 1), rgba(72, 232, 178, 1));
}
</style>
<style lang="scss" scoped>
.takeout-details {
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
	// 数量加减
	.amount-wrap {
		.reduce {
			width: 36upx;
			height: 36upx;
			border-radius: 50%;
			border: 2upx solid rgba(204, 204, 204, 1);
			position: relative;
			&:after {
				content: '';
				width: 20upx;
				height: 4upx;
				background: rgba(204, 204, 204, 1);
				border-radius: 2upx;
				position: absolute;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
			}
		}
		.add {
			font-size: 44upx;
			height: 44upx;
		}
	}
	// header-背景图
	.header-bg {
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		z-index: -1;
		height: 240upx;
		background: linear-gradient(94deg, rgba(20, 201, 140, 1), rgba(72, 232, 178, 1));
	}
	.container {
		// 店铺信息
		.storeinfo {
			box-shadow: 0px 0px 20upx 0px rgba(176, 176, 176, 0.15);
			border-radius: 12upx;
			background: #ffffff;
			padding: 25upx;
			.notice-bg {
				background-color: #26d499;
				color: #ffffff;
				padding: 10rpx;
				border-radius: 10rpx;
			}
			.store-img {
				width: 160upx;
				height: 140upx;
				border-radius: 8upx;
				margin-right: 20upx;
			}
			.coupons-tags {
				display: flex;
				flex-wrap: wrap;
				.coupon-wrap {
					position: relative;
					margin-top: 10upx;
					margin-right: 15upx;
					overflow: hidden;
					.coupon-img {
						width: 196upx;
						height: 48upx;
					}
					.coupon-txt {
						position: absolute;
						left: 20upx;
						top: 40%;
						transform: translateY(-50%);
						color: #ffffff;
						width: 100%;
						padding-right: 35upx;
						display: flex;
						align-items: center;
						justify-content: space-between;
						.coupon-dashed {
							width: 4upx;
							height: 48upx;
							border-right: 2upx dashed #ffffff;
						}
					}
				}
			}
			.tags {
				.tag {
					margin: 10upx 10upx 0 0;
				}
			}
		}
		// tab 栏
		.tabs {
			height: 88upx;
			position: relative;
			border-bottom: 2upx solid #f7f7f7;
			box-sizing: border-box;
			.tab-wrap {
				padding-right: 100upx;
				height: 100%;
			}
			.tab {
				position: relative;
				transition: all 0.2s;
				&:after {
					content: '';
					width: 32upx;
					height: 4upx;
					background: transparent;
					border-radius: 2upx;
					position: absolute;
					bottom: 0;
					left: 50%;
					transform: translateX(-50%);
				}
				&.active {
					&:after {
						background: rgba(38, 212, 153, 1);
					}
				}
			}
			.search {
				position: absolute;
				right: 0;
				top: 0;
				height: 88upx;
			}
			.search-bar {
				display: flex;
				align-items: center;
				justify-content: center;
				width: 100%;
				height: 88rpx;
			}
			.search-box {
				flex: 1;
				padding: 0 30rpx;
				/deep/.uni-searchbar {
					padding: 0 30rpx;
					width: 100%;
					display: flex;
					align-items: center;
				}
				/deep/.uni-searchbar__box {
					height: 100%;
					border: 0;
					flex: 1;

					.uni-searchbar__box-search-input {
						font-size: 28upx;
						line-height: 28upx;
					}
					.uni-searchbar__text-placeholder {
						font-size: 28upx;
						line-height: 28upx;
					}
				}
				/deep/.uni-searchbar__cancel {
					line-height: 56upx;
				}
			}
		}
		// 菜品
		.VerticalBox {
			display: flex;
			.VerticalNav.nav {
				width: 200upx;
				white-space: initial;
				.cu-item {
					width: 100%;
					text-align: center;
					background-color: #f7f7f7;
					margin: 0;
					border: none;
					height: 90upx;
					position: relative;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
					white-space: normal !important;
					overflow: hidden;
					text-overflow: ellipsis;
					line-height: 1.6;
					justify-content: center;
					align-items: center;
					&.cur {
						background: #ffffff;
					}
					.badge-absolute {
						position: absolute;
						top: 10upx;
						right: 10upx;
						line-height: 9px !important;
					}
				}
			}
			.VerticalMain {
				background-color: #ffffff;
				overflow: hidden;
				flex: 1;
				.food-list {
				}
				.food-item {
					margin-bottom: 20upx;
					.food-img {
						width: 150upx;
						height: 150upx;
						border-radius: 20upx;
						margin-right: 20upx;
					}
					.food-right {
						height: 150upx;
					}
				}
			}
		}

		// 商家信息卡片
		.shops-card {
			box-shadow: 0px 0px 10upx 0px rgba(152, 152, 152, 0.1);
			border-radius: 20upx;
			.item:last-child:after {
				border-bottom: 0;
			}
		}
		// 评分
		.rating-wrap {
			height: 160upx;
			box-sizing: border-box;
			.overall-rating {
				position: relative;
				&:after {
					content: '';
					position: absolute;
					right: 0;
					top: 50%;
					transform: translateY(-50%);
					width: 2upx;
					height: 80upx;
					background: rgba(235, 235, 235, 1);
				}
			}
		}
		.all-comments {
			position: relative;
			.avatar {
				width: 56upx;
				height: 56upx;
				border-radius: 50%;
			}
		}
	}
	// 购物车
	.shop-cart-wrapper {
		position: fixed;
		left: 0;
		bottom: 0;
		width: 100%;
		height: 100upx;
		z-index: 999;
		.content {
			background: #ffffff;
			.content-left {
				.logo-wrapper {
					position: relative;
					width: 100upx;
					height: 100upx;
					top: -20upx;
					.shop-cart-icon {
						width: 100%;
						height: 100%;
					}
					.badge-absolute {
						position: absolute;
						top: 0px;
						right: 0upx;
					}
				}
			}
			.content-right {
				flex: 0 0 215upx;
				width: 215upx;
				height: 100upx;
				line-height: 100upx;
				border-radius: 0;
				&::after {
					border: 0;
				}
			}
		}
	}
	// 购物车弹窗及列表
	.cart-popup {
		.container {
			padding-bottom: 140upx;
			background: #f2f2f2;
			.cart-scroll-wrapper {
				max-height: 600upx;
			}
			.cart-img {
				width: 88upx;
				height: 88upx;
				border-radius: 20upx;
			}
		}
	}
	// 规格弹窗
	.options-popup {
		z-index: 9999;
		.options-container {
			width: 690upx;
			box-shadow: 0px 0px 10px 0px rgba(235, 235, 235, 0.59);
			border-radius: 20upx;
			position: relative;
			background-color: #ffffff;
			overflow: hidden;
			.options-close {
				position: absolute;
				right: 30upx;
				top: 30upx;
				font-size: 44upx;
				color: #cccccc;
				font-weight: bold;
			}
		}
	}
}

// 食物详情信息
.food-details-body {
	background-color: #f2f2f2;
	.cuIcon-roundrightfill {
		position: absolute;
		top: 50rpx;
		left: 20rpx;
		z-index: 9;
		transform: rotate(180deg);
		color: #8f8c89;
		font-size: 56rpx;
	}
	swiper {
		width: 100%;
		height: 566rpx;
		position: relative;
		.swiper-item,
		.food-banner {
			width: 100%;
			height: 100%;
		}
	}

	.foodinfo-wrap {
		background-color: #ffffff;
		padding: 15rpx 30rpx;
		.food-name-wrap {
			display: flex;
			align-items: center;
		}
		.food-name {
			font-size: 34rpx;
			font-weight: bold;
		}
		.group-num {
			flex-shrink: 0;
			margin-top: 8rpx;
			align-self: flex-start;
			margin-left: 15rpx;
			padding: 2rpx 10rpx 5rpx;
			background: linear-gradient(180deg, rgba(20, 201, 140, 1) 0%, rgba(72, 232, 178, 1) 100%);
			border-radius: 5rpx;
			color: #ffffff;
			font-size: 20rpx;
		}
		.food-sales {
			font-size: 24rpx;
			color: #989898;
			padding: 10rpx 0;
		}
		.food-price {
			font-size: 42rpx;
			color: #ff3e47;
			font-weight: bold;
		}
		.food-buy-wrap {
			display: flex;
			justify-content: space-between;
			align-items: center;
		}
		.food-packing {
			font-size: 24rpx;
			color: #989898;
		}
		.btn-foodbuy {
			font-size: 24rpx;
			color: #ffffff;
			border-radius: 27rpx;
			background-color: #ff3e47;
			margin: 0;
		}
		.cuIcon-add {
			margin-right: 10rpx;
		}
	}

	.food-details-wrap {
		margin-top: 20rpx;
		padding-bottom: 100rpx;

		.food-tabs {
			padding: 0 30rpx;
			display: flex;
			align-items: center;
			background-color: #ffffff;
		}
		.food-tab {
			height: 80rpx;
			line-height: 80rpx;
			position: relative;
			margin-right: 60rpx;
			font-size: 32rpx;
			&:after {
				content: '';
				width: 37rpx;
				height: 4rpx;
				background: transparent;
				position: absolute;
				left: 50%;
				bottom: 0;
				transform: translateX(-50%);
			}
		}
		.food-tab.active {
			font-size: 34rpx;
			font-weight: bold;
			&::after {
				background: rgba(255, 62, 71, 1);
			}
		}

		.food-desc {
			background-color: #ffffff;
			.food-desc-txt {
				padding: 20rpx 30rpx;
				font-size: 28rpx;
				color: #666;
			}
		}

		.food-desc-img {
			width: 100%;
			vertical-align: middle;
		}

		.food-evaluate {
			margin-top: 20rpx;
			padding: 0 30rpx;
			background-color: #ffffff;
			.food-evaluate-title {
				display: flex;
				align-items: center;
				justify-content: space-between;
				height: 88rpx;
			}
			.evaluate-label {
				font-size: 34rpx;
				font-weight: bold;
			}
			.evaluate-percent {
				font-size: 26rpx;
				color: #666;
			}
			.evaluate-list {
			}
			.evaluate-list-item {
				padding-top: 20rpx;
				padding-bottom: 10rpx;
				display: flex;
				border-bottom: 2rpx solid #ebebeb;
			}
			.evaluate-avatar {
				width: 74rpx;
				height: 74rpx;
				border-radius: 50%;
				margin-right: 10rpx;
			}
			.evaluate-right {
				flex: 1;
				overflow: hidden;
			}
			.evaluate-info {
				display: flex;
				align-items: center;
			}
			.evaluate-user {
				flex: 1;
			}
			.evaluate-time {
				font-size: 22rpx;
				color: #999;
			}
			.evaluate-username {
				font-size: 30rpx;
			}
			.evaluate-txt {
				font-size: 24rpx;
				padding: 10rpx 0;
			}
			.evaluate-imgs {
				display: flex;
				align-items: center;
				flex-wrap: wrap;
			}
			.evaluate-img {
				width: 140rpx;
				height: 140rpx;
				margin-right: 10rpx;
				margin-bottom: 10rpx;
			}
		}
		.view-more {
			// margin: 50rpx auto 30rpx;
			overflow: hidden;
			.btn-more {
				font-size: 24rpx;
				border-radius: 30rpx;
				color: #333;
				width: 220rpx;
				margin: 50rpx auto 30rpx;
				background-color: #ffffff;
				border: 2rpx solid #707070;
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
