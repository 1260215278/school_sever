<template>
	<view class="">
		<tui-skeleton v-if="skeletonShow" backgroundColor="#fafafa" borderRadius="10rpx"></tui-skeleton>

		<view class="composite tui-skeleton">
			<!-- 定位搜索 轮播图 -->
			<view class="composite-header-wrapper">
				<!-- 定位-搜索 -->
				<view class="location-search flex text-white">
					<navigator url="/pages/common/locate-index?from=home" class="location-school flex align-center">
						<image class="location-icon" src="/static/locationIconWhite.png"></image>
						<view class="padding-left-sm padding-right-sm text-df">{{ schoolinfo ? schoolinfo.school_name : '' }}</view>
						<view class="triangle"></view>
					</navigator>
					<navigator url="/pages/composite/composite-search" class="search-bar">
						<view class="search-bar-input flex align-center justify-center padding-lr-sm bg-gray">
							<image class="search-icon" src="/static/searchIcon.png" mode=""></image>
							<text class="padding-lr-sm text-gray">请输入要搜索内容</text>
						</view>
					</navigator>
				</view>
				<swiper class="swiper-card" :autoplay="true" :interval="3000" :duration="1000" circular>
					<swiper-item @click="toBannerDetails(item)" v-for="(item, index) in banner" :key="index">
						<view class="swiper-item"><image class="" :src="item.banner_path" mode="aspectFill"></image></view>
					</swiper-item>
				</swiper>
			</view>

			<view class="composite-content">
				<!-- 分类 -->
				<view class="category-menu margin-lr bg-white padding-lr-xl padding-tb flex justify-between margin-bottom-xl">
					<view @click="toCategoryList(item.url)" v-for="(item, index) in category" :key="index" class="flex flex-direction align-center">
						<image class="category-icon margin-bottom-xs" :src="item.category_image" mode="aspectFill"></image>
						<text>{{ item.category_name }}</text>
					</view>
				</view>
				<!-- 立即发布图片 -->
				<!-- <view class="composite-issue padding"><image @click="toSelectIssueType" class="composite-issue-img" src="/static/composite-issue-img.png" mode=""></image></view> -->
				<!-- 附近驾校 -->
				<view v-if="drivingList.length" class="near-driving-wrap padding-lr">
					<!-- 标题 更多 -->
					<navigator url="/pages/composite/driving" class="flex justify-between align-center">
						<view class="flex align-center">
							<image class="driving-icon" src="/static/driving-icon.png"></image>
							<text class="padding-lr-sm text-lg">附近驾校</text>
						</view>
						<view class="text-xxl text-gray flex align-center"><text class="cuIcon-right "></text></view>
					</navigator>
					<!-- 驾校列表 -->
					<view class="padding-tb"><driving-card @click.native="toDrivingDetails(item.id)" v-for="(item, index) in drivingList" :key="index" :item="item"></driving-card></view>
				</view>
				<!-- 热门机构 -->
				<view v-if="educationList.length" class="near-driving-wrap padding-lr">
					<navigator url="/pages/composite/education" class="flex justify-between align-center">
						<view class="flex align-center">
							<image class="driving-icon" src="/static/second-phase/education-icon.png"></image>
							<text class="padding-lr-sm text-lg">热门机构</text>
						</view>
						<view class="text-xxl text-gray flex align-center"><text class="cuIcon-right "></text></view>
					</navigator>
					<view class="hot-body-list padding-tb">
						<navigator :url="`/pages/composite/organization-detail?id=${item.id}&title=${item.name}`" v-for="(item, index) in educationList" :key="index" class="hot-body-item">
							<image :src="item.logo" mode="aspectFill" class="hot-body-logo"></image>
							<view class="hot-body-desc">
								<view class="hot-body-name">{{ item.name }}</view>
								<view class="hot-body-tags">
									<view v-for="(em, i) in item.tags" :key="i" class="hot-body-tag">{{ em }}</view>
								</view>
								<view class="hot-body-text">{{ item.description }}</view>
								<view class="views-wrap">
									<image src="/static/views-icon.png" class="views-icon"></image>
									<text>{{ item.visit }}</text>
								</view>
							</view>
						</navigator>
					</view>
				</view>
				<!-- 闲置推荐 -->
				<!-- <view v-if="idleList.length" class="used-idle-recommend padding-lr">
					<navigator url="/pages/composite/used-idle" class="flex justify-between align-center">
						<view class="flex align-center">
							<image class="used-idle-recommend-icon" src="/static/used-idle-recomend-icon.png"></image>
							<text class="padding-lr-sm text-lg">闲置推荐</text>
						</view>
						<view class="text-xxl text-gray flex align-center"><text class="cuIcon-right "></text></view>
					</navigator>
					<view class="padding-tb">
						<composite-card @click.native="toDetails(item.id, item.fage)" v-for="(item, index) in idleList" :key="index" :item="item"></composite-card>
					</view>
				</view> -->
				<!-- 失物招领 -->
				<!-- <view v-if="lostList.length" class="lost-property-wrap padding-lr">
					<navigator url="/pages/composite/lost-property" class="flex justify-between align-center">
						<view class="flex align-center">
							<image class="used-idle-recommend-icon" src="/static/lost-property-title.png"></image>
							<text class="padding-lr-sm text-lg">失物招领</text>
						</view>
						<view class="text-xxl text-gray flex align-center"><text class="cuIcon-right "></text></view>
					</navigator>
					<view class="padding-tb">
						<composite-card @click.native="toDetails(item.id, item.fage)" v-for="(item, index) in lostList" :key="index" :item="item"></composite-card>
					</view>
				</view> -->

				<uni-load-more status="noMore"></uni-load-more>
			</view>
			<!-- 发布选择弹窗 -->
			<uni-popup ref="issueTypePopup" class="issue-type-popup">
				<view class="popup-container">
					<view class="bg-white popup-content">
						<view class="flex justify-center text-xl padding-tb-sm text-black">发布选择</view>
						<view class="padding-left-xl padding-right padding-tb">
							<!-- <view @click="toIssue(0)" class="flex align-center margin-bottom-xl">
								<view class="flex-sub flex align-center">
									<image src="/static/my-idle-icon.png" class="my-idle-icon" mode=""></image>
									<view class="flex-sub flex flex-direction padding-lr">
										<view class="text-black text-df">二手闲置</view>
										<view class="">发布我的闲置、我需要的</view>
									</view>
								</view>
								<view class="text-lg "><text class="cuIcon-right text-999"></text></view>
							</view>
							<view @click="toIssue(1)" class="flex align-center margin-bottom-xl">
								<view class="flex-sub flex align-center">
									<image src="/static/my-lost-property.png" class="my-lost-property" mode=""></image>
									<view class="flex-sub flex flex-direction padding-lr">
										<view class="text-black text-df">失物招领</view>
										<view class="">您丢失的，大家帮您找回</view>
									</view>
								</view>
								<view class="text-lg "><text class="cuIcon-right text-999"></text></view>
							</view> -->
							<view @click="toIssue(2)" class="flex align-center margin-bottom-xl">
								<view class="flex-sub flex align-center">
									<image src="/static/my-help-delivery.png" class="my-help-delivery" mode=""></image>
									<view class="flex-sub flex flex-direction padding-lr">
										<view class="text-black text-df">帮取快递</view>
										<view class="">足不出户，别人帮我取快递</view>
									</view>
								</view>
								<view class="text-lg "><text class="cuIcon-right text-999"></text></view>
							</view>
						</view>
					</view>
					<view @click="closePopup" class="cuIcon-roundclose"></view>
				</view>
			</uni-popup>

			<login-modal ref="loginModal"></login-modal>
		</view>
	</view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import tuiSkeleton from '@/components/tui-skeleton/tui-skeleton';
