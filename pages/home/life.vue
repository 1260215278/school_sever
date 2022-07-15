<template>
	<view class="takeout">
		<cu-custom isBack bgColor="bg-white">
			<view slot="content">{{ title }}</view>
		</cu-custom>

		<view class="condition-search bg-white" :style="[{ top: CustomBar + 'px' }]">
			<view v-if="!isInput" class="grid col-3 align-center" style="height:100%">
				<view @click="conditionSearch" class="flex justify-center align-center text-df" data-sort-type="praise" :class="sortType == 'praise' ? 'text-green' : ''">
					好评
					<view class="condition-sort flex flex-direction margin-lr-xs">
						<view class="up" :class="sortType == 'praise' && sortOrder == 1 ? 'active' : ''"></view>
						<view class="down" :class="sortType == 'praise' && sortOrder == 2 ? 'active' : ''"></view>
					</view>
				</view>
				<view @click="conditionSearch" class="flex justify-center align-center text-df" data-sort-type="sales" :class="sortType == 'sales' ? 'text-green' : ''">
					销量
					<view class="condition-sort flex flex-direction margin-lr-xs">
						<view class="up" :class="sortType == 'sales' && sortOrder == 1 ? 'active' : ''"></view>
						<view class="down" :class="sortType == 'sales' && sortOrder == 2 ? 'active' : ''"></view>
					</view>
				</view>
				<view class="text-right text-xl"><text @click="toSearch" class="cuIcon-search padding-lr-lg"></text></view>
			</view>
			<view v-else class="input-wrap padding-lr flex align-center" style="height:100%">
				<uni-search-bar class="search-box" :radius="20" bgColor="#EBEBEB" cancelButton="always" @cancel="inputCancel" @confirm="inputConfirm" @input="inputChange"></uni-search-bar>
			</view>
		</view>

		<view class="takeout-list-wrapper padding-bottom-lg">
			<life-card v-if="list.length" :list="list" @toDetails="toDetails"></life-card>
			<tui-tips v-if="nodata" fixed imgUrl="../../static/img_nodata.png">暂无数据</tui-tips>
			<uni-load-more v-if="list.length > 7" :status="loadingStatus"></uni-load-more>
		</view>
	</view>
</template>

<script>
import lifeCard from '@/components/home/life-card.vue';
import tuiTips from '@/components/tips/tips.vue';
import { mapGetters } from 'vuex';
import uniSearchBar from '@/components/uni-search-bar/uni-search-bar.vue';
import { debounce } from '@/utils/util.js';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';

export default {
	components: { lifeCard, tuiTips, uniSearchBar, uniLoadMore },
	data() {
		return {
			CustomBar: this.CustomBar,
			title: '生活',
			id: '',
			sortType: '', // praise---好评价 sales---销量
			sortOrder: 1, // 0---升序 1---降序
			list: [],
			page: 1,
			lastPage: 1,
			nodata: false,
			pullUpOn: false,
			loadingStatus: 'more',
			isInput: false, //  是否显示输入框
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
	onPullDownRefresh() {
		this.pullUpOn = true;
		this.page = 1;
		this.getList();
	},
	methods: {
		getList() {
			let params = { school_id: this.schoolinfo.id, page: this.page, keywords: this.keywords };
			if (this.sortType == 'praise') {
				params.praise = this.sortOrder;
			} else if (this.sortType == 'sales') {
				params.sales = this.sortOrder;
			}
			this.$http.post('/api/life/store_life_list', params).then(res => {
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
					this.nodata = true;
					this.list = [];
				}
			});
		},
		// 去搜索关键词
		toSearch() {
			this.isInput = true;
		},
		// 取消输入
		inputCancel() {
			this.keywords = '';
			this.getList();
			this.isInput = false;
		},
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

		// 条件搜索
		conditionSearch(e) {
			if (e.currentTarget.dataset.sortType != this.sortType) {
				this.sortOrder = 1;
			}
			this.sortType = e.currentTarget.dataset.sortType;
			this.sortOrder = this.sortOrder == 1 ? 2 : 1;
			this.getList();
		},

		toDetails(id, status) {
			if (status == 0) return;
			uni.navigateTo({
				url: `/pages/home/life-details?id=${id}`
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
	padding-top: 90upx;
}
</style>
