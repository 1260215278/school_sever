<template>
	<view class="my-coupons">
		<cu-custom isBack bgColor="bg-white text-black"><block slot="content">优惠券</block></cu-custom>
		<view class="tabs-wrap tabs grid col-3" :style="{ top: CustomBar + 'px' }">
			<view @click="changeTab(0)" class="tab-item flex justify-center align-center" :class="currentTab == 0 ? 'active' : ''">可使用</view>
			<view @click="changeTab(1)" class="tab-item flex justify-center align-center" :class="currentTab == 1 ? 'active' : ''">已使用</view>
			<view @click="changeTab(2)" class="tab-item flex justify-center align-center" :class="currentTab == 2 ? 'active' : ''">已过期</view>
		</view>
		<view class="container" style="padding-top: 80upx">
			<!-- 列表 -->
			<view class="list padding-lr padding-tb-xs">
				<view v-for="(item, index) in list" :key="index" class="list-item margin-tb-xs text-white">
					<image v-if="currentTab === 0" class="coupons-bg" src="/static/coupons-bg.png" mode="aspectFill"></image>
					<image v-if="currentTab === 1 || currentTab === 2" class="coupons-bg" src="/static/coupons-bg-gray.png" mode="aspectFill"></image>
					<view class="coupons-left flex flex-direction align-center">
						<text class="discout-amout text-bold">¥{{ item.discount }}</text>
						<view v-if="item.type == 1" class="reach-condition">满{{ item.condition }}可用</view>
						<view v-if="item.type == 2" class="reach-condition">无门槛</view>
						<view v-if="item.type == 3" class="reach-condition">首单优惠</view>
					</view>
					<view class="coupons-right flex flex-direction justify-between padding-tb-sm">
						<view class="flex align-center text-lg">
							<image class="store-icon" src="/static/store-icon.png" mode=""></image>
							<text class="flex-sub padding-lr-sm text-cut">{{ item.title ? item.title : item.store_name }}</text>
						</view>
						<view class="text-xs">有效期：{{ item.start_time + '~' + item.due_time }}</view>
						<block>
							<button v-if="currentTab === 0" class="coupons-receive cu-btn round sm bg-white text-orange">立即使用</button>
							<text v-if="currentTab === 1" class="padding-bottom-xs text-hf">已使用</text>
							<text v-if="currentTab === 2" class="padding-bottom-xs text-hf">已过期</text>
						</block>
					</view>
				</view>
				<tui-tips v-if="nodata" imgUrl="/static/img_nodata.png" fixed>暂无数据</tui-tips>
			</view>
		</view>

		<login-modal></login-modal>
	</view>
</template>

<script>
import common from '@/utils/mixins/common.js';
import tuiTips from '@/components/tips/tips.vue';

export default {
	mixins: [common],
	components: { tuiTips },
	data() {
		return {
			CustomBar: this.CustomBar,
			currentTab: 0, // 0 可使用 1 已使用 2 已过期
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
		changeTab(val) {
			if (val != this.currentTab) {
				this.currentTab = val;
				this.page = 1;
				this.getList();
			}
		},
		getList() {
			uni.showLoading({ title: '加载中...', mask: true });
			this.$http.post('/api/service/my_coupon', { type: this.currentTab + 1, page: this.page }).then(res => {
				uni.hideLoading();
				if (res.code == 0) {
					this.lastPage = res.data.last_page;
					this.nodata = !res.data.data.length;
					if (this.page > 1) {
						this.list.push(...res.data.data);
					} else {
						this.list = res.data.data;
					}
				} else {
					this.list = [];
					this.nodata = true;
				}
			});
		}
	}
};
</script>

<style lang="scss">
.my-coupons {
	.tabs {
		position: fixed;
		left: 0;
		right: 0;
		height: 80upx;
		z-index: 9;
		background: #ffffff;
		.tab-item {
			height: 100%;
			font-size: 30upx;
			color: #999;
			position: relative;
			transition: all 0.2s;
			&.active {
				color: #26d499;
				&:after {
					background: rgba(38, 212, 153, 1);
				}
			}
			&:after {
				content: '';
				width: 36upx;
				height: 4upx;
				background: transparent;
				border-radius: 2upx;
				position: absolute;
				bottom: 0;
				left: 50%;
				transform: translateX(-50%);
			}
		}
	}

	.container {
		.list {
			.list-item {
				position: relative;
				.coupons-bg {
					width: 100%;
					height: 180upx;
				}
				.coupons-left {
					position: absolute;
					top: 50%;
					left: 40upx;
					transform: translateY(-50%);
					.discout-amout {
						font-size: 56upx;
					}
				}
				.coupons-right {
					position: absolute;
					left: 214upx;
					right: 0;
					top: 0;
					bottom: 0;
					.store-icon {
						width: 36upx;
						height: 36upx;
					}
					.coupons-receive {
						width: 150upx;
						font-size: 24upx;
					}
				}
			}
		}
	}
}
</style>
