<template>
	<view>
		<uni-nav-bar
			:statusBar="true"
			class="navBar"
			title="教育培训"
			leftIcon="back"
			color="#fff"
			:fixed="false"
			:shadow="false"
			@clickLeft="clickLeft"
			:border="false"
			backgroundColor="transparent"
		></uni-nav-bar>
		<image src="/static/second-phase/education-bg.png" mode="aspectFill" class="education-bg"></image>

		<view class="search-wrap">
			<navigator url="/pages/composite/select-city" class="search-area">
				<text>{{ selectedCity }}</text>
				<uni-icons type="arrowdown" color="#fff"></uni-icons>
			</navigator>
			<view class="search-input-wrap">
				<view class="search-input-box">
					<uni-icons type="search" color="#fff" class="search-icon" :size="20"></uni-icons>
					<input v-model="searchText" type="text" placeholder="请输入你要查询的机构" class="search-input" />
				</view>
				<button @click="btnSearch" class="btn-search" size="mini">搜索</button>
			</view>
		</view>

		<swiper :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" circular indicator-color="#fff" indicator-active-color="#2FE1A5">
			<swiper-item @click="navBannerDetail(item)" v-for="(item, index) in banners" :key="index">
				<view class="swiper-item"><image :src="item.image" mode="aspectFill" class="swiper-banner"></image></view>
			</swiper-item>
		</swiper>

		<view class="notice-wrap"><u-row-notice :list="noticeList"></u-row-notice></view>

		<view v-if="educationType.length" class="learn-category">
			<view class="learn-cate-title">学习分类</view>
			<view class="learn-cate-wrap">
				<navigator v-for="(item, index) in educationType" :key="index" :url="`/pages/composite/organization?cid=${item.id}&title=${item.name}`" class="learn-cate-item">
					<image :src="`/static/second-phase/learn-cate-${(item.id % 3) + 1}.png`" class="learn-cate-icon"></image>
					<text class="learn-label">{{ item.name }}</text>
					<text class="learn-desc">{{ item.description }}</text>
				</navigator>
			</view>
		</view>

		<view class="hot-body">
			<view class="hot-body-title">热门机构</view>
			<view class="hot-body-list">
				<view @click="navDetail(item)" v-for="(item, index) in educationList" :key="index" class="hot-body-item">
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
				</view>
			</view>
			<tips v-if="nodata" :fixed="false" imgUrl="../../static/img_nodata.png">暂无数据</tips>
		</view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	data() {
		return {
			noticeList: [],
			banners: [],
			educationType: [],
			educationList: [],
			nodata: false,
			selectCity: '',

			searchText: ''
		};
	},
	computed: {
		...mapGetters(['schoolinfo']),
		selectedCity() {
			if (this.selectCity) return this.selectCity;
			else return this.schoolinfo.school_city;
		}
	},
	onLoad() {
		this.getEducationBanner();
		this.getNotices();
		this.getEducationType();
		this.getEducationList();
		uni.$on('citySelected', data => {
			setTimeout(() => {
				uni.showToast({ title: '您选择了：' + data, icon: 'none' });
				this.selectCity = data;
				this.getEducationList();
			}, 350);
		});
	},
	onUnload() {
		uni.$off('citySelected');
	},
	methods: {
		async getEducationList() {
			let res = await this.$http.post('/api/training/get_institution_list', { page: 1, limit: 10, city: this.selectedCity });
			if (res.code == 0) {
				this.nodata = !res.data.data.length;
				this.educationList = res.data.data;
			}
		},
		async getEducationType() {
			let res = await this.$http.post('/api/training/get_category_list');
			if (res.code == 0) {
				this.educationType = res.data;
			}
		},
		async getEducationBanner() {
			let res = await this.$http.post('/api/training/get_banner_list');
			if (res.code == 0) {
				this.banners = res.data;
			}
		},
		async getNotices() {
			let res = await this.$http.post('/api/training/get_notice_list');
			if (res.code == 0) {
				let noticeList = [];
				res.data.forEach(em => {
					noticeList.push(em.title);
				});
				this.noticeList = noticeList;
			}
		},
		navBannerDetail(item) {
			if (item.type == 1) {
				uni.navigateTo({
					url: `/pages/composite/education-banner-detail?id=${item.content_id}&title=${item.content_title}`
				});
			} else if (item.type == 2) {
				uni.navigateTo({ url: `/pages/composite/organization-detail?id=${item.content_id}&title=${item.content_title}` });
			}
		},
		clickLeft() {
			uni.navigateBack();
		},

		btnSearch() {
			uni.navigateTo({ url: `/pages/composite/organization?search=${this.searchText}&title=机构` });
		},

		navDetail(item) {
			item.visit++;
			uni.navigateTo({ url: `/pages/composite/organization-detail?id=${item.id}&title=${item.name}` });
		}
	}
};
</script>

<style lang="scss" scoped>
.education-bg {
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	height: 482rpx;
	z-index: -1;
}

.search-wrap {
	padding: 30rpx;
	display: flex;
	align-items: center;

	.search-area {
		font-size: 28rpx;
		color: #ffffff;
		margin-right: 15rpx;
	}
	.search-input-wrap {
		flex: 1;
		display: flex;
		align-items: center;
		.search-input-box {
			flex: 1;
			display: flex;
			align-items: center;
			background: rgba(255, 255, 255, 0.5);
			color: #ffffff;
			line-height: 66rpx;
			border-radius: 33rpx;
			font-size: 24rpx;
		}
		.search-icon {
			margin: 0 10rpx 0 20rpx;
		}
		.input-placeholder {
			color: #ffffff;
			font-size: 28rpx;
		}
		.btn-search {
			margin-left: 15rpx;
		}
	}
}

swiper {
	width: 100%;
	height: 300rpx;
	padding: 0 30rpx;
	box-sizing: border-box;
}
.swiper-item,
.swiper-banner {
	width: 100%;
	height: 100%;
	border-radius: 18rpx;
	overflow: hidden;
}

.notice-wrap {
	width: 100%;
	background: rgba(255, 255, 255, 1);
	box-shadow: 0px 0px 6rpx rgba(0, 0, 0, 0.16);
	margin: 30rpx 0;
}

.learn-category {
	padding: 0 30rpx;
	.learn-cate-title {
		font-size: 32rpx;
		font-weight: bold;
		margin-bottom: 20rpx;
	}
	.learn-cate-wrap {
		display: flex;
		flex-wrap: wrap;
	}
	.learn-cate-item {
		position: relative;
		width: 33.33%;
		height: 135rpx;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: center;
		color: #ffffff;
		.learn-cate-icon {
			width: 100%;
			height: 135rpx;
			position: absolute;
			top: 0;
			left: 0;
			z-index: -1;
		}
		.learn-label {
			font-size: 30rpx;
		}
		.learn-desc {
			font-size: 20rpx;
		}
	}
}

.hot-body {
	padding: 0 30rpx;
	.hot-body-title {
		font-size: 32rpx;
		margin-bottom: 20rpx;
		font-weight: bold;
		margin-top: 30rpx;
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
