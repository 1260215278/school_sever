<template>
	<view class="dynamic">
		<view @click="closeSchoolTypePopup" @touchmove.stop.prevent="clear" v-if="visiable" class="mask-all"></view>
		<!-- tab栏 -->
		<view class="header flex align-center padding-lr text-lg text-bold" :style="style">
			<view @click="changeTab(1)" class="tab-item flex align-center padding-lr line" :class="currentTab === 1 ? 'text-bold text-xl active text-green' : ''">新闻</view>
			<view class="divide-line"></view>
			<view @click="changeTab(0)" class="tab-item flex align-center padding-lr line" :class="currentTab === 0 ? 'text-bold text-xl active text-green' : ''">动态</view>
			<view class="divide-line"></view>
			<view @click="changeTab(2)" class="tab-item flex align-center padding-lr line" :class="currentTab === 2 ? 'text-bold text-xl active text-green' : ''">二手闲置</view>
			<view class="divide-line"></view>
			<view @click="changeTab(3)" class="tab-item flex align-center padding-lr line" :class="currentTab === 3 ? 'text-bold text-xl active text-green' : ''">失物招领</view>
			<image @click="openDynamicFilterPopup" class="dynamic-filter" src="/static/news-filter-icon.png" mode=""></image>
		</view>
		<view class="container" :class="{ disabledScroll: visiable }" style="padding-top: 44px">
			<view class="horn-rolling-news">
				<image src="/static/horn.png" class="horn"></image>
				<swiper circular interval="10000" class="horn-swiper">
					<swiper-item v-for="(item, index) in noticeList" :key="index" class="horn-swiper-item">
						<view class="tui-notice horn-news-item" :class="[animation ? 'tui-animation' : '']">{{ item.affiche }}</view>
					</swiper-item>
				</swiper>
			</view>
			<!-- 列表 -->
			<view v-if="currentTab === 0" class="dynamic-list padding-lr padding-tb-sm">
				<dynamic-card @liked="liked" @click.native="toDetails(item)" v-for="(item, index) in list" :key="index" :item="item"></dynamic-card>
				<tui-tips v-if="nodata" :fixed="false" imgUrl="/static/img_nodata.png">暂无数据</tui-tips>
				<uni-load-more v-if="list.length" :status="loadingStatus"></uni-load-more>
			</view>
			<!-- 新闻 -->
			<view v-if="currentTab === 1" class="news-wrapper">
				<swiper class="swiper-card" :autoplay="true" :interval="3000" :duration="1000" circular>
					<swiper-item @click="toNewDetails(item.store_id)" v-for="(item, index) in banner" :key="index">
						<view class="swiper-item"><image :src="item.banner" mode="aspectFill"></image></view>
					</swiper-item>
				</swiper>
				<view class="news-content">
					<view class="news-header flex justify-between align-center padding-lr"><view class="text-lg text-bold">新闻资讯</view></view>
					<view class="news-list padding-lr">
						<view @click="toNewDetails(item.id)" v-for="(item, index) in newList" :key="index" class="news-list-item padding-sm flex justify-between margin-bottom-sm">
							<view class="flex-sub flex flex-direction justify-between overflow">
								<view class="intro text-df text-cut text-two-omit">{{ item.title }}</view>
								<view class="flex justify-between text-grey">
									<view class="flex align-center">
										<image class="school-icon" src="/static/school-icon.png" mode=""></image>
										<text class="padding-lr-xs">{{ item.school_name }}</text>
									</view>
									<view class="" style="flex-shrink: 0;">{{ dataFormat(item.addtime) }}</view>
								</view>
							</view>
							<image class="news-img margin-left-sm" :src="item.cover_image" mode="aspectFill"></image>
						</view>
						<tui-tips v-if="newNodata" :fixed="false" imgUrl="/static/img_nodata.png">暂无数据</tui-tips>
						<uni-load-more v-if="newList.length > 5" :status="newLoadingStatus"></uni-load-more>
					</view>
				</view>
			</view>
			<!-- 二手闲置 -->
			<view v-if="currentTab == 2" class="margin-lr margin-top-sm">
				<composite-card @click.native="toIdleDetails(item)" v-for="(item, index) in idleList" :key="index" :item="item"></composite-card>
				<tips v-if="idleNodata" :fixed="false" imgUrl="/static/img_nodata.png">暂无数据</tips>
				<uni-load-more v-if="!idleNodata && idleList.length" :status="idleLoadState"></uni-load-more>
			</view>
			<!-- 失物招领 -->
			<view v-if="currentTab == 3" class="margin-lr margin-top-sm">
				<composite-card @click.native="toIdleDetails(item)" v-for="(item, index) in lostList" :key="index" :item="item"></composite-card>
				<uni-load-more v-if="!lostNodata && list.length" :status="lostLoadState"></uni-load-more>
				<tui-tips v-if="lostNodata" :fixed="false" imgUrl="/static/img_nodata.png">暂无数据</tui-tips>
			</view>
		</view>

		<view v-if="currentTab != 1" @click="toIssue" class="add-icon-fixed"><image src="/static/add-icon.png" class="add-icon" mode=""></image></view>

		<!-- 动态 学校分类弹窗 -->
		<uni-popup ref="dynamicFilterPopup" type="top" class="dynamic-filter-popup">
			<view class="school-type-wrap">
				<scroll-view scroll-y class="school-type-scroll">
					<view class="school-type-list">
						<view @click="dynamicFilterSelected(item.id)" v-for="(item, index) in schoolList" :key="index" class="school-type-item">
							<view :class="dynamicFilterId == item.id ? 'text-green' : ''">{{ item.school_name }}</view>
							<image v-if="dynamicFilterId == item.id" src="/static/checked-icon.png" class="checked-icon" mode=""></image>
						</view>
					</view>
				</scroll-view>
			</view>
		</uni-popup>

		<uni-popup ref="issueTypePopup" class="issue-type-popup">
			<view class="popup-container">
				<view class="bg-white popup-content">
					<view class="flex justify-center text-xl padding-tb-sm text-black">发布选择</view>
					<view class="padding-left-xl padding-right padding-tb">
						<view @click="toIssueDemand(0)" class="flex align-center margin-bottom-xl">
							<view class="flex-sub flex align-center">
								<image src="/static/my-idle-icon.png" class="my-idle-icon" mode=""></image>
								<view class="flex-sub flex flex-direction padding-lr">
									<view class="text-black text-df">二手闲置</view>
									<view class="">发布我的闲置、我需要的</view>
								</view>
							</view>
							<view class="text-lg "><text class="cuIcon-right text-999"></text></view>
						</view>
						<view @click="toIssueDemand(1)" class="flex align-center margin-bottom-xl">
							<view class="flex-sub flex align-center">
								<image src="/static/my-lost-property.png" class="my-lost-property" mode=""></image>
								<view class="flex-sub flex flex-direction padding-lr">
									<view class="text-black text-df">失物招领</view>
									<view class="">您丢失的，大家帮您找回</view>
								</view>
							</view>
							<view class="text-lg "><text class="cuIcon-right text-999"></text></view>
						</view>
					</view>
				</view>
				<view @click="closePopup" class="cuIcon-roundclose"></view>
			</view>
		</uni-popup>

		<login-modal></login-modal>
	</view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import dynamicCard from '@/components/dynamic/dynamic-card.vue';
