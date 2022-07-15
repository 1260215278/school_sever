<template>
	<view class="lost-property-details">
		<uni-nav-bar leftIcon="back" :title="title" @clickLeft="clickLeft" fixed :statusBar="true"></uni-nav-bar>
		<view class="container">
			<view class="margin-lr padding-tb-sm flex align-center solid-bottom">
				<image src="../../static/avatar.png" class="avatar" mode="aspectFill"></image>
				<view class="flex-sub flex flex-direction justify-between overflow" style="height: 88upx">
					<view class="overflow flex justify-between align-center">
						<view class="flex-sub text-lg text-cut">小妖别跑小妖别跑小妖别跑小妖别跑小妖别跑小妖别跑小妖别跑小妖别跑小妖别跑小妖别跑小妖别跑小妖别跑小妖别跑</view>
						<view class="text-df text-999">2019-11-26</view>
					</view>
					<view class="flex align-center">
						<image src="../../static/location-address-icon.png" class="location-address-icon" mode=""></image>
						<text class="flex-sub padding-lr-xs text-666 text-cut">郑州·信息工程大学</text>
					</view>
				</view>
			</view>
			<!-- content -->
			<view class="padding-lr">
				<view class="padding-top-sm text-lg">三层置物架</view>
				<view class="padding-top-sm text-666 text-df">谁有宿舍置物架想出售的，请联系我，同学校的我可以自提，小伙伴们快联系我吧~</view>
				<view class="idle-img-wrap margin-tb-sm"><image src="../../static/BasicsBg.png" class="idle-img" mode="aspectFill"></image></view>
				<view class="idle-img-wrap margin-tb-sm"><image src="../../static/BasicsBg.png" class="idle-img" mode="aspectFill"></image></view>
			</view>
			<view class="comments-wrap padding-lr">
				<view class="flex justify-between align-center">
					<view class="text-df">全部评论（666）</view>
					<view class="flex align-center text-666">
						<image src="../../static/views-icon.png" class="views-icon margin-lr-xs" mode=""></image>
						666
					</view>
				</view>
				<view class="flex justify-between padding-top-sm">
					<image src="../../static/avatar.png" class="comment-avatar" mode="aspectFill"></image>
					<view class="flex-sub flex flex-direction overflow">
						<view class="flex justify-between align-center overflow">
							<view class="flex-sub text-df text-cut">地老天荒是何年 地老天荒是何年地老天荒是何年地老天荒是何年地老天荒是何年</view>
							<view class="text-999">16分钟前</view>
						</view>
						<view class="text-666">非常好非常好非常好非常好非常好非常好非常好。 非常好非常好非常好非常好非常好非常好非常好。非常好非常好非常好非常好非常好非常好非常好。</view>
						<view class="padding-lr padding-tb-sm bg-gray margin-sm" style="border-radius: 20upx;">
							<view class="flex flex-wrap">
								<text class="text-green">放羊的杨：</text>
								<text class="flex-sub">生日快乐呀呀呀呀生日快乐呀呀呀呀生日快乐呀呀呀呀生日快乐呀呀呀呀生日快乐呀呀呀呀生日快乐呀呀呀呀生日快乐呀呀呀呀生日快乐呀呀呀呀</text>
							</view>
							<view class="flex flex-wrap">
								<text class="text-green">布严控：</text>
								<text class="flex-sub">快乐快乐~</text>
							</view>
							<view class="flex flex-wrap">
								<text class="text-green">有哈哈：</text>
								<text class="flex-sub">哇哇哇哇哇，看着心情都很好啊~</text>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部操作条 -->
		<view class="actions-fixed">
			<view class="flex">
				<view class="flex flex-direction align-center justify-between text-xxl" style="height: 80upx">
					<image src="../../static/share-icon.png" class="share-icon" mode=""></image>
					<text class="text-xs">分享</text>
				</view>
			</view>
			<view class="">
				<button class="cu-btn bg-green round margin-left-sm">评论</button>
				<button class="cu-btn bg-red round margin-left-sm">立即联系</button>
			</view>
		</view>
	</view>
</template>
<script>
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
export default {
	components: { uniNavBar },
	data() {
		return {
			title: '我丢失的'
		};
	},
	methods: {
		clickLeft() {
			uni.navigateBack();
		}
	}
};
</script>
<style lang="scss">
.lost-property-details {
	/deep/.uni-navbar--border {
		border-color: transparent;
	}
	.container {
		padding-bottom: 100upx;
	}
	.avatar {
		width: 88upx;
		height: 88upx;
		border-radius: 50%;
		overflow: hidden;
		margin-right: 20upx;
	}
	.idle-img-wrap {
		width: 100%;
		height: 400upx;
		border-radius: 20upx;
		overflow: hidden;
		.idle-img {
			width: 100%;
			height: 100%;
		}
	}
	.comment-avatar {
		width: 68upx;
		height: 68upx;
		border-radius: 50%;
		overflow: hidden;
		margin-right: 10upx;
	}
	.actions-fixed {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		background: #ffffff;
		padding: 0 50upx;
		display: flex;
		justify-content: space-between;
		align-items: center;
		height: 100upx;
		box-shadow: 0px 0px 20px 0px rgba(176, 176, 176, 0.15);
	}
	.share-icon {
		width: 48upx;
		height: 48upx;
	}
	.collect-icon {
		width: 48upx;
		height: 48upx;
	}
}
</style>
