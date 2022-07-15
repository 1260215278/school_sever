<template>
	<view v-if="info">
		<!-- #ifdef H5 -->
		<text @click="navBack" class="cuIcon-roundrightfill"></text>
		<!-- #endif -->
		<!-- #ifdef MP -->
		<uni-nav-bar @clickLeft="clickLeft" left-icon="back" color="#FFF" :statusBar="true" :border="false" :shadow="false" backgroundColor="transparent"></uni-nav-bar>
		<!-- #endif -->
		<swiper :style="style" :indicator-dots="true" :autoplay="true" :interval="3000" :duration="1000" indicator-color="#fff" indicator-active-color="#14C98C" circular>
			<swiper-item v-if="info.banner_image_text" v-for="(item, index) in info.banner_image_text" :key="index">
				<view class="swiper-item"><image :src="item" mode="aspectFill" class="food-banner"></image></view>
			</swiper-item>
		</swiper>

		<view class="foodinfo-wrap">
			<view class="food-name-wrap">
				<text class="food-name">{{ info.goods_name }}</text>
				<text class="group-num">{{ info.groupbuy_full_num }}人团</text>
			</view>
			<view class="food-sales">月销{{ info.sales_num }}</view>
			<view class="food-price text-price">{{ info.group_price }}</view>
			<view class="food-buy-wrap">
				<view class="food-packing">包装费￥{{ info.box_fee }}/份</view>
				<button v-if="info.group_buy == 0" class="btn-foodbuy" size="mini">
					<text class="cuIcon-add"></text>
					加入购物车
				</button>
				<button v-if="info.group_buy == 1 && !group_buy_id" @click="openGroupingPopup" class="btn-foodbuy" size="mini">
					{{ info.groupbuy_num ? info.groupbuy_num + '人正在拼团中...' : '发起拼团' }}
				</button>
				<button v-if="info.group_buy == 1 && group_buy_id" @click="openGroupingPopup" class="btn-foodbuy" size="mini">1人正在拼团中...</button>
			</view>
		</view>

		<view v-if="info.group_buy == 1" class="food-details-wrap">
			<view class="food-tabs">
				<view class="food-tab active">详情</view>
				<view @click="bindToView" class="food-tab">评价</view>
			</view>
			<view class="food-desc" id="food-desc">
				<view class="food-desc-txt">{{ info.goods_detail }}</view>
				<image v-if="info.detail_image_text" v-for="(item, index) in info.detail_image_text" :key="index" :src="item" mode="widthFix" class="food-desc-img"></image>
			</view>
			<view class="food-evaluate" id="food-evaluate">
				<view class="food-evaluate-title">
					<text class="evaluate-label">商品评价</text>
					<text class="evaluate-percent">好评率{{ info.prasie_rate }}</text>
				</view>
				<view class="evaluate-list">
					<view v-for="(item, index) in evaluateList" :key="index" class="evaluate-list-item">
						<image src="/static/add-icon.png" mode="aspectFill" class="evaluate-avatar"></image>
						<view class="evaluate-right">
							<view class="evaluate-info">
								<view class="evaluate-user">
									<view class="evaluate-username">{{ item.nickname }}</view>
									<rate :current="item.star" :size="16" :hollow="true" active="#FFD200" :disabled="true"></rate>
								</view>
								<view class="evaluate-time">{{ item.addtime }}</view>
							</view>
							<view class="evaluate-txt">{{ item.content }}</view>
							<view class="evaluate-imgs"><image v-for="(em, i) in item.images" :key="i" :src="em" mode="aspectFill" class="evaluate-img"></image></view>
						</view>
					</view>
					<tips v-if="nodata" :fixed="false" imgUrl="/static/img_nodata.png">暂无评价</tips>
					<view v-if="isShowMore" class="view-more"><button @click="viewMore" type="default" class="btn-more">查看更多评价</button></view>
				</view>
			</view>
		</view>

		<view class="group-actions">
			<view class="group-action-first">
				<navigator :url="`/pages/home/takeout-details?id=${info.store_id}`" class="group-action-em">
					<image src="/static/second-phase/shop-icon.png" class="group-action-icon"></image>
					<text class="group-action-label">店铺</text>
				</navigator>
				<view @click="collect" class="group-action-em">
					<image v-if="info.is_favorite == 1" src="/static/collected-icon.png" class="group-action-icon"></image>
					<image v-if="info.is_favorite == 0" src="/static/collect-icon.png" class="group-action-icon"></image>
					<text class="group-action-label">收藏</text>
				</view>
				<view @click="makePhoneCall" class="group-action-em">
					<image src="/static/second-phase/phone-icon.png" class="group-action-icon"></image>
					<text class="group-action-label">商家</text>
				</view>
			</view>
			<view @click="startGroupOrigin" class="group-action-item alone">
				<view class="group-action-price">￥{{ info.goods_price }}</view>
				<view class="group-action-price-label">单独购买</view>
			</view>
			<view @click="startGroup" class="group-action-item">
				<view class="group-action-price">￥{{ info.group_price }}</view>
				<view class="group-action-price-label">发起拼团</view>
			</view>
		</view>

		<uni-popup ref="groupingPopup" :maskClick="false">
			<view class="grouping-popup-warp">
				<text @click="groupingPopupClose" class="cuIcon-roundclosefill grouping-popup-close"></text>
				<view class="grouping-popup-title">正在拼团</view>
				<view class="grouping-list" @touchmove.stop>
					<view v-for="(item, index) in groupingList" :key="index" class="grouping-list-item">
						<image :src="item.creator_avatar" mode="aspectFill" class="grouping-avatar"></image>
						<view class="grouping-desc">
							<view class="grouping-info">
								<text class="grouping-hostname text-cut">{{ item.creator_nickname }}</text>
								<text class="grouping-short">还差{{ item.left_user_num }}人</text>
							</view>
							<view class="grouping-counting">
								<text>剩余</text>
								<countdown @end="countEnd" class="countdown" :time="item.time_left_second" bcolor="transparent" color="#999" :colonSize="24" colonColor="#999"></countdown>
							</view>
						</view>
						<button @click="joinGroupOpen(item)" class="btn-grouping">去拼团</button>
					</view>
				</view>
			</view>
		</uni-popup>

		<uni-popup ref="joinGroupPopup" :maskClick="false">
			<view class="join-group-wrap">
				<text @click="joinPopupClose" class="cuIcon-roundclosefill join-popup-close"></text>
				<view class="join-group-title">参与{{ joinGroupinfo.creator_nickname }}的拼团</view>
				<view class="join-group-tips">
					<text>仅剩</text>
					<text class="join-group-short">{{ joinGroupinfo.left_user_num }}</text>
					<text>个名额，</text>
					<countdown @end="joinGroupEnd" class="countdown" :time="joinGroupinfo.time_left_second" bcolor="transparent" color="#999" :colonSize="24" colonColor="#999"></countdown>
					<text>后结束</text>
				</view>
				<view class="join-group-avatar">
					<view v-for="(item, index) in joinGroupinfo.userlist" :key="index" class="joingroup-avatar-wrap">
						<image v-if="index == 0" src="/static/second-phase/group-host-icon.png" class="group-host-icon"></image>
						<image v-if="item.avatar" :src="item.avatar" mode="aspectFill" class="joingroup-avatar-item"></image>
						<image v-if="!item.avatar" src="/static/second-phase/join-group-avatar.png" mode="aspectFill" class="joingroup-avatar-item"></image>
					</view>
				</view>
				<button @click="toConfirmJoin" class="btn-join-group">参与拼团</button>
			</view>
		</uni-popup>

		<!-- 规格选择弹窗 -->
		<uni-popup class="options-popup" ref="optionsPopup">
			<view class="options-container">
				<view @click="optionsClose" class="options-close cuIcon-close"></view>
				<view class="options-title padding-tb text-xl text-bold flex justify-center">{{ info.goods_name }}</view>
				<view class="options-content padding-lr">
					<view class="text-df">规格选择</view>
					<view class="padding-tb">
						<button
							@click="optionsSelected(item, index)"
							v-for="(item, index) in info.goods_sku"
							:key="index"
							class="cu-btn round margin-bottom-sm margin-right-sm"
							:class="item.checked ? 'bg-red' : ''"
						>
							{{ item.sku }}
						</button>
					</view>
				</view>
				<view class="options-bottom padding-lr padding-tb-sm bg-ebebeb flex justify-between align-center">
					<view class="text-price text-xxl text-red">{{ skuPrice }}</view>
					<block>
						<button v-if="!isOrigin && !isJoin" @click="toCreatOrder" class="cu-btn round bg-red">发起拼团</button>
						<button v-if="isOrigin && !isJoin" @click="toAddCart" class="cu-btn round bg-red">立即购买</button>
						<button v-if="isJoin" @click="toCreatOrder" class="cu-btn round bg-red">参与拼团</button>
					</block>
				</view>
			</view>
		</uni-popup>

		<login-modal></login-modal>
	</view>