import { dateUtils } from '@/utils/util.js';
import tuiTips from '@/components/tips/tips.vue';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import common from '@/utils/mixins/common.js';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import compositeCard from '@/components/composite/composite-card.vue';
import loginModal from '@/components/login/login-modal.vue';

export default {
	components: { dynamicCard, tuiTips, uniLoadMore, uniPopup, compositeCard, loginModal },
	mixins: [common],
	data() {
		return {
			visiable: false, // 分类弹窗
			CustomBar: this.CustomBar,
			StatusBar: this.StatusBar,
			currentTab: 1, // 0---动态 1---新闻 2 二手闲置 3 失物招领
			// 动态列表
			page: 1,
			lastPage: 1,
			nodata: false,
			pullUpOn: false,
			loadingStatus: 'more',
			list: [],
			dynamicFilterId: '', // 选择学校id
			noticeList: [], // 公告列表
			animation: false,
			// 新闻
			banner: [],
			selectedSchoolType: 0,
			newList: [],
			newPage: 1,
			newLastPage: 1,
			newNodata: false,
			newPullUpOn: false,
			newLoadingStatus: 'more',
			school_id: '', // 选择学校id
			schoolList: [], // 学校列表
			// 二手闲置
			idleList: [],
			idlePage: 1,
			idleLastPage: 1,
			idleNodata: false,
			idleLoadState: 'more',
			idlePullUpOn: false,
			// 失物招领
			lostList: [],
			lostPage: 1,
			lostLastPge: 1,
			lostNodata: false,
			lostLoadState: 'more',
			lostPullUpOn: false
		};
	},
	computed: {
		...mapGetters(['schoolinfo', 'token', 'shareData', 'userinfo']),
		style() {
			var StatusBar = this.StatusBar;
			var CustomBar = this.CustomBar;
			// #ifdef H5
			var style = `height:${CustomBar}px;`;
			// #endif
			// #ifdef MP
			var style = `height:44px;`;
			// #endif
			return style;
		}
	},
	onLoad() {
		if(this.schoolinfo){
			this.dynamicFilterId = this.schoolinfo.id
		}
		this.getList();
		this.getNewList();
		this.getSchoolList();
		this.getNewBanner();
		this.getNoticList();
		setTimeout(() => {
			this.animation = true;
		}, 600);
		// 二手闲置
		this.getIdleList();
		this.getLostList();
	},
	onPullDownRefresh() {
		if (this.currentTab == 0) {
			this.pullUpOn = true;
			this.page = 1;
			this.getList();
		} else if (this.currentTab == 1) {
			this.newPullUpOn = true;
			this.newPage = 1;
			this.getNewList();
		} else if (this.currentTab == 2) {
			this.idlePullUpOn = true;
			this.idlePage = 1;
			this.getIdleList();
		} else if (this.currentTab == 3) {
			this.lostPullUpOn = true;
			this.lostPage = 1;
			this.getLostList();
		}
		this.getSchoolList();
		this.getNewBanner();
		this.getNoticList();
	},
	onReachBottom() {
		if (this.currentTab === 0) {
			this.loadingStatus = 'loading';
			if (this.page < this.lastPage) {
				this.page++;
				this.getList();
			} else {
				this.loadingStatus = 'noMore';
			}
		} else if (this.currentTab === 1) {
			this.newLoadingStatus = 'loading';
			if (this.newPage < this.newLastPage) {
				this.newPage++;
				this.getNewList();
			} else {
				this.newLoadingStatus = 'noMore';
			}
		} else if (this.currentTab === 2) {
			this.idleLoadState = 'loading';
			if (this.idlePage < this.idleLastPage) {
				this.idlePage++;
				this.getIdleList();
			} else {
				this.idleLoadState = 'noMore';
			}
		} else if (this.currentTab === 3) {
			this.lostLoadState = 'loading';
			if (this.lostPage < this.lostLastPge) {
				this.lostPage++;
				this.getLostList();
			} else {
				this.lostLoadState = 'noMore';
			}
		}
	},
	onShareAppMessage() {
		return {
			title: this.shareData ? this.shareData.title : '',
			path: this.shareData && this.userinfo ? `/pages/tabbar/home?invite_code=${this.userinfo.invite_code}` : ''
		};
	},
	methods: {
		...mapActions(['setDisableScroll', 'setLoginModal']),
		// 新闻轮播图
		getNewBanner() {
			this.$http.post('/api/school/banners', { school_id: this.schoolinfo.id }).then(res => {
				if (res.code == 0) {
					this.banner = res.data;
				}
			});
		},

		// 公告消息列表
		getNoticList() {
			this.$http.post('/api/school/affiche', { type: 1 }).then(res => {
				if (res.code == 0) {
					this.noticeList = res.data;
				}
			});
		},

		clear(e) {
			// TODO nvue 取消冒泡
			e.stopPropagation();
		},
		dataFormat(val) {
			if (val) {
				return dateUtils.humanize(val * 1000);
			} else {
				return '';
			}
		},

		// 点赞
		liked(item) {
			if (!this.token) {
				this.setLoginModal(true);
				return;
			}
			this.$http.post('/api/personal/favour', { id: item.id }).then(res => {
				if (res.code == 0) {
					if (item.fage == 1) {
						item.dzcount--;
						item.fage = 2;
					} else {
						item.dzcount++;
						item.fage = 1;
					}
				}
			});
		},

		// 动态学校分类弹窗
		openDynamicFilterPopup() {
			this.$refs.dynamicFilterPopup.open();
		},
		dynamicFilterSelected(id) {
			if (id != this.dynamicFilterId) {
				this.dynamicFilterId = id;
				this.getList();
				this.getNewList();
				this.getIdleList();
				this.getLostList();
				this.$refs.dynamicFilterPopup.close();
			}
		},
		// 动态
		getList() {
			this.$http.post('/api/school/dynamic_list', { page: this.page, school_id: this.dynamicFilterId }).then(res => {
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
						uni.stopPullDownRefresh();
						this.pullUpOn = false;
						uni.showToast({
							title: '刷新成功',
							icon: 'none'
						});
					}
				}
			});
		},

		// 学校列表
		getSchoolList() {
			this.$http.post('/api/school/schools_List').then(res => {
				if (res.code == 0) {
					// res.data.unshift({ id: '', school_name: '全部' });
					this.schoolList = res.data;
				}
			});
		},
		// 选择学校
		selectedSchool(id) {
			this.visiable = false;
			if (id != this.school_id) {
				this.school_id = id;
				this.getNewList();
			}
		},
		getNewList() {
			this.$http.post('/api/school/journalism', { school_id: this.dynamicFilterId, page: this.newPage }).then(res => {
				if (res.code == 0) {
					this.newLastPage = res.data.last_page;
					this.newNodata = !res.data.data.length;
					if (this.newPage > 1) {
						this.newList.push(...res.data.data);
						this.newLoadingStatus = 'more';
					} else {
						this.newList = res.data.data;
						if (res.data.data.length < 10) {
							this.newLoadingStatus = 'noMore';
						} else {
							this.newLoadingStatus = 'more';
						}
					}
					if (this.newPullUpOn) {
						uni.stopPullDownRefresh();
						this.newPullUpOn = false;
						uni.showToast({
							title: '刷新成功',
							icon: 'none'
						});
					}
				}
			});
		},
		changeTab(val) {
			val !== this.currentTab && (this.currentTab = val);
		},
		toDetails(item) {
			item.num++;
			uni.navigateTo({ url: `/pages/dynamic/dynamic-details?id=${item.id}` });
		},
		toIssue() {
			if (!this.token) {
				this.setLoginModal(true);
				return;
			}
			if (this.currentTab == 0) {
				uni.navigateTo({ url: '/pages/dynamic/dynamic-issue' });
			} else if (this.currentTab == 2) {
				uni.navigateTo({ url: '/pages/composite/used-idle-issue' });
			} else if (this.currentTab == 3) {
				uni.navigateTo({ url: '/pages/composite/lost-property-issue' });
			}
		},
		// 去发布需求
		toIssueDemand(val) {
			this.$refs.issueTypePopup.close();
			if (!this.token) {
				this.setLoginModal(true);
				return;
			}
			// 0--闲置发布 1-失物招领
			let url = '';
			if (val === 0) {
				url = '/pages/composite/used-idle-issue';
			} else if (val === 1) {
				url = '/pages/composite/lost-property-issue';
			}
			uni.navigateTo({
				url: url
			});
		},
		closePopup() {
			this.$refs.issueTypePopup.close();
		},
		openSchoolTypePopup() {
			this.visiable = !this.visiable;
			uni.hideTabBar();
			if (this.visiable) {
				this.setDisableScroll(true);
			} else {
				this.setDisableScroll(false);
			}
		},
		closeSchoolTypePopup() {
			this.visiable = false;
			uni.showTabBar();
		},
		toNewDetails(id) {
			uni.navigateTo({ url: `/pages/dynamic/dynamic-new-details?id=${id}` });
		},

		// 二手闲置
		async getIdleList() {
			let res = await this.$http.post('/api/school/demand_list', { page: this.idlePage, school_id: this.dynamicFilterId });
			if (res.code == 0) {
				this.idleNodata = !res.data.list.length;
				this.idleLastPage = res.data.last_page;
				if (this.idlePage > 1) {
					this.idleList.push(...res.data.list);
					this.idleLoadState = 'more';
				} else {
					this.idleList = res.data.list;
					if (this.idleList.length < 10) {
						this.idleLoadState = 'noMore';
					} else this.idleLoadState = 'more';
				}
				if (this.idlePullUpOn) {
					uni.stopPullDownRefresh();
					this.idlePullUpOn = false;
					uni.showToast({ title: '刷新成功', icon: 'none' });
				}
			}
		},
		toIdleDetails(item) {
			// type 1 是二手闲置评论 2 是失物招领评论 3 是动态评论 (跳转页面评论列表需要判断此参数)
			item.count++;
			uni.navigateTo({ url: `/pages/composite/used-idle-details?id=${item.id}&type=1` });
		},
		// 失物招领
		async getLostList() {
			let res = await this.$http.post('/api/school/lose_list', { page: this.lostPage, school_id: this.dynamicFilterId });
			if (res.code == 0) {
				this.lostNodata = !res.data.data.length;
				this.lostLastPge = res.data.lostLastPge;
				if (this.page > 1) {
					this.lostList.push(...res.data.data);
					this.lostLoadState = 'more';
				} else {
					this.lostList = res.data.data;
					if (this.lostList.length < 10) {
						this.lostLoadState = 'noMore';
					} else this.lostLoadState = 'more';
				}
				if (this.lostPullUpOn) {
					uni.stopPullDownRefresh();
					this.lostPullUpOn = false;
					uni.showToast({ title: '刷新成功', icon: 'none' });
				}
			}
		}
	}
};
</script>
<style></style>
<style lang="scss">
.dynamic {
	box-sizing: border-box;
	height: 100vh;
	.mask-all {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		bottom: 0;
		z-index: 999;
		background-color: transparent;
	}
	// tab 栏
	.header {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		z-index: 9;
		background: #ffffff;
		.divide-line {
			width: 2upx;
			height: 40upx;
			background-color: #cccccc;
		}
		.tab-item {
			// width: 140upx;
			height: 100%;
			position: relative;
			white-space: nowrap;
		}
		.line {
			transition: all 0.5s;
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
		.dynamic-filter {
			position: absolute;
			right: 30upx;
			top: 50%;
			transform: translateY(-50%);
			width: 44upx;
			height: 44upx;
		}
	}
	.container {
		box-sizing: border-box;
		&.disabledScroll {
			height: 100vh;
			overflow: hidden;
		}
		.horn-rolling-news {
			width: 100%;
			padding: 25upx 30upx 5upx;
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
	}
	// 动态列表
	.add-icon-fixed {
		position: fixed;
		right: 30upx;
		bottom: 220upx;
		.add-icon {
			width: 88upx;
			height: 88upx;
		}
	}
	// 新闻
	.news-wrapper {
		.swiper-card {
			height: 320upx;
			.swiper-item {
				width: 100%;
				height: 100%;
			}
		}
		.news-header {
			height: 90upx;
		}
		.news-content {
			position: relative;
			// 分类弹窗
			.shool-type-mask {
				position: absolute;
				top: 90upx;
				left: 0;
				right: 0;
				height: 600%;
				background: rgba(0, 0, 0, 0.5);
				z-index: 999;
			}
			.school-type-wrap {
				position: absolute;
				top: 90upx;
				left: 0;
				right: 0;
				z-index: 1000;
				border-radius: 0px 0px 20upx 20upx;
				overflow: hidden;
				.school-type-scroll {
					max-height: 500upx;
				}
				.school-type-list {
					background: #ffffff;
					padding: 0 30upx;
					z-index: 100;
					position: relative;
				}
				.school-type-item {
					display: flex;
					justify-content: space-between;
					align-items: center;
					font-size: 30upx;
					padding: 25upx 0;
					border-bottom: 2upx solid #ebebeb;
				}
			}
		}
		.news-filter-icon {
			width: 44upx;
			height: 44upx;
		}
		.news-list {
			.news-list-item {
				box-shadow: 0px 0px 20upx 0px rgba(176, 176, 176, 0.15);
				border-radius: 12upx;
				.school-icon {
					width: 28upx;
					height: 28upx;
				}
				.news-img {
					width: 200upx;
					height: 150upx;
					border-radius: 10upx;
				}
			}
		}
	}

	// 动态学校分类弹窗
	.dynamic-filter-popup {
		z-index: 999;
		.school-type-wrap {
			position: absolute;
			top: 90upx;
			left: 0;
			right: 0;
			z-index: 1000;
			border-radius: 0px 0px 20upx 20upx;
			overflow: hidden;
			.school-type-scroll {
				max-height: 500upx;
			}
			.school-type-list {
				background: #ffffff;
				padding: 0 30upx;
				z-index: 100;
				position: relative;
			}
			.school-type-item {
				display: flex;
				justify-content: space-between;
				align-items: center;
				font-size: 30upx;
				padding: 25upx 0;
				border-bottom: 2upx solid #ebebeb;
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
}
</style>
