<template>
	<view class="driving">
		<uni-nav-bar title="驾校报名" leftIcon="back" :fixed="true" :statusBar="true" @clickLeft="clickLeft"></uni-nav-bar>

		<!-- search-input -->
		<view class="search flex justify-between align-center bg-white">
			<view @click="getFocus" class="search-box flex-sub flex align-center bg-ebebeb">
				<text class="cuIcon-search margin-left text-lg"></text>
				<input v-model="keyword" :focus="isFocus" @focus="focus" type="text" placeholder="请输入搜索内容" class="text-sm padding-lr-sm flex-sub" />
				<text v-if="active && isClear" @click="clear" class="cuIcon-roundclosefill margin-lr-sm text-sm"></text>
			</view>
			<button v-if="active" @click="search" class="cu-btn round bg-green margin-left-sm" :class="searchName == '取消' ? 'line-gray' : ''">{{ searchName }}</button>
		</view>
		<view class="container" style="padding-top: 92upx;">
			<view class="list margin-lr padding-top-sm">
				<driving-card @click.native="toDetails(item)" v-for="(item, index) in list" :key="index" :item="item"></driving-card>
				<uni-load-more v-if="list.length" :status="loadingStatus"></uni-load-more>
			</view>
			<tui-tips v-if="nodata" :fixed="true" imgUrl="../../static/img_nodata.png">暂无数据</tui-tips>
		</view>
	</view>
</template>

<script>
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
import drivingCard from '@/components/composite/driving-card.vue';
import { mapGetters } from 'vuex';
import tuiTips from '@/components/tips/tips.vue';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';

export default {
	components: { uniNavBar, drivingCard, tuiTips, uniLoadMore },
	data() {
		return {
			keyword: '',
			active: false,
			isFocus: false,
			isClear: false,
			searchName: '取消',
			list: [],
			page: 1,
			lastPage: 1,
			nodata: false,
			pullUpOn: false
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
	onLoad() {
		this.getList();
	},
	methods: {
		clickLeft() {
			uni.navigateBack();
		},
		// search-box
		getFocus() {
			this.isFocus = true;
		},
		focus() {
			this.active = true;
			if (this.keyword) {
				this.isClear = true;
			}
		},
		clear() {
			this.active = true;
			this.isFocus = true;
			this.keyword = '';
			this.getList();
		},
		search() {
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
						title: '搜索内容不能为空！',
						icon: 'none'
					});
					return;
				}
				this.getList();
			}
		},
		toDetails(item) {
			item.count++;
			uni.navigateTo({
				url: `/pages/composite/driving-details?id=${item.id}`
			});
		},
		getList() {
			this.$http.post('/api/driving/driving_list', { school_id: this.schoolinfo.id, title: this.keyword.trim(), page: this.page }).then(res => {
				if (res.code == 0) {
					this.lastPage = res.data.last_page;
					this.nodata = !res.data.list.length;
					if (this.page > 1) {
						this.list.push(...res.data.list);
						this.loadingStatus = 'more';
					} else {
						this.list = res.data.list;
						if (res.data.list.length < 10) {
							this.loadingStatus = 'noMore';
						} else {
							this.loadingStatus = 'more';
						}
					}
					if (this.pullUpOn) {
						this.pullUpOn = false;
						uni.showToast({
							title: '刷新成功',
							icon: 'none'
						});
					}
				}
			});
		}
	}
};
</script>

<style lang="scss">
.driving {
	/deep/.uni-navbar--border {
		border-color: transparent;
	}
	// search-input
	.search {
		position: fixed;
		left: 0;
		right: 0;
		z-index: 9;
		padding: 14upx 95upx;
		/* #ifdef H5 */
		top: 44px;
		/* #endif */
		/* #ifdef MP */
		top: 88px;
		/* #endif */
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
}
</style>
