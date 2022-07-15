<template>
	<view class="home-coupons">
		<cu-custom bgColor="bg-white" isBack><view slot="content">优惠券</view></cu-custom>

		<!-- 列表 -->
		<view class="list padding-lr padding-tb-xs">
			<view v-for="(item, index) in list" :key="index" class="list-item margin-tb-xs text-white">
				<image class="coupons-bg" src="../../static/coupons-bg.png" mode="aspectFill"></image>
				<view class="coupons-left flex flex-direction align-center">
					<text class="discout-amout text-bold">¥{{ item.discount }}</text>
					<view v-if="item.type == 1" class="reach-condition">满{{ item.condition }}可用</view>
					<view v-if="item.type == 2" class="reach-condition">无门槛</view>
					<view v-if="item.type == 3" class="reach-condition">首单优惠</view>
				</view>
				<view class="coupons-right flex flex-direction justify-between padding-tb-sm">
					<view class="flex align-center text-lg">
						<image class="store-icon" src="../../static/store-icon.png" mode=""></image>
						<text class="flex-sub padding-lr-sm text-cut">{{ item.store_name }}</text>
					</view>
					<view class="text-xs">有效期：{{ item.start_time + '~' + item.due_time }}</view>
					<block>
						<button @click="toReceive(item)" v-if="!item.is_receive" class="coupons-receive cu-btn round sm bg-white text-yellow">立即领取</button>
						<text v-if="item.is_receive" class="padding-bottom-xs">已领取</text>
					</block>
				</view>
			</view>

			<tui-tips v-if="nodata" fixed imgUrl="../../static/img_nodata.png">暂无数据</tui-tips>
			<uni-load-more v-if="list.length" :status="loadingStatus"></uni-load-more>
		</view>

		<login-modal></login-modal>
	</view>
</template>

<script>
import common from '@/utils/mixins/common.js';
import tuiTips from '@/components/tips/tips.vue';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import { mapGetters } from 'vuex';

export default {
	mixins: [common],
	components: { tuiTips, uniLoadMore },
	data() {
		return {
			already: true,
			list: [],
			page: 1,
			lastPage: 1,
			nodata: false,
			loadingStatus: 'more',
			pullUpOn: false
		};
	},
	computed: {
		...mapGetters(['token', 'schoolinfo'])
	},
	onLoad() {
		this.getList();
	},
	onPullDownRefresh() {
		this.pullUpOn = true;
		this.page = 1;
		this.getList();
	},
	onReachBottom() {
		this.loadingStatus = 'loading';
		if (this.page < this.lastPage) {
			this.page++;
			this.getList();
		} else {
			this.loadingStatus = 'noMore';
		}
	},
	methods: {
		getList() {
			// 优惠券
			this.$http.post('/api/service/coupon', { school_id: this.schoolinfo.id, page: this.page }).then(res => {
				if (res.code == 0) {
					this.lastPage = res.data.last_page;
					this.nodata = !res.data.data.length;
					if (this.page > 1) {
						this.list.push(...res.data.data);
						this.loadingStatus = 'more';
					} else {
						this.list = res.data.data;
						if (res.data.data.length < 10) {
							this.loadingStatus = 'noMore';
						} else {
							this.loadingStatus = 'more';
						}
					}
				} else {
					this.list = [];
					this.nodata = true;
				}
			});
		},
		// 立即领取
		toReceive(item) {
			if (!this.token) {
				this.setLoginModal(true);
			}
			this.$http.post('/api/service/receive_coupon', { coupon_id: item.id }).then(res => {
				if (res.code == 0) {
					item.is_receive = 1;
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			});
		}
	}
};
</script>

<style lang="scss">
.home-coupons {
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
</style>
