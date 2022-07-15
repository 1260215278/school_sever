<template>
	<view class="home">
		<!-- 定位-搜索 -->
		<navigator url="/pages/common/locate-index?from=home" class="location-school flex align-center">
			<image class="location-icon" src="/static/locationIcon.png"></image>
			<view class="padding-left-sm padding-right-sm text-df">{{ schoolinfo ? schoolinfo.school_name : '' }}</view>
			<view class="triangle"></view>
		</navigator>
		<navigator url="/pages/home/home-search?from=takeout" class="search-bar">
			<view class="search-bar-input flex align-center justify-center padding-lr-sm bg-gray">
				<image class="search-icon" src="../../static/searchIcon.png" mode=""></image>
				<text class="padding-lr-sm text-gray">请输入要搜索内容</text>
			</view>
		</navigator>

		<!-- 轮播 -->
		<swiper
			class="swiper-card margin-tb-sm margin-lr square-dot"
			:indicator-dots="true"
			:autoplay="true"
			:interval="3000"
			:duration="1000"
			:circular="true"
			indicator-active-color="#0081ff"
		>
			<swiper-item @click="toBannerDetails(item)" v-for="(item, index) in banner" :key="index">
				<view class="swiper-item"><image :src="item.banner_path" mode="aspectFill"></image></view>
			</swiper-item>
		</swiper>

		<!-- 首页公告 -->
		<view class="horn-rolling-news">
			<image src="/static/horn.png" class="horn"></image>
			<swiper circular interval="10000" class="horn-swiper">
				<swiper-item v-for="(item, index) in noticeList" :key="index" class="horn-swiper-item">
					<view class="tui-notice horn-news-item" :class="[animation ? 'tui-animation' : '']">{{ item.affiche }}</view>
				</swiper-item>
			</swiper>
		</view>

		<!-- 分类菜单 -->
		<view class="category-menu grid col-5">
			<view @click="toCategoryList(item.title, item.id, item.url)" v-for="(item, index) in category" :key="index" class="flex flex-direction align-center padding-tb-sm">
				<image class="category-img" :src="item.icon_path" mode="aspectFill"></image>
				<text>{{ item.title }}</text>
			</view>
		</view>

		<!-- 广告 -->
		<view class="recommend-Ad padding-lr padding-tb-sm">
			<view v-if="!!ADup.length" class="up grid grid-square col-2 justify-between margin-bottom-sm">
				<image
					@click="toADDetails(item.store_id, item.store_status, item.is_groupbuy)"
					v-for="(item, index) in ADup"
					:key="index"
					:src="item.advertising_path"
					mode="aspectFill"
				></image>
			</view>
			<view v-if="!!ADdown.length" class="down grid grid-square col-3 justify-between margin-bottom-sm">
				<image
					@click="toADDetails(item.store_id, item.store_status, item.is_groupbuy)"
					v-for="(item, index) in ADdown"
					:key="index"
					:src="item.advertising_path"
					mode="aspectFill"
				></image>
			</view>
		</view>

		<!-- 优惠券 -->
		<navigator url="/pages/home/home-coupons" class="padding-lr"><image class="coupon-pic" src="../../static/coupon-pic.png" mode="aspectFill"></image></navigator>

		<!-- 列表 -->
		<view class="home-list padding-bottom-sm">
			<view class="grid col-2 text-center text-lg padding-tb">
				<view @click="changeTab(index)" v-for="(item, index) in tabs" :key="index" :class="[currentTab == index ? 'text-bold text-green' : '', index == 0 ? 'line' : '']">
					{{ item.txt }}
				</view>
			</view>
			<block v-if="currentTab == 0"><takeout-card :list="takeoutList" @viewMore="viewMore" @toDetails="toDetails" showMore :nodata="takeoutNodata"></takeout-card></block>
			<block v-if="currentTab == 1"><life-card :list="lifeList" @viewMore="viewMore" @toDetails="toDetails" showMore :nodata="lifeNodata"></life-card></block>
		</view>

		<login-modal ref="loginModal"></login-modal>
	</view>
</template>

