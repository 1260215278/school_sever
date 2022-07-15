<template>
	<view>
		<uni-nav-bar fixed statusBar leftIcon="back" title="报名教育" @clickLeft="clickLeft" :border="false" shadow></uni-nav-bar>

		<view class="list">
			<navigator :url="`/pages/my/education-detail?id=${item.order_id}`" v-for="(item, index) in list" :key="index" class="list-item">
				<image :src="item.logo" mode="aspectFill" class="item-logo"></image>
				<view class="item-desx">
					<view class="name">{{ item.institution_name }}</view>
					<view class="class">
						<text class="class-label">班型：</text>
						<text class="class-value">{{ item.class_name }}</text>
					</view>
					<view class="time">{{ item.class_time }}</view>
					<view class="price">￥{{ item.price }}</view>
				</view>
			</navigator>
		</view>

		<tips v-if="nodata" :fixed="true" imgUrl="/static/img_nodata.png">暂无订单</tips>
		
		<login-modal></login-modal>
	</view>
</template>

<script>
	import LoginModal from '@/components/login/login-modal.vue'
export default {
	components: { LoginModal },
	data() {
		return {
			list: [],
			page: 1,
			lastPage: 1,
			nodata: false
		};
	},
	onLoad() {
		this.getList();
	},
	methods: {
		async getList() {
			let res = await this.$http.post('/api/training/my_order_list');
			if (res.code == 0) {
				this.nodata = !res.data.length;
				this.list = res.data;
			}
		},
		clickLeft() {
			uni.navigateBack();
		}
	}
};
</script>

<style lang="scss" scoped>
.list {
	padding: 20rpx 30rpx;
	.list-item {
		background: rgba(255, 255, 255, 1);
		box-shadow: 0px 0px 6rpx rgba(0, 0, 0, 0.16);
		border-radius: 20rpx;
		display: flex;
		align-items: center;
		padding: 28rpx 20rpx;
		position: relative;
		margin-bottom: 20rpx;
	}
	.item-desx {
		flex: 1;
	}
	.item-logo {
		width: 116rpx;
		height: 86rpx;
		margin-right: 30rpx;
	}
	.name {
		font-size: 28rpx;
		font-weight: bold;
	}
	.class {
		font-size: 26rpx;
		padding: 15rpx 0;
	}
	.class-label,
	.time {
		color: #999;
	}
	.time {
		font-size: 26rpx;
		padding-right: 125rpx;
	}
	.price {
		font-size: 36rpx;
		font-weight: bold;
		color: #ff3e47;
		position: absolute;
		right: 30rpx;
		bottom: 25rpx;
	}
}
</style>
