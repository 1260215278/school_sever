<template>
	<view class="my">
		<!-- header -->
		<view class="my-header">
			<image class="my-header-bg" src="../../static/my-bg.png" mode=""></image>
			<view class="header-title flex justify-center align-center text-xl text-white" :style="style">个人中心</view>
			<view @click="toUserinfo" class="header-userinfo padding-lr flex justify-between align-center">
				<view class="flex-sub flex align-center text-white overflow">
					<block v-if="Object.keys(userinfo).length">
						<image :src="userinfo.avatar" class="avatar" mode="aspectFill"></image>
						<view class="flex-sub flex flex-direction padding-lr overflow">
							<view class="text-cut text-xl">{{ userinfo.nickname }}</view>
							<view class="text-df padding-top-xs">{{ userinfo.mobile }}</view>
						</view>
					</block>
					<block v-if="!Object.keys(userinfo).length">
						<uni-icons type="contact-filled" size="44" color="#F5F5F5"></uni-icons>
						<view class="flex-sub padding-lr">点击登录</view>
					</block>
				</view>
				<view class="text-xl"><text class="cuIcon-right text-white"></text></view>
			</view>
		</view>
		<!-- 内容 -->
		<view class="container padding-lr">
			<view class="my-category padding-tb grid col-4">
				<view>
					<navigator url="/pages/my/my-coupons" class="flex flex-direction align-center">
						<image class="coupons-icon" src="/static/coupons-icon.png" mode=""></image>
						<text>优惠券</text>
					</navigator>
				</view>
				<view class="">
					<navigator url="/pages/my/my-collections" class="line flex flex-direction align-center">
						<image class="collection-icon" src="/static/collection-icon.png" mode=""></image>
						<text>我的收藏</text>
					</navigator>
				</view>
				<view>
					<navigator url="/pages/my/my-driving-list" class="flex flex-direction align-center">
						<image class="my-driving-icon" src="/static/my-driving-icon.png" mode=""></image>
						<text>报名驾校</text>
					</navigator>
				</view>
				<view>
					<navigator url="/pages/my/education-order" class="line flex flex-direction align-center">
						<image class="my-driving-icon education-icon" src="/static/second-phase/education-icon.png" mode=""></image>
						<text>报名教育</text>
					</navigator>
				</view>
			</view>
			<navigator url="/pages/my/apply-courier" v-if="userinfo.is_courier == 0" class="padding-tb-sm">
				<image class="courier-img" src="../../static/courier-img.png" mode=""></image>
			</navigator>
			<navigator url="/pages/my/wallet" v-else class="padding-tb-sm">
				<image class="courier-img" src="../../static/courier-img.png" mode=""></image>
			</navigator>
			<!-- 我的发布 -->
			<view class="card padding-tb">
				<view class="card-title text-df padding-lr">我的发布</view>
				<view class="grid col-4">
					<view>
						<navigator url="/pages/my/behalf-order" class="flex flex-direction align-center">
							<image class="my-help-delivery" src="../../static/my-help-delivery.png" mode=""></image>
							<text>帮取快递</text>
						</navigator>
					</view>
					<view>
						<navigator url="/pages/my/my-dynamic" class="flex flex-direction align-center">
							<image class="my-dynamic-icon" src="../../static/my-dynamic-icon.png" mode=""></image>
							<text>我的动态</text>
						</navigator>
					</view>
					<view>
						<navigator url="/pages/my/my-lost" class="flex flex-direction align-center">
							<image class="my-lost-property" src="../../static/my-lost-property.png" mode=""></image>
							<text>失物招领</text>
						</navigator>
					</view>
					<view>
						<navigator url="/pages/my/my-used-idle" class="flex flex-direction align-center">
							<image class="my-idle-icon" src="../../static/my-idle-icon.png" mode=""></image>
							<text>二手闲置</text>
						</navigator>
					</view>
				</view>
			</view>
			<!-- 其他服务 -->
			<view class="card padding-tb">
				<view class="card-title text-df padding-lr">其他服务</view>
				<view class="grid col-4">
					<view>
						<navigator url="/pages/my/my-msg" class="flex flex-direction align-center badge-msg">
							<image class="my-msg-icon" src="/static/my-msg-icon.png" mode=""></image>
							<text>消息</text>
							<text v-if="badgeShow" class="cu-tag badge badge-item">{{ badgeNum }}</text>
						</navigator>
					</view>
					<view>
						<navigator url="/pages/my/about" class="flex flex-direction align-center">
							<image class="my-about-icon" src="/static/my-about-icon.png" mode=""></image>
							<text>关于我们</text>
						</navigator>
					</view>
					<view>
						<navigator url="/pages/my/instruction" class="flex flex-direction align-center">
							<image class="my-explain-icon" src="/static/my-explain-icon.png" mode=""></image>
							<text>使用说明</text>
						</navigator>
					</view>
					<view @click="openContactusPopup" class="flex flex-direction align-center">
						<image class="my-concat-icon" src="/static/my-concat-icon.png" mode=""></image>
						<text>联系我们</text>
					</view>
					<!-- <view @click="navInvite" class="flex flex-direction align-center"> -->
						<!-- <uview url="/pages/my/ivite-detail" class="flex flex-direction align-center"> -->
						<!-- <image class="my-concat-icon" src="/static/second-phase/invite-icon.png" mode=""></image>
						<text>邀请有礼</text> -->
						<!-- </navigator> -->
					<!-- </view> -->
				</view>
			</view>

			<!-- 退出登录 -->
			<view v-if="token" class="logout-wrap"><button @click="logout" class="cu-btn round lg bg-red block">退出登录</button></view>
		</view>

		<!-- 联系我们弹窗 -->
		<uni-popup ref="contactusPopup" class="contactus-popup">
			<view class="popup-container">
				<view @click="makePhoneCall" class="flex align-center text-lg padding-tb padding-lr-xl solid-bottom">
					<image src="../../static/contact-phone.png" class="contact-phone" mode=""></image>
					<text class="padding-lr-sm">客服电话</text>
				</view>
				<view @click="closePopup" class="popup-close-icon"><text class="cuIcon-roundclosefill"></text></view>
			</view>
		</uni-popup>

		<login-modal></login-modal>
	</view>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import common from '@/utils/mixins/common.js';
