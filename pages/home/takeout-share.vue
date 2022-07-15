<template>
	<view class="takeout-share">
		<cu-custom isBack bgColor="bg-white"><block slot="content">分享</block></cu-custom>
		<image src="../../static/share-bg.png" class="share-bg" mode=""></image>
		<view class="content flex flex-direction align-center justify-center">
			<view class="share-qrcode-wrapper"><image src="../../static/share-qrcode.png" class="share-qrcode" mode=""></image></view>
			<view class="share-btn-wrapper"><image src="../../static/share-btn.png" class="share-btn" mode=""></image></view>
		</view>
	</view>
</template>

<script></script>

<style lang="scss">
.takeout-share {
	height: 100vh;
	display: flex;
	flex-direction: column;
	justify-content: center;
	.share-bg {
		width: 100%;
		height: 100%;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;
		bottom: 0;
		z-index: -1;
	}
	.content {
		.share-qrcode-wrapper {
			width: 580upx;
			height: 580upx;
			border-radius: 20upx;
			background: #ffffff;
			.share-qrcode {
				width: 100%;
				height: 100%;
			}
		}
		.share-btn-wrapper {
			padding: 100upx 0;
			.share-btn {
				width: 520upx;
				height: 100upx;
			}
		}
	}
}
</style>
