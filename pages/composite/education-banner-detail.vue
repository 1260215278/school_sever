<template>
	<view v-if="info" class="page">
		<view class="banner-title">{{ title }}</view>
		<view class="banner-subtitle">{{ info.summary }}</view>
		<view class="banner-time">{{ info.date }}</view>
		<jyf-parser :html="info.content" ref="article"></jyf-parser>
	</view>
</template>

<script>
export default {
	data() {
		return {
			id: '',
			info: '',
			title: '',
			html: ''
		};
	},
	onLoad(options) {
		this.id = options.id;
		this.title = options.title;
		this.getBannerDetail();
	},
	methods: {
		async getBannerDetail() {
			let res = await this.$http.post('/api/training/get_article_detail', { id: this.id }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
			if (res.code == 0) {
				this.info = res.data;
			}
		}
	}
};
</script>

<style lang="scss" scoped>
.page {
	padding: 30rpx;
	.banner-title {
		font-size: 32rpx;
		font-weight: bold;
		text-align: center;
		padding-bottom: 20rpx;
	}
	.banner-subtitle {
		font-size: 28rpx;
		color: #666;
		text-align: center;
		padding-bottom: 10rpx;
	}
	.banner-time {
		color: #999;
		font-size: 26rpx;
		text-align: center;
		padding-bottom: 20rpx;
	}
}
</style>
