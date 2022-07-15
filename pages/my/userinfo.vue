<template>
	<view class="userinfo">
		<cu-custom bgColor="bg-white text-black" isBack><block slot="content">个人资料</block></cu-custom>
		<view class="container padding-lr">
			<view class="card">
				<view @click="ChooseImage" class="flex justify-center align-center padding-top-xl"><image :src="userinfo.avatar" class="avatar" mode="aspectFill"></image></view>
				<view @click="amend(0)" class="padding-tb solid-bottom text-hf flex justify-between align-center">
					<view class="text-999">昵称</view>
					<view class="">{{ userinfo.nickname }}</view>
					<view v-if="!userinfo.nickname" class="text-999">点击可修改</view>
				</view>
				<view @click="amendPhone" class="padding-tb text-hf flex justify-between align-center">
					<view class="text-999">手机号</view>
					<view class="">{{ userinfo.mobile }}</view>
					<view v-if="!userinfo.mobile" class="text-999">点击可修改</view>
				</view>
			</view>
			<!-- 修改学校 楼号 楼层 房间号 暂时去掉 无关联东西 -->
			<!-- <view class="card text-hf">
				<view @click="amend(1)" class="flex justify-between align-center padding-tb solid-bottom">
					<view class="text-999">学校</view>
					<view class="">{{ userinfo.school_name }}</view>
					<view v-if="!userinfo.school_name" class="text-999">点击可修改</view>
				</view>
				<view @click="amend(2)" class="flex justify-between align-center padding-tb solid-bottom">
					<view class="text-999">楼号</view>
					<view class="">{{ userinfo.building_num }}</view>
					<view v-if="!userinfo.building_num" class="text-999">点击可修改</view>
				</view>
				<view @click="amend(3)" class="flex justify-between align-center padding-tb solid-bottom">
					<view class="text-999">楼层</view>
					<view class="">{{ userinfo.level }}</view>
					<view v-if="!userinfo.level" class="text-999">点击可修改</view>
				</view>
				<view @click="amend(4)" class="flex justify-between align-center padding-tb">
					<view class="text-999">房间号</view>
					<view class="">{{ userinfo.room_num }}</view>
					<view v-if="!userinfo.room_num" class="text-999">点击可修改</view>
				</view>
			</view> -->
			<navigator url="/pages/my/address" class="card">
				<view class="padding-tb text-hf flex justify-between align-center">
					<view class="">收货地址</view>
					<text class="cuIcon-right text-999"></text>
				</view>
			</navigator>
		</view>
		<!-- 修改信息弹窗 -->
		<uni-popup ref="popup">
			<view class="popup-container">
				<view class="padding-tb text-lg flex justify-center">{{ popupContent.title }}</view>
				<view v-if="popupContent.type !== 1" class="input-wrap"><input v-model="inputVal" type="text" :placeholder="popupContent.placeholder" /></view>
				<view v-if="popupContent.type === 1" class="textarea-wrap"><textarea @blur="inputBlur" v-model="inputVal" :placeholder="popupContent.placeholder"></textarea></view>
				<view class="popup-actions grid col-2 padding-tb text-df text-center">
					<view @click="cancelPopup" class="text-999 btn-item">取消</view>
					<view @click="confirmPopup(popupContent.type)" class="text-green">确定</view>
				</view>
			</view>
		</uni-popup>

		<login-modal></login-modal>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import common from '@/utils/mixins/common.js';
import { mapGetters, mapActions } from 'vuex';

