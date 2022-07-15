<template>
	<!-- 外卖卡片 -->
	<view class="card-wrap padding-lr">
		<view class="list padding-sm bg-white">
			<!-- 外卖 -->
			<view
				@click="$emit('toDetails', item.id, item.status, 1)"
				v-for="(item, index) in list"
				:key="index"
				class="flex justify-between"
				:class="listLength == index ? '' : 'margin-bottom'"
			>
				<image class="takeout-img margin-right-sm" :src="item.store_avatar_path" mode="aspectFill"></image>
				<view class="right flex-sub">
					<view class="text-cut text-bold text-df padding-bottom-xs text-black flex">
						<text class="flex-sub text-cut">{{ item.store_name }}</text>
						<text v-if="item.status == 0" class="text-red">暂停营业</text>
					</view>
					<view v-if="item.delivery_time" class="text-cut" style="border-radius: 10rpx;margin-bottom: 10rpx;">
						<view class="remark-bg">{{ item.delivery_time }}</view>
					</view>
					
					<view v-if="item.store_desc" class="text-cut" style="border-radius: 10rpx;margin-bottom: 10rpx;">
						{{ item.store_desc }}
					</view>
					<view class="score-sales flex align-center justify-between padding-bottom-xs">
						<view class="score margin-right-sm"><tui-rate :current="item.star" :size="20" :hollow="true" active="#FFD200" :disabled="true"></tui-rate></view>
						<view class="sales text-cut text-right">销量{{ item.counts }}</view>
					</view>
					<view class="padding-bottom-xs">
						起送￥{{ item.send_fee }}
						<text class="line">|</text>
						配送费￥{{ item.delive_fee }}
					</view>
					<view class="">
						<view v-for="(em, i) in item.coupon" :key="i" class="cu-tag line-red sm radius">{{ tagsTxt(em) }}</view>
					</view>
				</view>
			</view>
			<view v-if="showMore && list.length" class="more text-center padding-top-sm">
				<text @click="$emit('viewMore')" class="text-gray">查看更多</text>
				<text class="cuIcon-right"></text>
			</view>

			<tui-tips v-if="nodata" :fixed="false" imgUrl="../../static/img_nodata.png">暂无数据</tui-tips>
		</view>
	</view>
</template>

<script>
import tuiRate from '@/components/rate/rate.vue';
import tuiTips from '@/components/tips/tips.vue';

export default {
	name: 'takeoutCard',
	components: { tuiRate, tuiTips },
	props: {
		list: {
			type: Array,
			default() {
				return [];
			}
		},
		showMore: {
			type: Boolean,
			default: false
		},
		nodata: {
			type: Boolean,
			default: false
		}
	},
	computed: {
		listLength() {
			return this.list.length - 1;
		}
	},
	methods: {
		// 优惠券tags
		tagsTxt(item) {
			if (item) {
				if (item.type == 1) {
					return item.condition + '减' + item.discount;
				} else if (item.type == 2) {
					return item.discount + '无门槛';
				} else {
					return '首单减' + item.discount;
				}
			} else {
				return '';
			}
		}
	}
};
</script>

<style lang="scss">
// 列表
.card-wrap {
	.list {
		box-shadow: 0px 0px 20upx 0px rgba(176, 176, 176, 0.15);
		border-radius: 12upx;
	}
	.remark-bg {
		display: inline-block;
		background-color: #26d499;
		color: #fff;
		border-radius: 10rpx;
		padding: 6rpx 10rpx;
	}
	.right {
		overflow: hidden;
	}
	.takeout-img {
		width: 160upx;
		height: 140upx;
		border-radius: 8upx;
		flex-shrink: 0;
	}
	.score-sales {
		.score {
			flex-shrink: 0;
		}
		.sales {
			flex: 1;
		}
	}
}
</style>
