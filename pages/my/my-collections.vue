<template>
	<view class="my-collections">
		<cu-custom isBack bgColor="bg-white text-black"><block slot="content">收藏</block></cu-custom>
		<view class="tabs grid col-3 bg-white text-lg" :style="{ top: CustomBar + 'px' }">
			<view @click="changeTab(index)" v-for="(item, index) in tabs" :key="index" class="tab flex justify-center align-center" :class="{ active: currentTab == index }">
				{{ item }}
			</view>
		</view>
		<view class="container" :style="{ paddingTop: 50 + 'px' }">
			<view v-if="currentTab == 0" class="tab-0">
				<view
					@click="toDetails(item)"
					@longpress="longpress(item.cid, 'store')"
					v-for="(item, index) in storeList"
					:key="index"
					class="card padding-sm margin-lr margin-bottom-sm flex"
				>
					<block v-if="item.store_type == 1">
						<image :src="item.store_avatar_path" class="tab-0-takeout" mode="aspectFill"></image>
						<view class="flex-sub overflow">
							<view class="text-df text-bold text-cut">{{ item.store_name }}</view>
							<view class="flex align-center padding-tb-xs">
								<tui-rate :current="item.store_star" disabled :hollow="true" active="#FFD200"></tui-rate>
								<view class="flex-sub text-right text-666">起送￥{{ item.send_fee }} | 配送费￥{{ item.delive_fee }}</view>
							</view>
							<view class="">
								<view v-for="(em, i) in item.coupon" :key="i" class="cu-tag line-red sm radius">{{ tagsTxt(em) }}</view>
							</view>
						</view>
					</block>
					<block v-if="item.store_type == 2">
						<image :src="item.store_avatar_path" class="tab-0-life" mode="aspectFill"></image>
						<view class="flex-sub overflow flex flex-direction justify-between">
							<view class="text-df text-bold text-cut">{{ item.store_name }}</view>
							<view class=""><tui-rate :current="item.store_star" hollow active="#FFD200" disabled></tui-rate></view>
							<view class="flex justify-between">
								<view class="text-666">距离我{{ item.store_distance }}</view>
								<view class="text-price text-red text-lg">{{ item.price }}</view>
							</view>
						</view>
					</block>
				</view>
				<tui-tips v-if="storeNodata" imgUrl="../../static/img_nodata.png" fixed>暂无数据</tui-tips>
			</view>
			<view v-if="currentTab == 1" class="tab-1">
				<view class="card-wrap padding-lr">
					<composite-card @click.native="toDetails(item)" @longpress.native="longpress(item.id)" v-for="(item, index) in idleList" :key="index" :item="item"></composite-card>
					<tui-tips v-if="idleNodata" fixed imgUrl="../../static/img_nodata.png">暂无数据</tui-tips>
				</view>
			</view>
			<view v-if="currentTab == 2" class="tab-2">
				<view class="driving-wrap padding-lr">
					<driving-card @click.native="toDetails(item)" @longpress.native="longpress(item.id)" v-for="(item, index) in drivingList" :key="index" :item="item"></driving-card>
					<tui-tips v-if="drivingNodata" fixed imgUrl="../../static/img_nodata.png">暂无数据</tui-tips>
				</view>
			</view>
		</view>

		<!-- 删除收藏弹窗 -->
		<uni-popup ref="delPopup" class="delPopup" @change="changePopup">
			<view class="popup-container padding-top-xs">
				<view class="flex flex-direction align-center padding-tb solids-bottom"><text class="padding-tb text-xl text-bold">删除收藏？</text></view>
				<view class="popup-actions grid col-2 padding-tb text-df text-center">
					<view @click="cancel" class="text-999 back-home">取消</view>
					<view @click="confirm" class="text-green">确定</view>
				</view>
			</view>
		</uni-popup>

		<login-modal></login-modal>
	</view>
</template>

<script>
import tuiRate from '@/components/rate/rate.vue';
import compositeCard from '@/components/composite/composite-card.vue';
import drivingCard from '@/components/composite/driving-card.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import common from '@/utils/mixins/common.js';
import tuiTips from '@/components/tips/tips.vue';
import { mapGetters } from 'vuex';

