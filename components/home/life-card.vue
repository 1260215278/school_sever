<template>
	<!-- 生活卡片 -->
	<view class="card-wrap padding-lr">
		<view class="list padding-sm bg-white">
			<!-- 生活 -->
			<view
				@click="$emit('toDetails', item.id, item.status)"
				v-for="(item, index) in list"
				:key="index"
				class="flex justify-between"
				:class="list.lenth - 1 == index ? 'margin-bottom' : ''"
			>
				<image class="life-img margin-right-sm" :src="item.store_avatar_path" mode="aspectFill"></image>
				<view class="right flex-sub flex flex-direction justify-between">
					<view class="text-bold text-df text-cut flex">
						<text class="flex-sub text-cut">{{ item.store_name }}</text>
						<text v-if="item.status == 0" class="text-red">暂停营业</text>
				</view>
					<view class=""><tui-rate :current="item.star" :disabled="true" :size="20" :hollow="true" active="#FFD200"></tui-rate></view>
					<view class="flex justify-between align-center">
						<text>
							<text class="text-red">￥</text>
							<text class="text-lg text-red text-bold">{{ item.price }}</text>
							<text class="">起</text>
						</text>
						<text>{{ item.distances }}</text>
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
	components: { tuiRate, tuiTips },
	name: 'lifeCard',
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
	.right {
		overflow: hidden;
	}
	.life-img {
		width: 140upx;
		height: 124upx;
		border-radius: 8px;
		flex-shrink: 0;
	}
}
</style>