</template>

<script>
import loginModal from '@/components/login/login-modal.vue';
import { mapActions, mapGetters } from 'vuex';
export default {
	components: { loginModal },
	data() {
		return {
			id: '',
			info: '',
			CustomBar: this.CustomBar,

			evaluateList: [],
			page: 1,
			lastPage: 1,
			nodata: false,

			isOrigin: false,
			isJoin: false,

			groupingList: [],
			joinGroupinfo: '',

			group_buy_id: '', // 从分享进来拼团id
			school_id: '' // 从分享进来学校id
		};
	},
	computed: {
		...mapGetters(['token']),
		isShowMore() {
			return this.page < this.lastPage;
		},
		skuPrice() {
			if (this.info) {
				if (!this.isOrigin) {
					return this.info.goods_sku.find(em => em.checked).group_price;
				} else {
					return this.info.goods_sku.find(em => em.checked).price;
				}
			} else return '';
		},
		style() {
			var CustomBar = this.CustomBar;
			// #ifdef H5
			var style = `margint-top: 0`;
			// #endif
			// #ifdef MP
			var style = `margin-top: -${CustomBar}px;`;
			// #endif
			return style;
		}
	},
	onLoad(options) {
		this.id = options.id;
		if (options.group_buy_id) {
			this.group_buy_id = options.group_buy_id;
			this.school_id = options.school_id;
		}
		this.getFoodDetails();
		this.getEvaluateList();
		this.getGroupinginfo();
	},
	onShow() {
		if (!this.token) this.setLoginModal(true);
	},

	methods: {
		...mapActions(['setLoginModal']),
		clickLeft() {
			if (this.group_buy_id && this.school_id) uni.switchTab({ url: '/pages/tabbar/home' });
			else uni.navigateBack();
		},
		startGroup() {
			this.isJoin = false;
			this.isOrigin = false;
			this.$refs.optionsPopup.open();
		},
		startGroupOrigin() {
			this.isJoin = false;
			this.isOrigin = true;
			this.$refs.optionsPopup.open();
		},
		toCreatOrder() {
			if (!this.token) {
				this.setLoginModal(true);
				return;
			}
			let sku_id = this.info.goods_sku.find(em => em.checked).id;
			if (this.isJoin) {
				uni.navigateTo({
					url: `/pages/home/takeout-order-confirm?goods_id=${this.info.id}&sku_id=${sku_id}&groupbuy_id=${this.joinGroupinfo.id}`
				});
				return;
			}
			uni.navigateTo({ url: `/pages/home/takeout-order-confirm?goods_id=${this.info.id}&sku_id=${sku_id}` });
		},

		toConfirmJoin() {
			if (!this.token) {
				this.setLoginModal(true);
				return;
			}
			this.isJoin = true;
			this.$refs.joinGroupPopup.close();
			this.$refs.optionsPopup.open();
		},
		async toAddCart() {
			let sku_id = this.info.goods_sku.find(em => em.checked).id;
			let res = await this.$http.post('/api/takeout/shopcar', { store_id: this.info.store_id, goods_id: this.info.id, sku_id });
			if (res.code == 0) {
				uni.navigateTo({
					url: `/pages/home/takeout-order-confirm?cart_id=${res.data.shopcar_id}&store_id=${this.info.store_id}`
				});
			}
		},

		async getGroupinginfo() {
			let params = { goods_id: this.id };
			if (this.group_buy_id) params.record_id = this.group_buy_id;
			let res = await this.$http.post('/api/takeout/get_goods_groupbuylist', params);
			if (res.code == 0) {
				this.groupingList = res.data;
				if (!res.data.length) {
					this.group_buy_id = '';
					// this.getGroupinginfo();
				}
			}
		},
		countEnd() {
			this.$refs.groupingPopup.close();
			this.getGroupinginfo();
			this.getFoodDetails();
		},
		joinGroupEnd() {
			this.$refs.joinGroupPopup.close();
			this.getGroupinginfo();
			this.getFoodDetails();
		},

		async getFoodDetails() {
			let res = await this.$http.post('/api/takeout/goods_takeout_detail', { goods_id: this.id }, { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } });
			if (res.code == 0) {
				res.data.goods_sku.forEach((em, i) => {
					if (i == 0) em.checked = true;
					else em.checked = false;
				});
				this.info = res.data;
			}
		},

		async getEvaluateList() {
			let res = await this.$http.post('/api/takeout/takeout_praise_list', { goods_id: this.id, limit: 5, page: this.page });
			if (res.code == 0) {
				this.lastPage = res.data.last_page;
				this.nodata = !res.data.data.length;
				if (this.page > 1) this.evaluateList.push(...res.data.data);
				else this.evaluateList = res.data.data;
			}
		},

		bindToView() {
			const query = uni.createSelectorQuery();
			query.select('#food-evaluate').boundingClientRect();
			query.selectViewport().scrollOffset();
			query.exec(res => {
				if (res[0] && res[1]) {
					uni.pageScrollTo({
						scrollTop: res[0].top + res[1].scrollTop,
						duration: 300
					});
				}
			});
		},

		viewMore() {
			this.page++;
			this.getEvaluateList();
		},

		navBack() {
			if (this.group_buy_id && this.school_id) uni.switchTab({ url: '/pages/tabbar/home' });
			else uni.navigateBack();
		},

		openGroupingPopup() {
			if (this.info.groupbuy_num) {
				this.$refs.groupingPopup.open();
			} else {
				this.startGroup();
			}
		},
		groupingPopupClose() {
			this.$refs.groupingPopup.close();
		},

		async joinGroupOpen(item) {
			uni.showLoading({ mask: true });
			let res = await this.$http.post('/api/takeout/get_groupbuy_detail', { record_id: item.record_id });
			uni.hideLoading();
			if (res.code == 0) {
				console.log(res.data);
				for (let i = 0; i < res.data.left_user_num; i++) {
					res.data.userlist.push({ avatar: '', nickname: '' });
				}
				this.joinGroupinfo = res.data;
				this.groupingPopupClose();
				this.$refs.joinGroupPopup.open();
			}
		},

		joinPopupClose() {
			this.$refs.joinGroupPopup.close();
		},

		// 规格弹窗关闭
		optionsClose() {
			this.$refs.optionsPopup.close();
		},
		// 规格选择
		optionsSelected(item, index) {
			if (item.checked) return;
			this.info.goods_sku.forEach((em, i) => {
				if (i == index) em.checked = true;
				else em.checked = false;
			});
		},

		// 收藏
		collect() {
			if (!this.token) {
				this.setLoginModal(true);
				return;
			}
			this.$http.post('/api/service/collect_store', { store_id: this.info.store_id }).then(res => {
				if (res.code == 0) {
					this.info.is_favorite = this.info.is_favorite == 0 ? 1 : 0;
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			});
		},
		makePhoneCall() {
			uni.makePhoneCall({
				phoneNumber: this.info.service_phone
			});
		}
	}
};
</script>

