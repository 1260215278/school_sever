<template>
	<view class="page">
		<scroll-view class="scrollList" scroll-y :scroll-into-view="scrollViewId" :style="{ height: winHeight + 'px' }">
			<!-- 搜索条 -->
			<view class="search flex justify-between align-center bg-white" :style="[{ top: CustomBar + 'px' }]">
				<view @click="getFocus" class="search-box flex-sub flex align-center bg-ebebeb">
					<text class="cuIcon-search margin-left text-lg"></text>
					<input v-model="keyword" :focus="isFocus" @focus="focus" type="text" placeholder="请输入搜索内容" class="text-sm padding-lr-sm flex-sub" />
					<text v-if="active && isClear" @click="clear" class="cuIcon-roundclosefill margin-lr-sm text-sm"></text>
				</view>
				<button v-if="active" @click="search" class="cu-btn round bg-green margin-left-sm" :class="searchName == '取消' ? 'line-gray' : ''">{{ searchName }}</button>
			</view>

			<!-- 当前定位城市 -->
			<view class="current-locate padding-lr text-lg" :style="[{ top: 'calc(' + CustomBar + 'px + 46px)' }]">
				<view class="padding-top-xs">您所在的学校</view>
				<view class="padding-tb">
					<button @click="currentSchool" class="cu-btn round line-green">{{ schoolinfo ? schoolinfo.school_name : '' }}</button>
				</view>
			</view>

			<view>
				<view class="tui-list city-list">
					<block v-for="(list, index) in lists" :key="index" v-if="list.school[0]">
						<view class="tui-list-cell-divider" :id="index === 0 ? 'suoyin' : list.school_initial">{{ list.school_initial }}</view>
						<view
							class="tui-list-cell"
							hover-class="tui-list-cell-hover"
							v-for="(item, index2) in list.school"
							:key="index2"
							@tap="selectSchool"
							:data-id="item.sid"
							:hover-stay-time="150"
						>
							<view class="tui-list-cell-navigate" :class="[list.school.length - 1 == index ? 'last' : '']">{{ item.school_name }}</view>
						</view>
					</block>
				</view>
			</view>
		</scroll-view>
		<view
			class="tui-indexed-list-bar"
			:style="{ height: indexBarHeight + 'px' }"
			@touchstart="touchStart"
			@touchmove.stop="touchMove"
			@touchend.stop="touchEnd"
			@touchcancel.stop="touchCancel"
		>
			<text v-for="(items, index) in lists" :key="index" class="tui-indexed-list-text" :style="{ height: indexBarItemHeight + 'px' }">{{ items.school_initial }}</text>
		</view>
		<view class="tui-indexed-list-alert" v-if="touchmove && lists[touchmoveIndex].school_initial">{{ lists[touchmoveIndex].school_initial }}</view>
	</view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
	data() {
		return {
			from: '', // 从哪个页面过来 home 首页 composite 综合
			StatusBar: this.StatusBar,
			CustomBar: this.CustomBar,
			hidden: true,
			listCurID: '',
			list: [],
			listCur: '',
			keyword: '',
			active: false,
			isFocus: false,
			isClear: false,
			searchName: '取消',

			lists: [],
			touchmove: false, // 是否在索引表上滑动
			touchmoveIndex: -1,
			titleHeight: 0, // 索引二字距离窗口顶部的高度
			indexBarHeight: 0, // 索引表高度
			indexBarItemHeight: 0, // 索引表子项的高度
			scrollViewId: '', // scroll-view滚动到的子元素的id
			winHeight: 0
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
	onLoad: function(option) {
		this.from = option.from;
		const that = this;
		setTimeout(() => {
			uni.getSystemInfo({
				success: function(res) {
					let winHeight = res.windowHeight;
					let barHeight = winHeight - uni.upx2px(204);
					that.winHeight = winHeight;
					that.indexBarHeight = barHeight;
					that.indexBarItemHeight = barHeight / 25;
					that.titleHeight = uni.upx2px(132);
				}
			});
		}, 50);
		this.getList();
	},
	methods: {
		...mapActions(['setSchoolinfo']),

		currentSchool() {
			uni.navigateBack();
		},

		getList() {
			this.$http.post('api/school/school_list', { city: this.schoolinfo.school_city, school: this.keyword }).then(res => {
				if (res.code == 0) {
					this.lists = res.data;
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
			}
			this.getList();
		},
		doSearch(key) {
			this.keyword = key;
			this.isShowHotKeyword = false;
			this.getList();
		},
		// search-box

		// 选择学校
		selectSchool(e) {
			let id = e.currentTarget.dataset.id;
			//返回并刷新上一页面
			this.$http.post('api/express/school', { school_id: id }).then(res => {
				if (res.code == 0) {
					this.setSchoolinfo(JSON.stringify(res.data));
					if (this.from == 'composite') {
						uni.reLaunch({
							url: '/pages/tabbar/composite'
						});
					} else {
						uni.reLaunch({
							url: '/pages/tabbar/home'
						});
					}
				}
			});
		},
		touchStart(e) {
			this.touchmove = true;
			let pageY = e.touches[0].pageY;
			let index = Math.floor((pageY - this.titleHeight) / this.indexBarItemHeight);
			let item = this.lists[index === 0 ? 1 : index];
			if (item) {
				this.scrollViewId = item.school_initial;
				this.touchmoveIndex = index;
			}
		},
		touchMove(e) {
			let pageY = e.touches[0].pageY;
			let index = Math.floor((pageY - this.titleHeight) / this.indexBarItemHeight);
			let item = this.lists[index === 0 ? 1 : index];
			if (item) {
				this.scrollViewId = item.school_initial;
				this.touchmoveIndex = index;
			}
		},
		touchEnd() {
			this.touchmove = false;
			this.touchmoveIndex = -1;
		},
		touchCancel() {
			this.touchmove = false;
			this.touchmoveIndex = -1;
		}
	}
};
</script>

<style lang="scss">
page {
	height: 100%;
	overflow: hidden;
}
// search-input
.search {
	background: #ffffff;
	padding: 14upx 95upx;
	height: 95upx;
	box-sizing: border-box;
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

.page {
	height: 100%;
	overflow: hidden;
}

.scrollList {
	flex: 1;
}

.search-bar {
	display: flex;
	align-items: center;
	position: relative;
	padding: 27upx 30upx 35upx;
	background-color: #fff;
}

.search-bar-form {
	flex: 1;
	position: relative;
	border-radius: 32upx;
	background: #f2f5f7;
}

.search-bar-box {
	display: flex;
	align-items: center;
	position: relative;
	padding-left: 20upx;
	padding-right: 20upx;
	height: 64upx;
	z-index: 1;
}

.search-bar-input {
	line-height: normal;
	width: 100%;
	padding-left: 20upx;
	font-size: 30upx;
	color: #333;
}

.phcolor {
	font-size: 30upx;
}

.icon-clear {
	height: 38upx;
}

.icon-clear .tui-icon-class {
	display: block;
}

.search-bar-label {
	height: 64upx;
	display: flex;
	justify-content: center;
	align-items: center;
	position: absolute;
	top: 0;
	right: 0;
	bottom: 0;
	left: 0;
	z-index: 2;
	border-radius: 32upx;
	color: #ccc;
	background: #f2f5f7;
}

.icon-search {
	position: relative;
	height: 26upx;
	margin-right: 20upx;
	font-size: inherit;
}

.search-bar-text {
	font-size: 30upx;
	line-height: 32upx;
}

.cancel-btn {
	padding-left: 30upx;
}

.search-result::before {
	display: none;
}

.search-result::after {
	display: none;
}

.tui-list-cell {
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	width: 100%;
}

.tui-list-cell-hover {
	background-color: #eee !important;
}

.tui-list-cell-navigate {
	width: 100%;
	position: relative;
	padding: 30upx 0 30upx 30upx;
	font-size: 28upx;
	color: #333;
}

.tui-list-cell-navigate::after {
	content: '';
	position: absolute;
	border-bottom: 1upx solid #eaeef1;
	-webkit-transform: scaleY(0.5);
	transform: scaleY(0.5);
	bottom: 0;
	right: 0;
	left: 30upx;
}

.current-city {
	padding: 0 30upx 30upx;
	background: #fff;
}

.tui-icon-class {
	margin-right: 10upx;
}

.current-city .title {
	font-size: 24upx;
	line-height: 24upx;
	color: #999;
}

.city-name {
	display: flex;
	align-items: center;
	margin-top: 17upx;
	font-size: 30upx;
	font-weight: bold;
	line-height: 30upx;
	color: #333;
}

.hot-city .title {
	height: 48upx !important;
	padding-left: 30upx;
	font-size: 24upx !important;
	line-height: 48upx !important;
	color: #999;
	background: #f2f5f7 !important;
}

.city-names {
	display: flex;
	flex-wrap: wrap;
	justify-content: space-between;
	align-content: space-between;
	width: 630upx;
	padding: 12upx 90upx 26upx 30upx;
	background: #fff;
}

.city-name-item {
	display: flex;
	justify-content: center;
	align-items: center;
	width: 140upx;
	height: 56upx;
	margin-top: 16upx;
	/* border: solid 1upx #ccc; */
	border-radius: 28upx;
	font-size: 28upx;
	color: #333;
	position: relative;
}

.city-name-item::before {
	content: '';
	position: absolute;
	width: 200%;
	height: 200%;
	-webkit-transform-origin: 0 0;
	transform-origin: 0 0;
	-webkit-transform: scale(0.5, 0.5);
	transform: scale(0.5, 0.5);
	-webkit-box-sizing: border-box;
	box-sizing: border-box;
	left: 0;
	top: 0;
	border-radius: 56upx;
	border: 1px solid #ccc;
}

.tap-city {
	color: #fff;
	background: #5677fc;
	/* border: solid 1upx #5677fc; */
}

.tui-list {
	background-color: #fff;
	position: relative;
	width: 100%;
	display: flex;
	flex-direction: column;
	padding-bottom: env(safe-area-inset-bottom);
}

.tui-list-cell-divider {
	height: 48upx;
	padding-left: 30upx;
	font-size: 24upx;
	color: #999;
	background: #f2f5f7;
	padding: 0 30upx;
	display: flex;
	align-items: center;
}

.tui-indexed-list-bar {
	display: flex;
	flex-direction: column;
	align-items: center;
	justify-content: flex-start;
	z-index: 9999;
	position: absolute;
	top: 132upx;
	right: 0;
	padding-right: 10upx;
	width: 44upx;
}

.tui-indexed-list-text {
	font-size: 22upx;
	white-space: nowrap;
}

.tui-indexed-list-bar.active {
	background-color: rgb(200, 200, 200);
}

.tui-indexed-list-alert {
	position: absolute;
	z-index: 20;
	width: 160upx;
	height: 160upx;
	left: 50%;
	top: 50%;
	margin-left: -80upx;
	margin-top: -80upx;
	border-radius: 80upx;
	text-align: center;
	line-height: 160upx;
	font-size: 70upx;
	color: #fff;
	background-color: rgba(0, 0, 0, 0.5);
}
</style>