import { debounce } from '@/utils/util.js';
import LoginModal from '@/components/login/login-modal.vue';

export default {
	components: { LoginModal },
	mixins: [common],
	data() {
		return {
			CustomBar: this.CustomBar,
			serviceTel: '', // 客服电话
			badgeShow: false,
			badgeNum: ''
		};
	},
	computed: {
		...mapGetters(['userinfo', 'schoolinfo', 'token', 'shareData']),
		style() {
			var StatusBar = this.StatusBar;
			var CustomBar = this.CustomBar;
			var style = `height:${CustomBar}px;padding-top:${StatusBar}px;`;
			return style;
		}
	},
	onLoad() {
		this.getUserinfo();
	},
	onShow() {
		this.getBadgeNum();
	},
	onShareAppMessage() {
		return {
			title: this.shareData ? this.shareData.title : '',
			path: this.shareData && this.userinfo ? `/pages/tabbar/home?invite_code=${this.userinfo.invite_code}` : ''
		};
	},
	methods: {
		...mapActions(['setUserinfo', 'setToken', 'setSchoolinfo']),
		// 我的消息红点
		getBadgeNum() {
			this.$http.post('/api/personal/has_unread_msg').then(res => {
				if (res.code == 0) {
					if (res.data.total) {
						uni.showTabBarRedDot({ index: 4 });
						this.badgeShow = true;
						this.badgeNum = res.data.total;
					} else {
						uni.hideTabBarRedDot({ index: 4 });
						this.badgeShow = false;
					}
				}
			});
		},
		// 登出
		logout() {
			// #ifdef H5
			this.setToken('');
			uni.setStorageSync('lzp_schoolinfo', '');
			this.setSchoolinfo('');
			uni.setStorageSync('lzp_location_position', '');
			setTimeout(() => {
				location.reload();
			}, 100);
			// #endif
			// #ifdef MP
			this.setToken('');
			this.setUserinfo('')
			// #endif
		},
		getUserinfo() {
			if (!this.token) return;
			this.$http.post('/api/express/personal_information').then(res => {
				if (res.code == 0) {
					this.setUserinfo(res.data);
				}
			});
		},
		// 联系我们
		openContactusPopup() {
			if (this.serviceTel) {
				this.$refs.contactusPopup.open();
			} else {
				this.$http.post('/api/personal/phone', { school_id: this.schoolinfo.id }).then(res => {
					if (res.code == 0) {
						this.serviceTel = res.data;
						this.$refs.contactusPopup.open();
					}
				});
			}
		},
		closePopup() {
			this.$refs.contactusPopup.close();
		},
		makePhoneCall() {
			uni.makePhoneCall({
				phoneNumber: this.serviceTel
			});
		},
		toUserinfo() {
			if (!this.token) {
				this.setLoginModal(true);
				return;
			}
			uni.navigateTo({
				url: '/pages/my/userinfo'
			});
		},
		navInvite() {
			if (!this.token) {
				this.setLoginModal(true);
				return;
			}
			uni.navigateTo({ url: '/pages/my/ivite-detail' });
		}
	}
};
</script>

