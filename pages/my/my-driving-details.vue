<template>
	<view class="my-driving-details">
		<cu-custom isBack bgColor="bg-white text-black"><block slot="content">报名驾校</block></cu-custom>

		<view class="container padding-lr padding-tb-sm">
			<view class="bg-white flex flex-direction align-center card padding-tb">
				<view class="self-start text-lg padding-lr-xs">
					<text class="cuIcon-titles text-green"></text>
					<text class="text-black">班型费用</text>
				</view>
				<view class="price text-price text-red">{{ info.price }}</view>
				<view class="text-xl text-bold text-black">
					<text class="text-green">{{ info.driving_first }}</text>
					<text style="position: relative;top:-3upx;padding: 0 15upx;">|</text>
					{{ info.driving_class }}
				</view>
				<view class="text-df text-999">车辆分配：{{ info.driving_referral }}</view>
			</view>
			<view class="card bg-white padding-tb-sm">
				<view class="text-lg padding-lr-xs">
					<text class="cuIcon-titles text-green"></text>
					<text class="text-black">驾校信息</text>
				</view>
				<view class="flex align-center padding-top-sm padding-lr">
					<image :src="info.driving_images" class="img" mode="aspectFill"></image>
					<view class="flex-sub overflow">
						<view class="flex align-center">
							<view class="flex-sub text-lg text-black text-bold text-cut">{{ info.driving_name }}</view>
							<view @click="toDetails" class="text-green padding-left-sm">驾校详情></view>
						</view>
						<view class="padding-tb-xs">{{ info.driving_phone }}</view>
						<view class="flex align-center overflow">
							<image src="../../static/location-address-icon.png" class="location-address-icon" mode=""></image>
							<text class="flex-sub padding-lr-xs text-cut">{{ info.driving_address }}</text>
						</view>
					</view>
				</view>
			</view>
			<view class="card bg-white padding-tb-sm">
				<view class="self-start text-lg padding-lr-xs">
					<text class="cuIcon-titles text-green"></text>
					<text class="text-black">报名信息</text>
				</view>
				<view class="padding-top-sm text-df padding-lr ">
					<view class="">学员姓名：{{ info.name }}</view>
					<view class="">联系方式：{{ info.phone }}</view>
					<view class="">所在学校：{{ info.school }}</view>
					<view class="">报名时间：{{ info.addtime }}</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
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
		getData() {
			this.$http.post('/api/driving/driving_order', { id: this.id }).then(res => {
				if (res.code == 0) {
					this.info = res.data;
				}
			});
		},
		toDetails() {
			uni.navigateTo({
				url: `/pages/composite/driving-details?id=${this.info.jid}`
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background: #f2f2f2;
}
.my-driving-details {
	.container {
		.card {
			box-shadow: 0px 0px 10px 0px rgba(152, 152, 152, 0.2);
			border-radius: 20upx;
			margin-bottom: 20upx;
			.price {
				font-size: 80upx;
			}
			.img {
				width: 150upx;
				height: 150upx;
				border-radius: 20upx;
				margin-right: 20upx;
			}
		}
	}
}
</style>
