<template>
	<view>
		<uni-nav-bar
			:statusBar="true"
			class="navBar"
			:title="title"
			leftIcon="back"
			color="#333"
			:fixed="true"
			:shadow="false"
			@clickLeft="clickLeft"
			:border="true"
			backgroundColor="#fff"
		></uni-nav-bar>

		<view class="hot-body-list">
			<view @click="navDetail(item)" v-for="(item, index) in list" :key="index" class="hot-body-item">
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

		<tips v-if="nodata" :fixed="true" imgUrl="../../static/img_nodata.png">暂无数据</tips>
	</view>
</template>

<script>
export default {
	data() {
		return {
			cid: '',
			search: '',
			title: '',
			list: [],
			page: 1,
			lastPage: 1,
			nodata: false
		};
	},
	onLoad(options) {
		if (options.cid) this.cid = options.cid;
		if (options.title) this.title = options.title;
		if (options.search) this.search = options.search;
		this.getEducationList();
	},
	onReachBottom() {
		if (this.page < this.lastPage) {
			this.page++;
			this.getEducationList();
		}
	},
	methods: {
		clickLeft() {
			uni.navigateBack();
		},
		async getEducationList() {
			let res = await this.$http.post('/api/training/get_institution_list', { page: this.page, limit: 10, cid: this.cid, search: this.search });
			if (res.code == 0) {
				this.nodata = !res.data.data.length;
				this.lastPage = res.data.last_page;
				if (this.page > 1) this.list.push(...res.data.data);
				else this.list = res.data.data;
			}
		},
		navDetail(item) {
			item.visit++;
			uni.navigateTo({ url: `/pages/composite/organization-detail?id=${item.id}&title=${item.name}` });
		}
	}
};
</script>

<style lang="scss" scoped>
.hot-body-list {
	padding: 30rpx;
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
</style>
