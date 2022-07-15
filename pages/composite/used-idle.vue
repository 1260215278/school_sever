<template>
	<view class="used-idle">
		<uni-nav-bar title="二手闲置" leftIcon="back" :statusBar="true" @clickLeft="clickLeft" fixed></uni-nav-bar>
		<!-- 搜索 -->
		<view class="search-wrap solid-bottom" style="{ top:'44px' }">
			<view class="search-box flex align-center padding-lr-lg">
				<view class="flex-sub flex align-center input-wrap">
					<text class="cuIcon-search margin-left-sm"></text>
					<input @input="inputChange" class="flex-sub" type="text" v-model="keyword" placeholder="请输入搜索内容" />
				</view>
				<image @click="selectIdleType" src="../../static/filter-icon.png" class="filter-icon" mode=""></image>
			</view>
			<view class="condition-search bg-white grid col-3 align-center padding-tb-sm text-df padding-lr" :style="[{ top: CustomBar + 'px' }]">
				<view @click="selectCompositeType" class="flex justify-center align-center">
					<text>综合</text>
					<text class="triangle-bottom margin-lr-xs"></text>
				</view>
				<view @click="conditionSearch" class="flex justify-center align-center" data-sort-type="1" :class="sortType == 1 ? 'text-green' : ''">
					距离
					<view class="condition-sort flex flex-direction margin-lr-xs">
						<view class="up" :class="sortType == 1 && sortOrder == 0 ? 'active' : ''"></view>
						<view class="down" :class="sortType == 1 && sortOrder == 1 ? 'active' : ''"></view>
					</view>
				</view>
				<view @click="conditionSearch" class="flex justify-center align-center" data-sort-type="2" :class="sortType == 2 ? 'text-green' : ''">
					价格
					<view class="condition-sort flex flex-direction margin-lr-xs">
						<view class="up" :class="sortType == 2 && sortOrder == 0 ? 'active' : ''"></view>
						<view class="down" :class="sortType == 2 && sortOrder == 1 ? 'active' : ''"></view>
					</view>
				</view>
			</view>
		</view>
		<!-- list -->
		<view class="list margin-lr margin-top-sm" style="paddingTop: 150upx">
			<composite-card @click.native="toDetails(item)" v-for="(item, index) in list" :key="index" :item="item"></composite-card>
			<tui-tips v-if="nodata" :fixed="true" imgUrl="../../static/img_nodata.png">暂无数据</tui-tips>
			<uni-load-more v-if="list.length" :status="loadingStatus"></uni-load-more>
		</view>
		<!-- 综合分类弹窗 -->
		<uni-popup ref="compositeTypePopup" class="composite-type-popup" type="top">
			<view class="popup-container">
				<view class="padding-lr-lg text-df">
					<view @click="selectedCompositeType(0)" class="padding-tb flex justify-between align-center solid-bottom">
						<text>综合</text>
						<image v-if="compositeType === 0" src="../../static/checked-icon.png" class="checked-icon" mode=""></image>
					</view>
					<view @click="selectedCompositeType(1)" class="padding-tb flex justify-between align-center solid-bottom">
						<text>二手闲置</text>
						<image v-if="compositeType === 1" src="../../static/checked-icon.png" class="checked-icon" mode=""></image>
					</view>
					<view @click="selectedCompositeType(2)" class="padding-tb flex justify-between align-center solid-bottom">
						<text>他人需求</text>
						<image v-if="compositeType === 2" src="../../static/checked-icon.png" class="checked-icon" mode=""></image>
					</view>
				</view>
			</view>
		</uni-popup>
		<!-- 闲置类型 -->
		<uni-popup ref="idleTypePopup" class="idle-type-popup" type="top">
			<view class="popup-container">
				<scroll-view scroll-y class="popup-scroll-view">
					<view class="padding-lr-lg text-df">
						<view @click="selectedIdleType(item.id)" v-for="(item, index) in category" :key="index" class="padding-tb flex justify-between align-center solid-bottom">
							<text>{{ item.brand_name }}</text>
							<image v-if="idleType == item.id" src="../../static/checked-icon.png" class="checked-icon" mode=""></image>
						</view>
					</view>
				</scroll-view>
			</view>
		</uni-popup>
	</view>
</template>

