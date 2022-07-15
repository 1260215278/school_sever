<template>
	<view>
		<view class="list">
			<view @click="toGroup(item.id)" v-for="(item, index) in list" :key="index" class="list-item">
				<image :src="item.goods_img_path" mode="aspectFill" class="food-img"></image>
				<view class="item-desc">
					<view class="name text-cut">{{ item.goods_name }}</view>
					<view class="sales text-cut">月售{{ item.sales_num + item.goods_unit }}</view>
					<view class="price-wrap">
						<text>￥{{ item.group_price }}</text>
						<button class="bnt-group" size="mini">
							去拼团
							<text class="cuIcon-right"></text>
						</button>
					</view>
				</view>
			</view>
		</view>
		<tips v-if="nodata" :fixed="true" imgUrl="/static/img_nodata.png">暂无数据</tips>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
export default {
	data() {
		return {
			list: [],
			nodata: false
		};
	},
	computed: {
		...mapGetters(['schoolinfo'])
	},
	onShow() {
		this.getGroupGoods();
	},
	methods: {
		async getGroupGoods() {
			let res = await this.$http.post('/api/takeout/groupbuy_goods_takeout_list', { school_id: this.schoolinfo.id });
			if (res.code == 0) {
				this.nodata = !res.data.length;
				this.list = res.data;
			}
		},

		toGroup(id) {
			uni.navigateTo({ url: '/pages/home/food-details?id=' + id });
		}
	}
};
</script>

<style lang="scss" scoped>
.list {
	padding: 30rpx;
	.list-item {
		display: flex;
		margin-bottom: 30rpx;
		.item-desc {
			flex: 1;
			overflow: hidden;
		}
		.food-img {
			width: 150rpx;
			height: 150rpx;
			border-radius: 20rpx;
			margin-right: 20rpx;
		}
		.name {
			font-size: 30rpx;
			padding-top: 5rpx;
		}
		.sales {
			font-size: 22rpx;
			color: #989898;
			margin: 10rpx 0 15rpx 0;
		}
		.price-wrap {
			display: flex;
			align-items: center;
			justify-content: space-between;
			font-size: 38rpx;
			color: #ff3e47;
		}
		.bnt-group {
			background-color: #ff3e47;
			border-radius: 28rpx;
			color: #ffffff;
			font-size: 24rpx;
			padding: 0 20rpx;
			margin: 0;
		}
	}
}
</style>