<style lang="scss" scoped>
page {
	background-color: #f2f2f2;
}
/deep/ .uni-navbar {
	position: relative;
	z-index: 999;
}
.cuIcon-roundrightfill {
	position: absolute;
	top: 50rpx;
	left: 20rpx;
	z-index: 9;
	transform: rotate(180deg);
	color: #8f8c89;
	font-size: 56rpx;
}
swiper {
	width: 100%;
	height: 566rpx;
	// position: relative;
	.swiper-item,
	.food-banner {
		width: 100%;
		height: 100%;
	}
}

.foodinfo-wrap {
	background-color: #ffffff;
	padding: 15rpx 30rpx;
	.food-name-wrap {
		display: flex;
		align-items: center;
	}
	.food-name {
		font-size: 34rpx;
		font-weight: bold;
	}
	.group-num {
		flex-shrink: 0;
		margin-top: 8rpx;
		align-self: flex-start;
		margin-left: 15rpx;
		padding: 2rpx 10rpx 5rpx;
		background: linear-gradient(180deg, rgba(20, 201, 140, 1) 0%, rgba(72, 232, 178, 1) 100%);
		border-radius: 5rpx;
		color: #ffffff;
		font-size: 20rpx;
	}
	.food-sales {
		font-size: 24rpx;
		color: #989898;
		padding: 10rpx 0;
	}
	.food-price {
		font-size: 42rpx;
		color: #ff3e47;
		font-weight: bold;
	}
	.food-buy-wrap {
		display: flex;
		justify-content: space-between;
		align-items: center;
	}
	.food-packing {
		font-size: 24rpx;
		color: #989898;
	}
	.btn-foodbuy {
		font-size: 24rpx;
		color: #ffffff;
		border-radius: 27rpx;
		background-color: #ff3e47;
		margin: 0;
	}
	.cuIcon-add {
		margin-right: 10rpx;
	}
}