<script>
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
import compositeCard from '@/components/composite/composite-card.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import tuiTips from '@/components/tips/tips';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import { debounce } from '@/utils/util.js';
import { mapGetters } from 'vuex';

export default {
	components: { uniNavBar, compositeCard, uniPopup, tuiTips, uniLoadMore },
	data() {
		return {
			CustomBar: this.CustomBar,
			distance: '', // 1 由近及远，2 由远及近
			price: '', // 1 有小到大，2 由大到小
			keyword: '',
			sortType: '', // 1 距离 2 价格
			sortOrder: 0, // 0 升序 1 降序,
			compositeType: 0, // 0 综合 1 二手闲置 2 他人需求
			idleType: 0, // 闲置类型 0 全部分类
			page: 1,
			lastPage: 1,
			list: [],
			category: [],
			nodata: false, // 无数据
			loadingStatus: 'more',
			pullUpOn: false // 下拉
		};
	},
	computed: {
		...mapGetters(['schoolinfo'])
	},
	onLoad() {
		this.getCategory();
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
		// 条件搜索
		conditionSearch(e) {
			if (e.currentTarget.dataset.sortType != this.sortType) {
				this.sortOrder = 1;
			}
			this.sortType = e.currentTarget.dataset.sortType;
			this.sortOrder = this.sortOrder == 0 ? 1 : 0;

			// sortType 1 距离 2 价格
			if (this.sortType == 1) {
				this.distance = this.sortOrder + 1;
			} else {
				this.price = this.sortOrder + 1;
			}
			this.page = 1;
			this.getList();
		},
		// 综合分类弹窗
		selectCompositeType() {
			if (this.$refs.compositeTypePopup.showPopup) {
				this.$refs.compositeTypePopup.close();
			} else {
				this.$refs.compositeTypePopup.open();
			}
		},
		selectedCompositeType(type) {
			if (type != this.compositeType) {
				this.compositeType = type;
				this.page = 1;
				this.getList();
			}
			this.$refs.compositeTypePopup.close();
		},
		// 闲置分类弹窗
		selectIdleType() {
			if (this.$refs.idleTypePopup.showPopup) {
				this.$refs.idleTypePopup.close();
			} else {
				this.$refs.idleTypePopup.open();
			}
		},
		selectedIdleType(val) {
			if (val != this.idleType) {
				this.idleType = val;
				this.page = 1;
				this.getList();
			}
			this.$refs.idleTypePopup.close();
		},

		toDetails(item) {
			// type 1 是二手闲置评论 2 是失物招领评论 3 是动态评论 (跳转页面评论列表需要判断此参数)
			item.count++;
			uni.navigateTo({ url: `/pages/composite/used-idle-details?id=${item.id}&type=1` });
		},
		// 闲置分类列表
		getCategory() {
			this.$http.post('/api/school/sort').then(res => {
				if (res.code == 0) {
					res.data.unshift({ id: '', brand_name: '全部分类' });
					this.category = res.data;
				}
			});
		},

		// 搜索
		inputChange: debounce(function(e) {
			this.keyword = e.detail.value;
			this.page = 1;
			this.getList();
		}, 1000),
		// list
		getList() {
			this.$http
				.post('/api/school/demand_list', {
					page: this.page,
					fage: this.compositeType,
					sort_id: this.idleType,
					title: this.keyword,
					distance: this.sortOrder + 1,
					school_id: this.schoolinfo.id
				})
				.then(res => {
					this.nodata = !res.data.list.length;
					this.lastPage = res.data.last_page;
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
						uni.stopPullDownRefresh();
						this.pullUpOn = false;
						uni.showToast({
							title: '刷新成功',
							icon: 'none'
						});
					}
				});
		}
	}
};
</script>

<style lang="scss">
.used-idle {
	/deep/.uni-navbar--border {
		border-color: transparent;
	}
	// 搜索
	.search-wrap {
		position: fixed;
		left: 0;
		right: 0;
		background: #ffffff;
		z-index: 998;
		.search-box {
			height: 72upx;
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
		// 条件搜索
		.triangle-bottom {
			border: 14upx solid transparent;
			border-bottom-width: 0;
			border-top-color: #686868;
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
	// 综合分类弹窗 和 闲置分类弹窗
	.composite-type-popup,
	.idle-type-popup {
		padding-top: 119px;
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
