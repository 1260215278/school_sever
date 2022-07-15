<template>
	<view class="composite-behalf">
		<uni-nav-bar title="代取快递" leftIcon="back" fixed :statusBar="true" @clickLeft="clickLeft"></uni-nav-bar>
		<view class="container">
			<view class="list padding-lr padding-top-sm">
				<view v-for="(item, index) in list" :key="index" class="list-item padding-lr padding-tb-sm">
					<view class="flex justify-between align-center">
						<view class="flex-sub flex align-center overflow">
							<image :src="item.avatar" class="behalf-img" mode="aspectFill"></image>
							<view class="flex-sub flex flex-direction padding-lr-sm overflow">
								<view class="text-df text-cut">{{ item.nickname }}</view>
								<view class="text-xs text-999">{{ dateFormat(item.addtime) }}</view>
							</view>
						</view>
						<view class="text-green text-df">{{ statusTxt(item.type) }}</view>
					</view>
					<view class="padding-top-sm flex">
						<text class="text-999">收件地址：</text>
						<text class="flex-sub">{{ item.site }}</text>
					</view>
					<view class="">
						<text class="text-999">送达时间：</text>
						<text>{{ item.reach_d + ' ' + item.reach_time }}</text>
					</view>
				</view>
				<tui-tips v-if="nodata" fixed imgUrl="../../static/img_nodata.png">暂无数据</tui-tips>
				<uni-load-more v-if="list.length > 9" :status="loadingStatus"></uni-load-more>
			</view>
			<view class="actions-fixed">
				<view class="flex flex-direction align-center">
					<image @click="toMyBehalf" src="../../static/issue-icon.png" class="issue-btn margin-bottom-xl" mode=""></image>
					<image @click="toIssue" src="../../static/add-icon.png" class="issue-my" mode=""></image>
				</view>
			</view>
		</view>

		<login-modal></login-modal>
	</view>
</template>

<script>
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
import common from '@/utils/mixins/common.js';
import { mapGetters } from 'vuex';
import { dateUtils } from '@/utils/util.js';
import tuiTips from '@/components/tips/tips.vue';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';

export default {
	components: { uniNavBar, tuiTips, uniLoadMore },
	mixins: [common],
	data() {
		return {
			page: 1,
			lastPage: 1,
			list: [],
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
		clickLeft() {
			uni.navigateBack();
		},
		statusTxt(type) {
			if (type == 0) {
				return '待支付';
			} else if (type == 1) {
				return '待接单';
			} else if (type == 2) {
				return '配送中';
			} else if (type == 3) {
				return '已完成';
			} else {
				return '';
			}
		},
		dateFormat(val) {
			if (val) {
				return dateUtils.humanize(val * 1000);
			} else {
				return '';
			}
		},
		getList() {
			this.$http.post('/api/personal/orders', { page: this.page }).then(res => {
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
					if (this.pullUpOn) {
						this.pullUpOn = false;
						uni.stopPullDownRefresh();
						uni.showToast({
							title: '刷新成功',
							icon: 'none'
						})
					}
				}
			});
		},
		toIssue() {
			if (!this.token) {
				this.setLoginModal(true);
				return;
			}
			uni.navigateTo({
				url: '/pages/composite/behalf-issue'
			});
		},
		toMyBehalf() {
			uni.navigateTo({
				url: '/pages/my/behalf-order'
			});
		}
	}
};
</script>

<style lang="scss">
.composite-behalf {
	/deep/.uni-navbar--border {
		border-color: transparent;
	}
	.behalf-img {
		width: 56upx;
		height: 56upx;
		border-radius: 50%;
		overflow: hidden;
	}
	.container {
		position: relative;
		.list {
			.list-item {
				box-shadow: 0px 0px 10px 0px rgba(152, 152, 152, 0.2);
				border-radius: 20upx;
				margin-bottom: 20upx;
			}
		}
		.actions-fixed {
			position: fixed;
			right: 30upx;
			bottom: 150upx;
			.issue-btn,
			.issue-my {
				width: 88upx;
				height: 88upx;
			}
		}
	}
}
</style>
