<template>
	<view class="composite-search">
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
		<block v-if="!isShowHotKeyword">
			<view class="search-result margin-lr">
				<composite-card v-for="(item, index) in list" :key="index" :item="item"></composite-card>
				<uni-load-more v-if="list.length" :status="loadingStatus"></uni-load-more>
			</view>
			<tui-tips v-if="nodata" :fixed="true" imgUrl="../../static/img_nodata.png">暂无数据</tui-tips>
		</block>
	</view>
</template>

<script>
import compositeCard from '@/components/composite/composite-card.vue';
import { mapGetters } from 'vuex';
import tuiTips from '@/components/tips/tips';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';

export default {
	components: {
		compositeCard,
		tuiTips,
		uniLoadMore
	},
	data() {
		return {
			from: '',
			title: '搜索',
			CustomBar: this.CustomBar,
			keyword: '',
			keywordCopy: '',
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
				this.nodata = false;
			}
		}
	},
	onLoad(option) {
		if (option.title) {
			this.title = option.title;
		}
		this.getHotKeywordList();
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
		// 热门搜索词
		getHotKeywordList() {
			this.$http.post('api/school/fuzzy').then(res => {
				this.hotKeywordList = res.data;
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
			} else {
				if (!this.keyword.trim()) {
					uni.showToast({
						title: '请输入搜索内容',
						icon: ''
					});
					return;
				}
				this.getList();
			}
		},
		doSearch(key) {
			this.keyword = key;
			this.isShowHotKeyword = false;
			this.getList();
		},
		// search-box
		// 列表
		getList() {
			this.$http.post('/api/school/indistinct', { school_id: this.schoolinfo.id, title: this.keyword, page: this.page }).then(res => {
				if (res.code == 0) {
					this.nodata = !res.data.data.length;
					this.lastPage = res.data.last_page;
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
				}
			});
		}
	}
};
</script>

<style lang="scss">
.composite-search {
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
		background: #ffffff;
	}
}
</style>