.food-details-wrap {
	margin-top: 20rpx;
	padding-bottom: 100rpx;

	.food-tabs {
		padding: 0 30rpx;
		display: flex;
		align-items: center;
		background-color: #ffffff;
	}
	.food-tab {
		height: 80rpx;
		line-height: 80rpx;
		position: relative;
		margin-right: 60rpx;
		font-size: 32rpx;
		&:after {
			content: '';
			width: 37rpx;
			height: 4rpx;
			background: transparent;
			position: absolute;
			left: 50%;
			bottom: 0;
			transform: translateX(-50%);
		}
	}
	.food-tab.active {
		font-size: 34rpx;
		font-weight: bold;
		&::after {
			background: rgba(255, 62, 71, 1);
		}
	}

	.food-desc {
		background-color: #ffffff;
		.food-desc-txt {
			padding: 20rpx 30rpx;
			font-size: 28rpx;
			color: #666;
		}
	}

	.food-desc-img {
		width: 100%;
		vertical-align: middle;
	}

	.food-evaluate {
		margin-top: 20rpx;
		padding: 0 30rpx;
		background-color: #ffffff;
		.food-evaluate-title {
			display: flex;
			align-items: center;
			justify-content: space-between;
			height: 88rpx;
		}
		.evaluate-label {
			font-size: 34rpx;
			font-weight: bold;
		}
		.evaluate-percent {
			font-size: 26rpx;
			color: #666;
		}
		.evaluate-list {
		}
		.evaluate-list-item {
			padding-top: 20rpx;
			padding-bottom: 10rpx;
			display: flex;
			border-bottom: 2rpx solid #ebebeb;
		}
		.evaluate-avatar {
			width: 74rpx;
			height: 74rpx;
			border-radius: 50%;
			margin-right: 10rpx;
		}
		.evaluate-right {
			flex: 1;
			overflow: hidden;
		}
		.evaluate-info {
			display: flex;
			align-items: center;
		}
		.evaluate-user {
			flex: 1;
		}
		.evaluate-time {
			font-size: 22rpx;
			color: #999;
		}
		.evaluate-username {
			font-size: 30rpx;
		}
		.evaluate-txt {
			font-size: 24rpx;
			padding: 10rpx 0;
		}
		.evaluate-imgs {
			display: flex;
			align-items: center;
			flex-wrap: wrap;
		}
		.evaluate-img {
			width: 140rpx;
			height: 140rpx;
			margin-right: 10rpx;
			margin-bottom: 10rpx;
		}
	}
	.view-more {
		// margin: 50rpx auto 30rpx;
		overflow: hidden;
		.btn-more {
			font-size: 24rpx;
			border-radius: 30rpx;
			color: #333;
			width: 220rpx;
			margin: 50rpx auto 30rpx;
			background-color: #ffffff;
			border: 2rpx solid #707070;
		}
	}
}