export default {
	components: { tuiRate, compositeCard, drivingCard, uniPopup, tuiTips },
	mixins: [common],
	data() {
		return {
			CustomBar: this.CustomBar,
			tabs: ['商家', '二手闲置', '驾校'],
			currentTab: 0,
			storeList: [], // 商家
			storePage: 1,
			storeLastPage: 1,
			storeNodata: false,
			idleList: [], // 二手闲置
			delId: '', // 删除id
			idlePage: 1,
			idleLastPage: 1,
			idleNodata: false,
			drivingList: [], // 驾校
			drivingPage: 1,
			drivingLastPage: 1,
			drivingNodata: false,
			isDelStore: false // 商家店铺删除
		};
	},
	computed: {
		...mapGetters(['schoolinfo'])
	},
	onLoad() {
		this.getStoreList();
		this.getIdleList();
		this.getDrivingList();
	},
	onReachBottom() {
		if (this.currentTab == 1) {
			if (this.idlePage < this.idleLastPage) {
				this.idlePage++;
				this.getIdleList();
			}
		} else if (this.currentTab == 2) {
			if (this.drivingPage < this.drivingLastPage) {
				this.drivingPage++;
				this.getDrivingList();
			}
		}
	},
	methods: {
		// 优惠券tags
		tagsTxt(item) {
			if (item) {
				if (item.type == 1) {
					return item.condition + '减' + item.discount;
				} else if (item.type == 2) {
					return item.discount + '无门槛';
				} else {
					return '首单减' + item.discount;
				}
			} else {
				return '';
			}
		},

		changeTab(val) {
			val != this.currentTab && (this.currentTab = val);
		},

		// 商家
		getStoreList() {
			this.$http.post('/api/service/my_collect_store', { school_id: this.schoolinfo.id }).then(res => {
				if (res.code == 0) {
					this.storeLastPage = res.data.last_page;
					this.storeNodata = !res.data.data.length;
					if (this.storePage > 1) {
						this.storeList.push(...res.data.data);
					} else {
						this.storeList = res.data.data;
					}
				} else {
					this.storeList = [];
					this.storeNodata = true;
				}
			});
		},

		// 二手闲置
		getIdleList() {
			this.$http.post('/api/driving/leave_recommend', { page: this.idlePage }).then(res => {
				if (res.code == 0) {
					this.idleLastPage = res.data.last_page;
					this.idleNodata = !res.data.data.length;
					if (this.idlePage > 1) {
						this.idleList.push(...res.data.data);
					} else {
						this.idleList = res.data.data;
					}
				}
			});
		},
		// 驾校列表
		getDrivingList() {
			this.$http.post('/api/driving/enshrine_driving', { school_id: this.schoolinfo.id, page: this.drivingPage }).then(res => {
				if (res.code == 0) {
					this.drivingLastPage = res.data.last_page;
					this.drivingNodata = !res.data.list.length;
					if (this.drivingPage > 1) {
						this.drivingList.push(...res.data.list);
					} else {
						this.drivingList = res.data.list;
					}
				}
			});
		},
		longpress(id, type) {
			this.delId = id;
			this.$refs.delPopup.open();
			if (type) {
				this.isDelStore = true;
			}
		},
		cancel() {
			this.$refs.delPopup.close();
		},
		changePopup(e) {
			if (!e.show) {
				this.isDelStore = false;
			}
		},
		confirm() {
			if (!this.isDelStore) {
				this.$http.post('/api/driving/deleteEnshrine', { id: this.delId }).then(res => {
					if (res.code == 0) {
						this.$refs.delPopup.close();
						if (this.currentTab == 1) {
							this.idlePage = 1;
							this.getIdleList();
						} else if (this.currentTab == 2) {
							this.drivingPage = 1;
							this.getDrivingList();
						}
					}
				});
			} else {
				this.$http.post('/api/service/collect_store', { store_id: this.delId }).then(res => {
					this.$refs.delPopup.close();
					this.storePage = 1;
					this.getStoreList();
				});
			}
		},

		// 跳转详情
		toDetails(item) {
			if (this.currentTab == 0) {
				if (item.store_type == 1) {
					uni.navigateTo({
						url: `/pages/home/takeout-details?id=${item.cid}`
					});
				} else {
					uni.navigateTo({
						url: `/pages/home/life-details?id=${item.cid}`
					});
				}
			} else if (this.currentTab == 1) {
				uni.navigateTo({
					url: `/pages/composite/used-idle-details?id=${item.cid}&type=1`
				});
			} else {
				uni.navigateTo({
					url: `/pages/composite/driving-details?id=${item.cid}`
				});
			}
		}
	}
};
</script>

<style lang="scss">
/deep/.cu-custom .cu-bar {
	z-index: 99;
}
.my-collections {
	.tabs {
		position: fixed;
		left: 0;
		right: 0;
		top: 0;
		z-index: 9;
		.tab {
			height: 80upx;
			position: relative;
			color: #999999;
			transition: all 0.2s;
			&.active {
				color: #26d499;
				&::after {
					background: rgba(38, 212, 153, 1);
				}
			}
			&::after {
				content: '';
				width: 36upx;
				height: 4upx;
				background-color: transparent;
				border-radius: 2upx;
				position: absolute;
				left: 50%;
				bottom: 0;
				transform: translateX(-50%);
			}
		}
	}
	.container {
		.tab-0 {
			.card {
				box-shadow: 0px 0px 20px 0px rgba(176, 176, 176, 0.15);
				border-radius: 12upx;
				background-color: #ffffff;
				.tab-0-takeout {
					width: 140upx;
					height: 100upx;
					border-radius: 8upx;
					margin-right: 20upx;
				}
				.tab-0-life {
					width: 140upx;
					height: 124upx;
					border-radius: 8upx;
					margin-right: 20upx;
				}
			}
		}
	}
	// 发布成功弹窗
	.delPopup {
		.popup-container {
			width: 560upx;
			background: rgba(255, 255, 255, 1);
			border-radius: 20upx;
		}
		.popup-actions {
			.back-home {
				position: relative;
				&:after {
					content: '';
					position: absolute;
					right: 0;
					top: 50%;
					transform: translateY(-50%);
					width: 2upx;
					height: 40upx;
					background: rgba(235, 235, 235, 1);
					border-radius: 1px;
				}
			}
		}
	}
}
</style>