export default {
	components: { uniPopup },
	mixins: [common],
	data() {
		return {
			popupType: 0, // 0 修改昵称 1 修改学校 2 修改楼号
			inputVal: '',

			scrollTopPX: '' //滚动的位置
		};
	},
	computed: {
		...mapGetters(['userinfo']),
		popupContent() {
			if (this.popupType === 0) {
				return { type: 0, title: '修改昵称', placeholder: '请输入新的昵称', apiUrl: '/api/personal/amend_nickname', paramsName: 'nickname' };
			} else if (this.popupType === 1) {
				return { type: 1, title: '修改学校', placeholder: '请输入所在学校名称', apiUrl: '/api/express/edit_school', paramsName: 'school_name' };
			} else if (this.popupType === 2) {
				return { type: 2, title: '修改楼号', placeholder: '请输入所在学校的楼号', apiUrl: '/api/express/building_num', paramsName: 'building_num' };
			} else if (this.popupType === 3) {
				return { type: 3, title: '修改楼层', placeholder: '请输入所在学校的楼层', apiUrl: '/api/express/level', paramsName: 'level' };
			} else {
				return { type: 4, title: '修改房间号', placeholder: '请输入所在学校的房间号', apiUrl: '/api/express/room_num', paramsName: 'room_num' };
			}
		}
	},
	onLoad() {
		this.getData();
	},
	//监听滚动条滚动的距离
	onPageScroll(res) {
		this.scrollTopPX = res.scrollTop;
	},
	methods: {
		...mapActions(['setUserinfo']),
		inputBlur() {
			uni.pageScrollTo({
				scrollTop: this.scrollTopPX,
				duration: 0
			});
		},
		getData() {
			this.$http.post('/api/express/personal_information').then(res => {
				if (res.code == 0) {
					this.setUserinfo(res.data);
				}
			});
		},
		// 修改信息弹窗
		amend(val) {
			this.popupType = val;
			this.inputVal = '';
			this.$refs.popup.open();
		},
		cancelPopup() {
			this.$refs.popup.close();
		},
		confirmPopup(type) {
			if (!this.inputVal.trim()) {
				uni.showToast({
					title: '修改内容不能为空',
					icon: 'none'
				});
				return;
			}
			let params = new Object();
			params[this.popupContent.paramsName] = this.inputVal;
			this.$http.post(this.popupContent.apiUrl, params).then(res => {
				if (res.code == 0) {
					this.$refs.popup.close();
					this.inputVal = '';
					this.getData();
				}
			});
		},
		amendPhone() {
			uni.navigateTo({
				url: '/pages/my/modify-phone'
			});
		},

		// 修改头像
		ChooseImage() {
			uni.chooseImage({
				count: 9, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['camera', 'album'], //从相册选择
				success: res => {
					let files = res.tempFilePaths;
					uni.uploadFile({
						url: this.$domain + '/api/login/upload_image',
						filePath: files[0],
						name: 'file',
						success: res => {
							if (res.statusCode == 200) {
								let data = JSON.parse(res.data);
								if (data.code == 0) {
									this.$http.post('/api/personal/profile', { icon: data.id }).then(res => {
										this.getData();
										uni.showToast({
											title: '修改成功',
											icon: 'none'
										});
									});
								}
							}
						}
					});
				}
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background: #f2f2f2;
}
/deep/.cu-custom .cu-bar {
	z-index: 99;
}
.userinfo {
	.card {
		box-shadow: 0px 0px 10px 0px rgba(152, 152, 152, 0.1);
		border-radius: 20upx;
		background: #ffffff;
		padding: 0 30upx;
		margin-top: 20upx;
	}
	.avatar {
		width: 120upx;
		height: 120upx;
		border-radius: 50%;
		overflow: hidden;
	}
	// 弹窗
	.popup-container {
		width: 500upx;
		background: #ffffff;
		border-radius: 20upx;
		.input-wrap {
			height: 80upx;
			border: 2upx solid #ebebeb;
			border-radius: 40upx;
			margin: 0 25upx 50upx 25upx;
			input {
				height: 100%;
				line-height: 80upx;
				padding: 0 30upx;
			}
		}
		.textarea-wrap {
			height: 120upx;
			border: 2upx solid #ebebeb;
			border-radius: 20upx;
			margin: 0 25upx 50upx 25upx;
			textarea {
				height: 100%;
				padding: 20upx 30upx;
			}
		}
		.popup-actions {
			border-top: 2upx solid #ebebeb;
			.btn-item {
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