.group-actions {
	position: fixed;
	left: 0;
	bottom: 0;
	width: 100%;
	height: 100rpx;
	background-color: #ffffff;
	display: flex;
	align-items: center;
	box-shadow: 0px 0px 20rpx rgba(176, 176, 176, 0.15);
	.group-action-first {
		flex-shrink: 0;
		display: flex;
		align-items: center;
		.group-action-em {
			margin: 0 30rpx;
			display: flex;
			flex-direction: column;
			align-items: center;
		}
		.group-action-icon {
			width: 34rpx;
			height: 34rpx;
			margin-bottom: 8rpx;
		}
		.group-action-label {
			font-size: 20rpx;
			color: #666;
		}
	}
	.group-action-item {
		flex: 1;
		width: 200rpx;
		height: 100%;
		background-color: #ff3e47;
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
		color: #ffffff;
		&.alone {
			opacity: 0.7;
		}
		.group-action-price {
			font-size: 28rpx;
		}
		.group-action-price-label {
			font-size: 30rpx;
		}
	}
}

.grouping-popup-warp {
	width: 600rpx;
	background: rgba(255, 255, 255, 1);
	border-radius: 20rpx;
	position: relative;
	.grouping-popup-close {
		position: absolute;
		right: -26rpx;
		top: -26rpx;
		font-size: 52rpx;
		color: #ffffff;
		opacity: 0.8;
	}
	.grouping-popup-title {
		line-height: 90rpx;
		border-bottom: 2rpx solid #f2f2f2;
		font-size: 32rpx;
		text-align: center;
	}
	.grouping-list {
		height: 610rpx;
		overflow: scroll;
	}
	.grouping-list-item {
		margin-left: 20rpx;
		padding: 20rpx 20rpx 20rpx 0;
		display: flex;
		justify-content: space-between;
		align-items: center;
		border-bottom: 2rpx solid #ebebeb;
		border-radius: 20rpx;
	}

	.grouping-avatar {
		width: 70rpx;
		height: 70rpx;
		border-radius: 50%;
	}
	.grouping-desc {
		flex: 1;
		padding: 0 20rpx 0 10rpx;
		overflow: hidden;
		font-size: 24rpx;
	}
	.grouping-info {
		display: flex;
		align-items: center;

		.grouping-short {
			flex-shrink: 0;
			color: #999;
			margin-left: 10rpx;
		}
	}
	.grouping-counting {
		font-size: 22rpx;
		display: flex;
		align-items: center;
		color: #999;
		.countdown {
			padding-top: 3rpx;
		}
	}
	.btn-grouping {
		font-size: 24rpx;
		background-color: #ff3e47;
		color: #fff;
	}
}

