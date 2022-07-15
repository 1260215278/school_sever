<template>
	<view class="lost-property">
		<uni-nav-bar title="失物招领" leftIcon="back" :statusBar="true" @clickLeft="clickLeft" fixed></uni-nav-bar>
		<!-- search -->
		<view class="search-box flex align-center padding-lr-lg">
			<view class="flex-sub flex align-center input-wrap">
				<text class="cuIcon-search margin-left-sm"></text>
				<input @input="inputChange" class="flex-sub" type="text" v-model="keyword" placeholder="请输入搜索内容" />
			</view>
			<!-- <image @click="selectTypePopup" src="../../static/filter-icon.png" class="filter-icon" mode=""></image> -->
		</view>
		<view class="list margin-lr margin-top-sm" style="padding-top: 72upx;">
			<composite-card @click.native="toDetails(item)" v-for="(item, index) in list" :key="index" :item="item"></composite-card>
			<uni-load-more v-if="list.length" :status="loadingStatus"></uni-load-more>
			<tui-tips v-if="nodata" :fixed="true" imgUrl="../../static/img_nodata.png">暂无数据</tui-tips>
		</view>
		<!-- 类型弹窗 -->
		<!-- <uni-popup ref="typePopup" class="type-popup" type="top">
			<view class="popup-container">
				<scroll-view scroll-y class="popup-scroll-view">
					<view class="padding-lr-lg text-df">
						<view @click="selectedtype(item.id)" v-for="(item, index) in category" :key="index" class="padding-tb flex justify-between align-center solid-bottom">
							<text>{{ item.brand_name }}</text>
							<image v-if="type == item.id" src="../../static/checked-icon.png" class="checked-icon" mode=""></image>
						</view>
					</view>
				</scroll-view>
			</view>
		</uni-popup> -->
	</view>
</template>

<script>
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
import compositeCard from '@/components/composite/composite-card.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import { mapGetters } from 'vuex';
import tuiTips from '@/components/tips/tips.vue';
import { debounce } from '@/utils/util.js';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';

export default {
	components: { uniNavBar, compositeCard, uniPopup, tuiTips, uniLoadMore },
	data() {
		return {
			keyword: '',
			list: [],
			page: 1,
			lastPage: 1,
			// type: 0, // 分类类型 0 全部分类
			// category: [],
			nodata: false,
			loadingStatus: 'more',
			pullUpOn: false
		};
	},
	computed: {
		...mapGetters(['schoolinfo'])
	},
	onLoad() {
		// this.getCategory();
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
		// // 分类列表
		// getCategory() {
		// 	this.$http.post('/api/school/sort').then(res => {
		// 		if (res.code == 0) {
		// 			res.data.unshift({ id: '', brand_name: '全部分类' });
		// 			this.category = res.data;
		// 		}
		// 	});
		// },
		// // 分类弹窗
		// selectTypePopup() {
		// 	if (this.$refs.typePopup.showPopup) {
		// 		this.$refs.typePopup.close();
		// 	} else {
		// 		this.$refs.typePopup.open();
		// 	}
		// },
		// selectedtype(val) {
		// 	if (val != this.type) {
		// 		this.type = val;
		// 		this.page = 1;
		// 		this.getList();
		// 	}
		// 	this.$refs.typePopup.close();
		// },

		toDetails(item) {
			// type 1 是二手闲置评论 2 是失物招领评论 3 是动态评论 (跳转页面评论列表需要判断此参数)
			item.count++;
			uni.navigateTo({ url: `/pages/composite/used-idle-details?id=${item.id}&type=2` });
		},
		getList() {
			// sort_id: this.type, 分类 暂隐藏
			this.$http.post('/api/school/lose_list', { title: this.keyword, page: this.page, school_id: this.schoolinfo.id }).then(res => {
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
					if (this.pullUpOn) {
						uni.stopPullDownRefresh();
						this.pullUpOn = false;
						uni.showToast({
							title: '刷新成功',
							icon: 'none'
						});
					}
				}
			});
		},
		// 搜索
		inputChange: debounce(function(e) {
			this.keyword = e.detail.value;
			this.page = 1;
			this.getList();
		}, 1000)
	}
};
</script>

<style lang="scss">
.lost-property {
	/deep/.uni-navbar--border {
		border-color: transparent;
	}
	// 搜索
	.search-box {
		position: fixed;
		/* #ifdef MP */
		top: 88px;
		/* #endif */
		/* #ifdef H5 */
		top: 44px;
		/* #endif */
		left: 0;
		right: 0;
		z-index: 998;
		height: 72upx;
		background: #ffffff;
		.filter-icon {
			width: 44upx;
			height: 44upx;
		}
		.input-wrap {
			background: #f5f5f5;
			border-radius: 28upx;
			overflow: hidden;
			margin: 0 50upx;
			font-size: 28upx;
			input {
				height: 56upx;
				padding: 0 15upx;
				font-size: 28upx;
			}
		}
	}
	// 综合分类弹窗
	.type-popup {
		padding-top: 160upx;
		.popup-container {
			background: #ffffff;
			border-radius: 0px 0px 20upx 20upx;
			.popup-scroll-view {
				max-height: 770upx;
			}
		}
	}
}
</style>