<style lang="scss">
.my {
	.my-header {
		position: relative;
		.my-header-bg {
			width: 100%;
			height: 390upx;
		}
		.header-title {
			position: absolute;
			left: 0;
			right: 0;
			z-index: 9;
			top: 0;
		}
		.avatar {
			width: 88upx;
			height: 88upx;
			border-radius: 50%;
			margin-left: 10upx;
		}
		.header-userinfo {
			position: absolute;
			top: 160upx;
			left: 0;
			right: 0;
		}
	}
	.container {
		position: relative;
		top: -110upx;
		.my-category {
			box-shadow: 0px 0px 10upx 0px rgba(152, 152, 152, 0.2);
			border-radius: 20upx;
			background: #ffffff;
			.coupons-icon,
			.collection-icon,
			.my-driving-icon {
				width: 56upx;
				height: 56upx;
				margin-bottom: 15upx;
				&.education-icon {
					width: 66rpx;
					height: 56rpx;
				}
			}
			.line {
				position: relative;
				&:after {
					content: '';
					width: 2upx;
					height: 88upx;
					background: rgba(235, 235, 235, 1);
					position: absolute;
					top: 50%;
					right: 0;
					transform: translateY(-50%);
				}
				&:before {
					content: '';
					width: 2upx;
					height: 88upx;
					background: rgba(235, 235, 235, 1);
					position: absolute;
					top: 50%;
					left: 0;
					transform: translateY(-50%);
				}
			}
		}
		.courier-img {
			width: 100%;
			height: 140upx;
		}
		.card {
			box-shadow: 0px 0px 10upx 0px rgba(152, 152, 152, 0.2);
			border-radius: 20upx;
			margin-bottom: 20upx;
			.my-help-delivery,
			.my-dynamic-icon,
			.my-lost-property,
			.my-idle-icon,
			.my-msg-icon,
			.my-about-icon,
			.my-concat-icon,
			.my-explain-icon {
				width: 56upx;
				height: 56upx;
				margin: 10upx 0;
			}
		}
		.logout-wrap {
			padding: 40upx 60upx 0;
			.cu-btn {
				box-shadow: 0px 2px 10px 0px rgba(255, 62, 71, 0.5);
			}
		}
	}
	// 联系我们弹窗
	.contactus-popup {
		z-index: 999;
		.popup-container {
			background: #ffffff;
			border-radius: 20upx;
			padding: 0 30upx;
			position: relative;
		}
		.contact-phone,
		.contact-weChat {
			width: 50upx;
			height: 50upx;
		}
		.popup-close-icon {
			position: absolute;
			left: 50%;
			transform: translateX(-50%);
			bottom: -90upx;
			font-size: 60upx;
			color: #ffffff;
		}
	}

	// 消息小红点
	.badge-msg {
		position: relative;
		.badge-item {
			position: absolute;
			// height: 20upx;
			top: 5upx;
			right: 30upx;
			background-color: #f43530;
		}
	}
}
</style>