import compositeCard from '@/components/composite/composite-card.vue';
import drivingCard from '@/components/composite/driving-card.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import common from '@/utils/mixins/common.js';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';

export default {
	components: { compositeCard, drivingCard, uniPopup, tuiSkeleton, uniLoadMore },
	mixins: [common],
	data() {
		return {
			position: {},
			skeletonShow: true,
			CustomBar: this.CustomBar,
			banner: [],
			category: [],
			drivingList: [], // 附近驾校
			idleList: [], // 闲置推荐
			lostList: [], // 失物招领
			educationList: []
		};
	},
	computed: {
		...mapGetters(['schoolinfo', 'token', 'shareData', 'userinfo']),
		style() {
			var StatusBar = this.StatusBar;
			var CustomBar = this.CustomBar;
			var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
			return style;
		}
	},
	onLoad() {
		this.getBanner();
		this.getCategory();
	},
	onShow() {
		this.position = uni.getStorageSync('lzp_location_position');
		// this.getIdleList(); // 闲置推荐
		// this.getLostList(); // 失物招领
		this.getDrivingList(); // 附近驾校
		this.getEducationList();
	},
	onShareAppMessage() {
		return {
			title: this.shareData ? this.shareData.title : '',
			path: this.shareData && this.userinfo ? `/pages/tabbar/home?invite_code=${this.userinfo.invite_code}` : ''
		};
	},
	methods: {
		...mapActions(['setLoginModal', 'setBannerArticle']),
		async getEducationList() {
			let res = await this.$http.post('/api/training/get_institution_list', { page: 1, limit: 10, city: this.schoolinfo.school_city });
			if (res.code == 0) {
				this.nodata = !res.data.data.length;
				this.educationList = res.data.data;
			}
		},
		// bannner details
		toBannerDetails(item) {
			// type 跳转类型 1：跳转到详情，2：跳转店铺
			if (item.type == 1) {
				this.setBannerArticle(item.details);
				uni.navigateTo({
					url: '/pages/common/banner-details'
				});
			}
		},
		// banner
		getBanner() {
			// position_id 1：首页，2：校园综合
			this.$http.post('/api/service/banner_list', { school_id: this.schoolinfo.id, position_id: 2 }).then(res => {
				if (res.code == 0) {
					this.banner = res.data;
				}
			});
		},

		// 分类列表
		getCategory() {
			this.$http.post('/api/school/classify').then(res => {
				if (res.code == 0) {
					// 0 二手闲置 1 失物招领 2 帮取快递 3 驾校报名
					// let urls = ['/pages/composite/used-idle', '/pages/composite/lost-property', '/pages/composite/behalf', '/pages/composite/driving'];
					let urls = ['/pages/delivery/list', '/pages/composite/driving', '/pages/composite/education'];
					res.data.forEach((em, index) => {
						em.url = urls[index];
					});
					this.category = res.data;
					console.log(this.category,88)
					this.skeletonShow = false;
				}
			});
		},
		toCategoryList(url) {
			uni.navigateTo({
				url: url
			});
		},
		toSelectIssueType() {
			this.$refs.issueTypePopup.open();
		},
		closePopup() {
			this.$refs.issueTypePopup.close();
		},
		// 去发布
		toIssue(val) {
			this.$refs.issueTypePopup.close();
			if (!this.token) {
				this.setLoginModal(true);
				return;
			}
			// 0--闲置发布 1-失物招领 2-帮取快递
			let url = '';
			if (val === 0) {
				url = '/pages/composite/used-idle-issue';
			} else if (val === 1) {
				url = '/pages/composite/lost-property-issue';
			} else if (val === 2) {
				url = '/pages/composite/behalf-issue';
			}
			uni.navigateTo({
				url: url
			});
		},
		// 闲置推荐
		getIdleList() {
			this.$http.post('/api/school/leave_recommend', { school_id: this.schoolinfo.id }).then(res => {
				if (res.code == 0) {
					this.idleList = res.data;
				}
			});
		},
		// 失物招领
		getLostList() {
			this.$http.post('/api/school/leave_recommends', { school_id: this.schoolinfo.id }).then(res => {
				if (res.code == 0) {
					this.lostList = res.data;
				}
			});
		},
		// 附近驾校
		getDrivingList() {
			this.$http.post('api/school/driving_school', { school_id: this.schoolinfo.id }).then(res => {
				if (res.code == 0) {
					this.drivingList = res.data;
				}
			});
		},
		toDetails(id, fage) {
			// 闲置 失物招领 共用 type值有 1 二手闲置 2 二手需求 3 我丢失的 4 我捡到的
			let type;
			if (fage == 1 || fage == 2) {
				type = 1;
			} else {
				type = 2;
			}
			// 1 是二手闲置评论 2 是失物招领评论 3 是动态评论 (评论列表需要判断此参数)
			uni.navigateTo({ url: `/pages/composite/used-idle-details?id=${id}&type=${type}` });
		},
		// 跳转驾校详情
		toDrivingDetails(id) {
			uni.navigateTo({
				url: `/pages/composite/driving-details?id=${id}`
			});
		}
	}
};
</script>

