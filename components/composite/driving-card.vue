<template>
	<view class="list-item padding-sm flex justify-between ">
		<image class="img margin-right-sm" :src="item.driving_images" mode=""></image>
		<view class="right flex-sub flex flex-direction justify-between">
			<view class=" flex justify-between align-center">
				<text class="text-lg text-bold text-cut">{{ item.driving_name }}</text>
				<text class="text-gray">{{ item.distances }}</text>
			</view>
			<view class="text-cut text-grey">{{ item.driving_describe }}</view>
			<view class="flex justify-between align-center">
				<view class="text-xl text-red">
					¥{{ item.price }}
					<text class="text-gray text-sm">起</text>
				</view>
				<view class="text-grey flex align-center">
					<image src="../../static/views-icon.png" class="views-icon margin-lr-xs" mode=""></image>
					{{ item.count }}
				</view>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	props: {
		item: {
			type: Object,
			default() {
				return {};
			}
		}
	}
};
</script>

<style lang="scss">
	// 列表
	.list-item {
		margin-bottom: 20upx;
		box-shadow: 0px 0px 20upx 0px rgba(152, 152, 152, 0.2);
		border-radius: 20upx;
		.img {
			width: 150upx;
			height: 150upx;
			border-radius: 20upx;
		}
		.right {
			overflow: hidden;
			.views-icon {
				width: 28upx;
				height: 28upx;
			}
		}
	}
</style>
