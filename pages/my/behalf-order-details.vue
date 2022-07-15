<template>
	<view class="behalf-order-details">
		<uni-nav-bar @clickLeft="clickLeft" class="uniNavBar" statusBar title="详情" left-icon="back" color="white" :shadow="false" backgroundColor="transparent"></uni-nav-bar>
		<view class="header">
			<view class="status text-xxl text-blod text-white">{{ statusTxt(info.type) }}</view>
			<image src="../../static/order-behalf-bg.png" class="order-behalf-bg" mode=""></image>
		</view>
		<view class="container">
			<!-- 地址 -->
			<view class="item padding">
				<view class="text-xl text-bold">{{ info.address }}</view>
				<view class="text-df padding-top-sm">
					<text>{{ info.name }}</text>
					<text class="padding-lr">{{ info.phone }}</text>
				</view>
				<!-- <view class="text-xl text-666"><text class="cuIcon-right"></text></view> -->
			</view>
			<!-- 快递信息 -->
			<view class="item">
				<view class="text-lg text-green padding-sm">
					<text class="cuIcon-titles"><text class="text-black">快递信息</text></text>
				</view>
				<view class="text-df padding-left-xl padding-bottom-xs">
					<view class="flex info-txt">
						<text class="text-666">快递名称</text>
						<text class="overflow ">{{ info.express_name }}</text>
					</view>
					<view class="flex info-txt ">
						<text class="text-666">快递大小</text>
						<text class="overflow">{{ info.express_tracking }}</text>
					</view>
					<view class="flex info-txt">
						<text class="text-666">期望送达</text>
						<text class="overflow">{{ info.reach_d + ' ' + info.reach_time }}</text>
					</view>
					<view class="flex info-txt">
						<text class="text-666">取快递方法</text>
						<text class="overflow">{{ info.mode }}</text>
					</view>
					<view class="flex info-txt">
						<text class="text-666">价格</text>
						<text class="overflow">￥{{ info.price }}</text>
					</view>
					<view class="flex info-txt">
						<text class="text-666">备注</text>
						<text class="overflow">{{ info.remark }}</text>
					</view>
				</view>
			</view>
			<!-- 订单信息 -->
			<view class="item">
				<view class="text-lg text-green padding-sm">
					<text class="cuIcon-titles"><text class="text-black">订单信息</text></text>
				</view>
				<view class="text-df padding-left-xl padding-bottom-xs">
					<view class="flex info-txt">
						<text class="text-666">订单号</text>
						<text class="overflow" style="word-wrap: break-word;">{{ info.number }}</text>
					</view>
					<view class="flex info-txt ">
						<text class="text-666">下单时间</text>
						<text class="overflow">{{ info.addtime }}</text>
					</view>
				</view>
			</view>
		</view>
		<!-- 底部操作条 -->
		<view v-if="!(info.type == 3 || info.type == 4)" class="actions-wrapper">
			<button @click="makePhoneCall" v-if="info.type == 2" class="complaints cu-btn margin-left-sm">投诉</button>
			<button @click="makePhoneCall" v-if="info.type == 1" class="cu-btn bg-green margin-left-sm">联系客服</button>
			<button @click="confirmReceipt" v-if="info.type == 2" class="cu-btn bg-green margin-left-sm">确认收货</button>
		</view>

		<login-modal></login-modal>
	</view>
</template>

<script>
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
import common from '@/utils/mixins/common.js';
import { mapGetters } from 'vuex';

export default {
	components: { uniNavBar },
	mixins: [common],
	data() {
		return {
			CustomBar: this.CustomBar,
			notes: '',
			id: '', // 订单id
			info: {},
			serviceTel: '' // 客服电话
		};
	},
	computed: {
		...mapGetters(['schoolinfo'])
	},
	onLoad(option) {
		this.id = option.id;
		if (option.tel) {
			this.serviceTel = option.tel;
		} else {
			this.getServicePhone();
		}
		this.getData();
	},
	methods: {
		getServicePhone() {
			this.$http.post('/api/personal/phone', { school_id: this.schoolinfo.id }).then(res => {
				if (res.code == 0) {
					this.serviceTel = res.data;
				}
			});
		},
		makePhoneCall() {
			uni.makePhoneCall({
				phoneNumber: this.serviceTel
			});
		},
		clickLeft() {
			uni.navigateBack();
		},
		statusTxt(type) {
			// 1 是待接单 2 配送中 3 是已完成 4 是已退款
			if (type) {
				if (type == 1) {
					return '待接单';
				} else if (type == 2) {
					return '配送中';
				} else if (type == 3) {
					return '已完成';
				} else {
					return '已退款';
				}
			} else {
				return '';
			}
		},
		getData() {
			this.$http.post('/api/express/express_details', { id: this.id }).then(res => {
				if (res.code == 0) {
					this.info = res.data;
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			});
		},
		// 确认收货
		confirmReceipt() {
			this.$http.post('/api/express/express_notarize', { id: this.id }).then(res => {
				if (res.code == 0) {
					uni.showToast({
						title: res.msg,
						icon: 'none',
						mask: true
					});
					this.getData();
				}
			});
		}
	}
};
</script>
<style lang="scss">
page {
	background: #fafafa;
}
.behalf-order-details {
	.uniNavBar {
		/deep/.uni-navbar--border {
			border-bottom-color: transparent;
		}
		/deep/.uni-navbar__content {
			background: linear-gradient(94deg, rgba(20, 201, 140, 1), rgba(72, 232, 178, 1)) !important;
		}
	}
	.header {
		height: 150upx;
		background: linear-gradient(94deg, rgba(20, 201, 140, 1), rgba(72, 232, 178, 1));
		position: relative;
		.status {
			position: absolute;
			bottom: 40upx;
			left: 0;
			padding: 0 60upx;
		}
		.order-behalf-bg {
			width: 120upx;
			height: 116upx;
			position: absolute;
			bottom: 0;
			right: 70upx;
		}
	}
	.container {
		margin-top: 20upx;
		padding-bottom: 100upx;
		.item {
			box-shadow: 0px 0px 10upx 0px rgba(152, 152, 152, 0.1);
			border-radius: 20upx;
			margin: 0 30upx;
			margin-bottom: 20upx;
			background: #ffffff;
		}
		.info-txt {
			padding: 5upx 0;
			> text:first-child {
				flex: 0 0 180upx;
			}
		}
	}
	.actions-wrapper {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		height: 100upx;
		padding: 0 30upx;
		background: #ffffff;
		display: flex;
		justify-content: flex-end;
		align-items: center;
		.complaints {
			background: #cccccc;
			color: #ffffff;
			font-size: 28upx;
			width: 192upx;
		}
	}
}
</style>
