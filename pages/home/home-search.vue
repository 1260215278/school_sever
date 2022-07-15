<template>
	<view class="home-search">
		<cu-custom bgColor="bg-white" isBack>
			<view slot="content">{{ title }}</view>
		</cu-custom>

		<!-- search-input -->
		<view class="search flex justify-between align-center bg-white" :style="[{ top: CustomBar + 'px' }]">
			<view @click="getFocus" class="search-box flex-sub flex align-center bg-ebebeb">
				<text class="cuIcon-search margin-left text-lg"></text>
				<input v-model="keyword" :focus="isFocus" @focus="focus" type="text" placeholder="请输入搜索内容" class="text-sm padding-lr-sm flex-sub" />
				<text v-if="active && isClear" @click="clear" class="cuIcon-roundclosefill margin-lr-sm text-sm"></text>
			</view>
			<button v-if="active" @click="search" class="cu-btn round bg-green margin-left-sm" :class="searchName == '取消' ? 'line-gray' : ''">{{ searchName }}</button>
		</view>
		<!-- 热门搜索 -->
		<view v-if="isShowHotKeyword" class="hot-keyword padding-lr">
			<view class="padding-tb text-lg">热门搜索</view>
			<scroll-view scroll-y>
				<view class="flex flex-wrap">
					<view @click="doSearch(item.search_name)" v-for="(item, index) in hotKeywordList" :key="index" class="margin-right-sm margin-bottom-sm">
						<button class="cu-btn bg-ebebeb round text-sm">{{ item.search_name }}</button>
					</view>
				</view>
			</scroll-view>
		</view>
		<!-- 搜索结果 -->
		<view v-if="!isShowHotKeyword" class="search-result">
			<view v-for="(item, index) in list" :key="index" class="margin-bottom-sm">
				<takeout-card v-if="item.store_type == 1" :list="resultHandle(index)" @toDetails="toDetails"></takeout-card>
				<life-card v-if="item.store_type == 2" :list="resultHandle(index)"></life-card>
			</view>
			<tui-tips v-if="nodata" fixed imgUrl="../../static/img_nodata.png">暂无数据</tui-tips>
			<uni-load-more v-if="list.length" :status="loadingStatus"></uni-load-more>
		</view>
	</view>
</template>

<script>
import takeoutCard from '@/components/home/takeout-card.vue';
import lifeCard from '@/components/home/life-card.vue';
import { mapGetters } from 'vuex';
import tuiTips from '@/components/tips/tips.vue';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';

export default {
	components: {
		takeoutCard,
		lifeCard,
		tuiTips,
		uniLoadMore
	},
	data() {
		return {
			from: '',
			title: '搜索',
			CustomBar: this.CustomBar,
			keyword: '',
			active: false,
			isFocus: false,
			isClear: false,
			searchName: '取消',
			isShowHotKeyword: true,
			hotKeywordList: [],
			list: [],
			page: 1,
			lastPage: 1,
			nodata: false,
			loadingStatus: 'more'
		};
	},
	computed: {
		...mapGetters(['schoolinfo'])
	},
	watch: {
		keyword(newVal) {
			if (newVal) {
				this.searchName = '搜索';
				this.isClear = true;
			} else {
				this.searchName = '取消';
				this.isClear = false;
			}
		}
	},
	onLoad(option) {
		if (option.title) {
			this.title = option.title;
		}
		if (option.from) {
			this.from = option.from;
		}
		this.getKeywordList();
	},
	methods: {
		getKeywordList() {
			this.$http.post('/api/school/fuzzy').then(res => {
				if (res.code == 0) {
					this.hotKeywordList = res.data;
				}
			});
		},
		// search-box
		getFocus() {
			this.isFocus = true;
		},
		focus() {
			this.active = true;
			this.isShowHotKeyword = true;
			if (this.keyword) {
				this.isClear = true;
			}
		},
		clear() {
			this.active = true;
			this.isFocus = true;
			this.keyword = '';
		},
		search() {
			this.isShowHotKeyword = false;
			if (!this.keyword) {
				if (this.searchName == '取消') {
					uni.hideKeyboard();
					this.isFocus = false;
					this.active = false;
					return;
				}
			}
			this.getList();
		},
		doSearch(key) {
			this.keyword = key;
			this.isShowHotKeyword = false;
			this.getList();
		},

		// search-box
		getList() {
			this.$http.post('/api/service/search_store', { school_id: this.schoolinfo.id, keywords: this.keyword, page: this.page }).then(res => {
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
					this.nodata = true;
					this.list = [];
				}
			});
		},

		// 搜索结果分类 店铺类型，1：外卖，2：生活
		resultHandle(index) {
			return this.list.slice(index, index+1);
		},

		// 跳转详情
		toDetails(id, type) {
			let url;
			if (type == 1) {
				url = `/pages/home/takeout-details?id=${id}`;
			} else {
				url = '/pages/home/life-details?id=${id}';
			}
			uni.navigateTo({
				url: url
			});
		}
	}
};
</script>

<style lang="scss">
.home-search {
	// search-input
	.search {
		position: fixed;
		left: 0;
		right: 0;
		z-index: 9;
		padding: 14upx 95upx;
		.search-box {
			border-radius: 30upx;
			input {
				height: 64upx;
			}
			.cuIcon-search:before,
			.cuIcon-roundclosefill:before {
				font-size: 32upx;
			}
		}
		.search-btn {
			flex-shrink: 0;
		}
	}
	// 热门搜索
	.hot-keyword,
	.search-result {
		margin-top: 98upx;
	}
}
</style>