.join-group-wrap {
	width: 600rpx;
	background: rgba(255, 255, 255, 1);
	border-radius: 15rpx;
	position: relative;
	padding: 40rpx;
	box-sizing: border-box;
	text-align: center;
	.join-popup-close {
		position: absolute;
		right: -26rpx;
		top: -26rpx;
		font-size: 52rpx;
		color: #ffffff;
		opacity: 0.8;
		z-index: 9;
	}
	.join-group-title {
		font-size: 30rpx;
	}
	.join-group-tips {
		font-size: 22rpx;
		color: #999;
		display: flex;
		align-items: center;
		justify-content: center;
		padding: 10rpx 0 30rpx 0;
	}
	.join-group-short {
		color: #ff3e47;
	}
	.btn-join-group {
		background-color: #ff3e47;
		color: #ffffff;
	}
	.join-group-avatar {
		display: flex;
		flex-wrap: wrap;
		padding: 0 80rpx;
	}
	.joingroup-avatar-wrap {
		position: relative;
		width: 88rpx;
		height: 88rpx;
		border-radius: 50%;
		margin: 0 10rpx;
		margin-bottom: 30rpx;
		&:first-child {
			border: 2rpx solid #ff3e47;
		}
		.group-host-icon {
			position: absolute;
			left: 0;
			top: -10rpx;
			width: 54rpx;
			height: 31rpx;
			z-index: 9;
		}
	}
	.joingroup-avatar-item {
		width: 100%;
		height: 100%;
		border-radius: 50%;
	}
	.countdown {
		padding-top: 2rpx;
	}
}

// 规格弹窗
.options-popup {
	z-index: 999;
	.options-container {
		width: 690upx;
		box-shadow: 0px 0px 10px 0px rgba(235, 235, 235, 0.59);
		border-radius: 20upx;
		position: relative;
		background-color: #ffffff;
		overflow: hidden;
		.options-close {
			position: absolute;
			right: 30upx;
			top: 30upx;
			font-size: 44upx;
			color: #cccccc;
			font-weight: bold;
		}
	}
}
</style>
