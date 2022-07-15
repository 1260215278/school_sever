<template>
	<view class="takeout">
		<cu-custom isBack bgColor="bg-white">
			<view slot="content">{{ title }}</view>
		</cu-custom>

		<view class="condition-search bg-white" :style="[{ top: CustomBar + 'px' }]">
			<view class="input-wrap padding-lr flex align-center" style="height:100%">
				<uni-search-bar class="search-box" :radius="20" bgColor="#EBEBEB" cancelButton="auto" @cancel="inputCancel" @confirm="inputConfirm" @input="inputChange"></uni-search-bar>
			</view>
		</view>

		<view v-if="list.length" class="takeout-list-wrapper list margin-sm padding-bottom-lg">
			<view @click="toDetails(item.id, item.status, item.store_type)" v-for="(item, index) in list" :key="index" class="padding-sm bg-white">
				<!-- <takeout-card v-if="item.store_type == 1" :list="list" @toDetails="toDetails"></takeout-card> -->
				<block v-if="item.store_type == 1">
					<view class="flex justify-between">
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
				</block>
				<!-- <life-card v-if="item.store_type == 2" :list="list" @toDetails="toDetails"></life-card> -->
				<block v-if="item.store_type == 2">
					<view class="flex justify-between">
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
				</block>
			</view>
			<tui-tips v-if="nodata" fixed imgUrl="../../static/img_nodata.png">暂无数据</tui-tips>
			<uni-load-more v-if="list.length > 7" :status="loadingStatus"></uni-load-more>
		</view>
	</view>
</template>

<script>
import takeoutCard from '@/components/home/takeout-card.vue';
import lifeCard from '@/components/home/life-card.vue';
import tuiTips from '@/components/tips/tips.vue';
import { mapGetters } from 'vuex';
import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue';
import { debounce } from '@/utils/util.js';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import tuiRate from '@/components/rate/rate.vue';

export default {
	components: { takeoutCard, tuiTips, uniSearchBar, uniLoadMore, lifeCard, tuiRate },
	data() {
		return {
			CustomBar: this.CustomBar,
			title: '',
			id: '',
			list: [],
			page: 1,
			lastPage: 1,
			nodata: false,
			loadingStatus: 'more',
			keywords: '' // 搜索关键字
		};
	},
	computed: {
		...mapGetters(['schoolinfo'])
	},
	onLoad(option) {
		if (option.title) {
			this.title = option.title;
		}
		if (option.id) {
			this.id = option.id;
		}
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
			let params = { school_id: this.schoolinfo.id, page: this.page, keywords: this.keywords, store_cate: this.id };
			this.$http.post('/api/service/search_store', params).then(res => {
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
						});
					}
				} else {
					this.list = [];
					this.nodata = true;
				}
			});
		},

		// 取消输入
		inputCancel() {},
		// 输入确认搜索
		inputConfirm(e) {
			this.keywords = e.value;
			this.page = 1;
			this.getList();
		},
		inputChange: debounce(function(e) {
			this.keywords = e.value;
			this.page = 1;
			this.getList();
		}, 1000),

		// 跳转详情
		toDetails(id, status, type) {
			if (status == 0) return;
			let url;
			if (type == 1) {
				url = `/pages/home/takeout-details?id=${id}`;
			} else {
				url = `/pages/home/life-details?id=${id}`;
			}
			uni.navigateTo({
				url: url
			});
		}
	}
};
</script>

<style lang="scss">
.condition-search {
	position: fixed;
	left: 0;
	right: 0;
	z-index: 9;
	height: 80upx;
	.search-box {
		height: 72upx;
		padding: 0;
		flex: 1;
		/deep/ .uni-searchbar__box {
			border: 0;
		}
	}
	.condition-sort {
		.up {
			width: 0;
			height: 0;
			border: 10upx solid transparent;
			border-bottom-color: #ccc;
			border-top-width: 0;
			margin-bottom: 5upx;
			&.active {
				border-bottom-color: #333;
			}
		}
		.down {
			width: 0;
			height: 0;
			border: 10upx solid transparent;
			border-top-color: #ccc;
			border-bottom-width: 0;
			&.active {
				border-top-color: #333;
			}
		}
	}
}
.takeout-list-wrapper {
	margin-top: 90upx;
}

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
.life-img {
	width: 140upx;
	height: 124upx;
	border-radius: 8px;
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
</style>