<script>
import takeoutCard from '@/components/home/takeout-card.vue';
import lifeCard from '@/components/home/life-card.vue';
import common from '@/utils/mixins/common.js';
import { mapGetters, mapActions } from 'vuex';

export default {
	components: { takeoutCard, lifeCard },
	mixins: [common],
	data() {
		return {
			CustomBar: this.CustomBar,
			banner: [],
			category: [],
			tabs: [],
			currentTab: 0,
			ADList: [],
			takeoutList: [],
			takeoutNodata: false,
			lifeList: [],
			lifeNodata: false,

			// 公告
			noticeList: [],
			animation: false
		};
	},
	computed: {
		...mapGetters(['schoolinfo', 'shareData', 'userinfo', 'token']),
		ADup() {
			return this.ADList.slice(0, 2);
		},
		ADdown() {
			return this.ADList.slice(2, 5);
		}
	},
	onLoad() {
		this.getBanner();
		
		setTimeout(() => {
			this.animation = true;
		}, 600);
	},
	onPullDownRefresh() {
		this.getBanner();
	},
	onShareAppMessage() {
		return {
			title: this.shareData ? this.shareData.title : '',
			path: this.shareData && this.userinfo ? `/pages/tabbar/home?invite_code=${this.userinfo.invite_code}` : ''
		};
	},
	methods: {
		...mapActions(['setBannerArticle']),
		// 公告消息列表
		getNoticList() {
			this.$http.post('/api/school/affiche', { type: 2 }).then(res => {
				if (res.code == 0) {
					this.noticeList = res.data;
				}
			});
		},

		// 首页外卖与生活标题
		getTitile() {
			this.$http.post('/api/service/modules').then(res => {
				if (res.code == 0) {
					let list = [];
					list.push({ txt: res.data.first, value: 0 });
					list.push({ txt: res.data.second, value: 1 });
					this.tabs = list;
				}
			});
		},

		// bannner details
		toBannerDetails(item) {
			// type 跳转类型 1：跳转到详情，2：跳转店铺
			if (item.type == 1) {
				this.setBannerArticle(item.details);
				uni.navigateTo({
					url: '/pages/common/banner-details'
				});
			} else {
				if (item.store_type == 1) {
					uni.navigateTo({
						url: `/pages/home/takeout-details?id=${item.store_id}`
					});
				} else if (item.store_type == 2) {
					uni.navigateTo({
						url: `/pages/home/life-details?id=${item.store_id}`
					});
				}
			}
		},
		// banner
		getBanner() {
			
			// position_id 1：首页，2：校园综合
			this.$http.post('/api/service/banner_list', { school_id: this.schoolinfo.id, position_id: 1 }).then(res => {
				if (res.code == 0) {
					this.banner = res.data;
				}
				this.getCategory();
				this.getAD();
				this.getTakeout();
				this.getTitile();
				uni.stopPullDownRefresh();
				this.getNoticList();
				
				
			});
		},
		// category
		getCategory() {
			this.$http.post('/api/service/store_cate', { school_id: this.schoolinfo.id }).then(res => {
				if (res.code == 0) {
					this.category = res.data;
				}
			});
		},
		// 广告位---需要选择店铺
		getAD() {
			this.$http.post('/api/service/advertising', { school_id: this.schoolinfo.id }).then(res => {
				if (res.code == 0) {
					// this.ADList = res.data.reverse();
					this.ADList = res.data;
				}
			});
		},
		toADDetails(id, status, isGroup) {
			if (status == 0) {
				uni.showToast({
					title: '该店铺暂停营业',
					icon: 'none'
				});
				return;
			}
			if (isGroup == 1) {
				uni.navigateTo({ url: '/pages/group/group' });
				return;
			}
			uni.navigateTo({
				url: `/pages/home/takeout-details?id=${id}`
			});
		},
		// 外卖店铺列表
		getTakeout() {
			this.$http.post('/api/takeout/store_takeout_list', { school_id: this.schoolinfo.id, page: 1 }).then(res => {
				if (res.code == 0) {
					this.takeoutList = res.data.list;
				} else {
					this.takeoutNodata = true;
					this.takeoutList = [];
				}
			});
		},
		// 生活列表
		getLife() {
			this.$http.post('/api/life/store_life_list', { school_id: this.schoolinfo.id, page: 1 }).then(res => {
				if (res.code == 0) {
					this.lifeList = res.data.data;
				} else {
					this.lifeNodata = true;
					this.lifeList = [];
				}
			});
		},
		// 分类跳转
		toCategoryList(title, id, url) {
			if (url) {
				location.href = url;
				return;
			}
			uni.navigateTo({
				url: `/pages/home/home-category-search?title=${title}&id=${id}`
			});
		},
		// 切换tab
		changeTab(index) {
			if (index != this.currentTab) {
				this.currentTab = index;
				if (index == 1) {
					this.getLife();
				}
			}
		},
		// 查看更多
		viewMore() {
			if (this.currentTab == 0) {
				uni.navigateTo({
					url: '/pages/home/takeout'
				});
			} else if (this.currentTab == 1) {
				uni.navigateTo({
					url: '/pages/home/life'
				});
			}
		},
		toDetails(id, status) {
			// status 0 未营业 1营业
			if (status == 0) return;
			let url;
			this.currentTab == 0 && (url = '/pages/home/takeout-details');
			this.currentTab == 1 && (url = '/pages/home/life-details');
			uni.navigateTo({
				url: `${url}?id=${id}`
			});
		}
	}
};
</script>
<style>
.page {
	height: 100vh;
}
</style>
<style lang="scss">
.home {
	// 定位-搜索
	.location-school {
		height: 72upx;
		padding: 0 30upx;
		display: flex;
		align-items: center;
		.location-icon {
			width: 40upx;
			height: 40upx;
		}
		.triangle {
			width: 0;
			height: 0;
			border: 16upx solid transparent;
			border-top-color: #999;
			border-bottom-width: 0;
		}
	}

	.search-bar {
		height: 80upx;
		padding: 8rpx 30rpx;
		background-color: #ffffff;
		.search-bar-input {
			height: 100%;
			border-radius: 32upx;
		}
		.search-icon {
			width: 28upx;
			height: 28upx;
		}
	}

	// 轮播
	.swiper-card {
		height: 300upx;
		// margin-top: 72upx;
		swiper-item {
			width: 100%;
			height: 100%;
			border-radius: 20upx;
		}
		.swiper-item {
			width: 100%;
			height: 100%;
		}
	}
	// 分类菜单
	.category-menu {
		.category-img {
			width: 72upx;
			height: 72upx;
		}
	}
	// 广告
	.recommend-Ad {
		.up {
			height: 160upx;
			> image {
				width: calc((100% - 20upx) / 2);
				height: 100%;
				border-radius: 12upx;
			}
		}
		.down {
			height: 160upx;
			> image {
				width: calc((100% - 40upx) / 3);
				height: 100%;
				border-radius: 12upx;
			}
		}
	}
	// 优惠券
	.coupon-pic {
		width: 100%;
		height: 120upx;
	}
	// 列表
	.home-list {
		.line {
			border-right: 2upx solid #ebebeb;
		}
	}
}

// 公告
.horn-rolling-news {
	width: 100%;
	padding: 0 30upx;
	box-sizing: border-box;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-wrap: nowrap;
}

.horn-swiper {
	font-size: 28upx;
	height: 50upx;
	flex: 1;
}

.horn-swiper-item {
	display: flex;
	align-items: center;
	flex: 1;
	white-space: nowrap;
	overflow: hidden;
}

.horn-news-item {
	line-height: 28upx;
	white-space: nowrap;
	// overflow: hidden;
	// text-overflow: ellipsis;
	color: #666666;
	display: flex;
	flex: 1;
}
.horn {
	width: 28upx;
	height: 28upx;
	margin-right: 20upx;
}
.tui-notice {
	transform: translateX(100%);
}
.tui-animation {
	-webkit-animation: tui-rolling 12s linear infinite;
	animation: tui-rolling 12s linear infinite;
}
@-webkit-keyframes tui-rolling {
	0% {
		transform: translateX(100%);
	}

	100% {
		transform: translateX(-100%);
	}
}

@keyframes tui-rolling {
	0% {
		transform: translateX(100%);
	}

	100% {
		transform: translateX(-100%);
	}
}
</style>
