<template>
	<view class="dynamic-new-details">
		<!-- #ifdef H5 -->
		<cu-custom isBack bgColor="bg-white text-black"><block slot="content">详情</block></cu-custom>
		<!-- #endif -->

		<view class="container">
			<view class="bg-white padding-lr padding-tb-sm">
				<view class="text-df text-black">{{ info.title }}</view>
				<view class="flex align-center justify-between padding-top-xs">
					<view class="flex align-center">
						<image src="../../static/school-icon.png" class="school-icon" mode=""></image>
						<text class="padding-lr-xs">{{ info.school_name }}</text>
					</view>
					<view class="">{{ dataFormat(info.addtime) }}</view>
				</view>
			</view>
			<view class="padding margin-top-sm bg-white"><jyf-parser v-if="info.details" :html="info.details" @preview="preview" @navigate="navigate"></jyf-parser></view>
		</view>
	</view>
</template>

<script>
import { dateUtils } from '@/utils/util.js';

export default {
	data() {
		return {
			id: '',
			info: {}
		};
	},
	onLoad(option) {
		this.id = option.id;
		this.getData();
	},
	methods: {
		dataFormat(val) {
			if (val) {
				return dateUtils.humanize(val * 1000);
			} else {
				return '';
			}
		},
		getData() {
			this.$http.post('/api/school/journalism_details', { nid: this.id }).then(res => {
				if (res.code == 0) {
					this.info = res.data;
				}
			});
		},
		preview(src, e) {
			// do something
		},
		navigate(href, e) {
			// do something
		}
	}
};
</script>

<style lang="scss">
page {
	background: #f5f5f5;
}
.dynamic-new-details {
	.container {
		.school-icon {
			width: 28upx;
			height: 28upx;
		}
	}
}
</style>
