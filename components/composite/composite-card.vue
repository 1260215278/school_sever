<template>
	<view class="list-item padding-sm">
		<view class="flex justify-between align-center">
			<view class="flex-sub flex align-center overflow">
				<image class="avatar" :src="item.avatar" mode="aspectFill"></image>
				<view class="flex-sub padding-lr-sm flex flex-direction overflow">
					<view class="text-lg flex align-center overflow">
						<text :class="item.fage == 1 || item.fage == 3 ? 'text-green' : 'text-red'">{{ issueTypeTxt(item.fage) }}</text>
						<text class="text-xl margin-xs">|</text>
						<text class="flex-sub text-cut">{{ item.user_name }}</text>
					</view>
					<view class="text-gray">{{ item.addtime }}</view>
				</view>
			</view>
			<view v-if="item.fage == 1 || item.fage == 2" class="text-red text-xxl text-price text-bold">{{ item.price }}</view>
		</view>
		<view class="text-lg padding-top-sm">
			<text v-if="item.fage == 1" class="text-gray">{{ tagsText(item.message) }}</text>
			<text class="padding-lr-xs">{{ item.title }}</text>
		</view>
		<view class="padding-top-sm grid col-3 grid-square">
			<view v-for="(em, i) in item.sort_images" :key="i" class="bg-img"><image class="idle-img" :src="em" mode="aspectFill"></image></view>
		</view>
		<view class="flex justify-between">
			<view class="flex align-center">
				<image class="location-address-icon" src="../../static/location-address-icon.png" mode=""></image>
				<text class="text-gray padding-lr">{{ item.school_city + ' · ' + item.school_name }}</text>
			</view>
			<view class="flex align-center text-grey">
				<view class="flex align-center margin-right-lg">
					<image class="views-icon margin-lr-xs" src="../../static/views-icon.png" mode=""></image>
					<text>{{ item.count }}</text>
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
export default {
	props: {
		item: {
			type: Object,
			default() {
				return {};
			}
		}
	},
	methods: {
		// 标签转换
		tagsText(val) {
			if (val) {
				let arr = val.split(',');
				let txt = '';
				for (let i = 0; i < arr.length; i++) {
					txt += '#' + arr[i] + ' ';
				}
				return txt;
			} else {
				return '';
			}
		},
		// 发布类型转换
		issueTypeTxt(val) {
			if (val) {
				if (val == 1) {
					return '发布';
				} else if (val == 2) {
					return '需求';
				} else if (val == 3) {
					return '我丢失的';
				} else {
					return '我捡到的';
				}
			} else {
				return '';
			}
		}
	}
};
</script>

<style lang="scss">
.list-item {
	margin-bottom: 20upx;
	box-shadow: 0px 0px 20upx 0px rgba(152, 152, 152, 0.2);
	border-radius: 20upx;
	.avatar {
		width: 88upx;
		height: 88upx;
		border-radius: 50%;
	}
	.idle-img {
		border-radius: 20upx;
	}
	.location-address-icon {
		width: 22upx;
		height: 28upx;
	}
	.views-icon,
	.evaluate-icon {
		width: 28upx;
		height: 28upx;
	}
}
</style>