<style lang="scss">
.composite {
	// 定位搜索 轮播图
	.composite-header-wrapper {
		// 定位-搜索
		.location-search {
			position: absolute;
			left: 0;
			right: 0;
			z-index: 8;
			height: 152upx;
			display: flex;
			flex-direction: column;
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
					border-top-color: #fff;
					border-bottom-width: 0;
				}
			}

			.search-bar {
				height: 80upx;
				padding: 8rpx 30rpx;
				background-color: transparent;
				.search-bar-input {
					height: 100%;
					border-radius: 32upx;
				}
				.search-icon {
					width: 28upx;
					height: 28upx;
				}
			}
		}
		// 轮播图
		.swiper-card {
			height: 500upx;
			.swiper-item {
				width: 100%;
				height: 100%;
			}
		}
	}
	.composite-content {
		position: relative;
		margin-top: -100upx;
		// 分类菜单
		.category-menu {
			border-radius: 20upx;
			box-shadow: 0px 0px 20upx 0px rgba(38, 212, 153, 0.2);
			.category-icon {
				width: 88upx;
				height: 88upx;
			}
		}
		// 立即发布图片
		.composite-issue-img {
			width: 100%;
			height: 140upx;
		}
		// 标题
		.driving-icon {
			width: 44upx;
			height: 44upx;
		}
		// 附近驾校
		.near-driving-wrap {
			// 标题
			.driving-icon {
				width: 44upx;
				height: 44upx;
			}
		}
		// 闲置推荐
		.used-idle-recommend,
		.lost-property-wrap {
			.used-idle-recommend-icon,
			.lost-property-title {
				width: 44upx;
				height: 44upx;
			}
		}
	}
	// 发布选择弹窗
	.issue-type-popup {
		z-index: 999;
		.popup-container {
			position: relative;
			.popup-content {
				width: 560upx;
				border-radius: 20upx;
			}
		}
		.cuIcon-roundclose {
			position: absolute;
			bottom: -120upx;
			left: 50%;
			transform: translateX(-50%);
			font-size: 56upx;
			color: #ffffff;
		}
	}

	.hot-body-list {
	}
	.hot-body-item {
		height: 220rpx;
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 0px 6rpx rgba(0, 0, 0, 0.16);
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		padding: 20rpx;
		margin-bottom: 20rpx;
	}
	.hot-body-logo {
		// width: 116rpx;
		// height: 86rpx;
		width: 150rpx;
		height: 150rpx;
		border-radius: 20rpx;
		margin-right: 25rpx;
	}
	.hot-body-desc {
		flex: 1;
		overflow: hidden;
	}
	.hot-body-name {
		font-size: 28rpx;
		font-weight: bold;
		margin-bottom: 10rpx;
	}
	.hot-body-tags {
		display: flex;
		flex-wrap: wrap;

		.hot-body-tag {
			border: 2rpx solid #26d499;
			color: #26d499;
			padding: 4rpx 8rpx;
			border-radius: 5rpx;
			font-size: 20rpx;
			margin-right: 10rpx;
			margin-bottom: 10rpx;
		}
	}
	.hot-body-text {
		-webkit-line-clamp: 2;
		overflow: hidden;
		text-overflow: ellipsis;
		display: -webkit-box; // 弹性伸缩盒
		-webkit-box-orient: vertical; // 设置伸缩盒子元素排列方式
	}
	.views-wrap {
		display: flex;
		justify-content: flex-end;
		align-items: center;
		color: #666666;
		margin-top: 10rpx;
		.views-icon {
			margin: 0 10rpx;
		}
	}
}
</style>
