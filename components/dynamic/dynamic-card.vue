<template>
	<view class="dynamic-list-item padding-sm">
		<!-- 用户信息 -->
		<view class="flex justify-between align-center">
			<view class="flex-sub flex align-center overflow">
				<image class="avatar" :src="item.avatar" mode="aspectFill"></image>
				<text class="flex-sub padding-lr-sm text-cut text-df">{{ item.user_name }}</text>
			</view>
			<text class="text-gray">{{ dataFormat(item.addtime) }}</text>
		</view>
		<!-- 内容 -->
		<view v-if="item.details" class="padding-top-sm text-df">{{ item.details }}</view>
		<!-- 图片 -->
		<view class="padding-top-sm grid col-3 grid-square">
			<!-- <view @click="viewImage" :data-url="em" v-for="(em, i) in item.images" :key="i" class="bg-img"><image class="img" :src="em" mode="aspectFill"></image></view> -->
			<view @click="$emit('viewImage', em, item.images, i)" :data-url="em" v-for="(em, i) in item.images" :key="i" class="bg-img">
				<image class="img" :src="em" mode="aspectFill"></image>
			</view>
			<!-- <view @click="viewImage(i, item.images)" :data-url="em" v-for="(em, i) in item.images" :key="i" class="bg-img"><image class="img" :src="em" mode="aspectFill"></image></view> -->
		</view>
		<!-- 地址 浏览量 点赞等 -->
		<view class="flex align-center justify-between">
			<view class="flex-sub flex align-center">
				<image class="location-gray-icon" src="../../static/location-gray-icon.png" mode=""></image>
				<text class="text-gray padding-lr-sm flex-sub">{{ item.school_city + ' · ' + item.school_name }}</text>
			</view>
			<view class="flex align-center text-grey">
				<view class="flex align-center">
					<image class="views-icon margin-lr-xs" src="../../static/views-icon.png" mode=""></image>
					<text>{{ item.num }}</text>
				</view>
				<view class="flex align-center padding-lr-xl">
					<image @click.stop="$emit('liked', item)" v-if="item.fage == 2" class="like-icon margin-lr-xs" src="../../static/like-icon.png" mode=""></image>
					<image @click.stop="$emit('liked', item)" v-if="item.fage == 1" class="liked-icon margin-lr-xs" src="../../static/liked-icon.png" mode=""></image>
					<text :class="item.fage == 1 ? 'text-green' : ''">{{ item.dzcount }}</text>
				</view>
				<view class="flex align-center">
					<image class="evaluate-icon margin-lr-xs" src="../../static/evaluate-icon.png" mode=""></image>
					<text>{{ item.evaluate }}</text>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
import { dateUtils } from '@/utils/util.js';

export default {
	props: {
		item: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	onUnload() {
		uni.removeStorageSync('imgPreviewPicList');
		uni.removeStorageSync('currentImgIndex');
	},
	methods: {
		dataFormat(val) {
			if (val) {
				return dateUtils.humanize(val * 1000);
			} else {
				return '';
			}
		}
	}
};
</script>

<style lang="scss">
.dynamic-list-item {
	box-shadow: 0px 0px 20px 0px rgba(176, 176, 176, 0.15);
	border-radius: 20upx;
	margin-bottom: 20upx;
	.avatar {
		width: 56upx;
		height: 56upx;
		border-radius: 50%;
	}
	.img {
		border-radius: 20upx;
	}
}
</style>
