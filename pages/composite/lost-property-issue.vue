<!-- 注释部分是分类 暂时隐藏 以后不用 可删除 -->

<template>
	<view class="lost-property-issue">
		<uni-nav-bar title="失物招领" leftIcon="back" fixed @clickLeft="clickLeft" :statusBar="true"></uni-nav-bar>
		<view class="container">
			<view class=""><image src="../../static/lost-property-banner.png" class="lost-property-banner" mode="aspectFill"></image></view>
			<view class="card padding-lr padding-top-xs margin-lr">
				<view class="card-item solid-bottom flex align-center">
					<view class="text-999">丢失/捡到</view>
					<view class="flex-sub flex align-center justify-end">
						<view @click="selectedType(1)" class="flex align-center">
							<image v-if="form.type != 1" src="../../static/radio-select.png" class="radio-select" mode=""></image>
							<image v-if="form.type == 1" src="../../static/radio-selected.png" class="radio-selected" mode=""></image>
							<text class="padding-left-xs">我丢失的</text>
						</view>
						<view @click="selectedType(2)" class="flex align-center margin-left">
							<image v-if="form.type != 2" src="../../static/radio-select.png" class="radio-select" mode=""></image>
							<image v-if="form.type == 2" src="../../static/radio-selected.png" class="radio-selected" mode=""></image>
							<text class="padding-left-xs">我捡到的</text>
						</view>
					</view>
				</view>
			</view>
			<view class="card padding-lr padding-top-xs margin-lr">
				<view class="card-item solid-bottom flex align-center">
					<view class="text-999">标题：</view>
					<input v-model="form.title" class="input" type="text" placeholder="请输入标题" />
				</view>
				<view class="card-item solid-bottom flex align-center">
					<view class="text-999">手机号：</view>
					<input v-model="form.phone" @input="phoneInput" :maxlength="11" class="input" type="number" placeholder="请输入手机号" />
				</view>
				<!-- <view @click="toSelectCategory" class="card-item solid-bottom flex align-center">
					<view class="text-999">分类：</view>
					<view class="flex-sub flex align-center">
						<input v-model="selectedCategory" class="input" disabled type="text" placeholder="请选择分类" />
						<text class="cuIcon-right text-999"></text>
					</view>
				</view> -->
			</view>
			<view class="card padding-lr margin-lr">
				<textarea @blur="inputBlur" v-model="form.describe" class="textarea" placeholder="请对您的需求进行描述~" />
				<view class="upload-wrap">
					<view class="bg-img" v-for="(item, index) in imgList" :key="index" @tap="ViewImage" :data-url="imgList[index]">
						<view class="img-wrap"><image class="img" :src="imgList[index]" mode="aspectFill"></image></view>
						<view class="del-icon-wrap" @tap.stop="DelImg" :data-index="index"><image src="../../static/del-icon.png" class="del-icon" mode=""></image></view>
					</view>
					<view class="bg-img" @tap="ChooseImage">
						<view class="img-wrap"><image src="../../static/upload-add-icon.png" class="img" mode=""></image></view>
					</view>
				</view>
			</view>
			<view class="margin padding-xl"><button @click="submitIssue" :disabled="disabled" type="" class="cu-btn bg-green round lg block issue-btn">发布</button></view>
		</view>
		<!-- 选择分类弹窗 -->
		<!-- <uni-popup ref="categoryPickerPopup" type="bottom">
			<view class="picker-container">
				<view class="picker-header flex justify-between align-center">
					<view @click="cancelPickerPopup" class="text-999">取消</view>
					<view class="picker-title">选择分类</view>
					<view @click="confirmPickerPopup" class="text-green">完成</view>
				</view>
				<picker-view v-if="visible" :indicator-style="indicatorStyle" :value="categoryValue" @change="bindChange">
					<picker-view-column>
						<view class="item" :class="index == categoryValue[0] ? 'active' : ''" v-for="(item, index) in categoryList" :key="index">{{ item.brand_name }}</view>
					</picker-view-column>
				</picker-view>
			</view>
		</uni-popup> -->
		<!-- 发布成功弹窗 -->
		<uni-popup ref="issuePopup" class="issuePopup">
			<view class="popup-container padding-top-xs">
				<view class="flex flex-direction align-center padding-tb solids-bottom">
					<image src="../../static/success-icon.png" class="success-icon" mode=""></image>
					<text class="padding-tb">发布成功</text>
				</view>
				<view class="popup-actions grid col-2 padding-tb text-df text-center">
					<view @click="backHome" class="text-999 back-home">返回首页</view>
					<view @click="toView" class="text-green">立即查看</view>
				</view>
			</view>
		</uni-popup>

		<login-modal></login-modal>
	</view>
</template>

<script>
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import { mapGetters } from 'vuex';
import common from '@/utils/mixins/common.js';

export default {
	components: { uniNavBar, uniPopup },
	mixins: [common],
	data() {
		return {
			visible: false, // picker view 显示隐藏
			imgList: [],
			imgsIds: [],
			// categoryList: [],
			// categoryValue: [0],
			// selectedCategory: '',
			// indicatorStyle: `height: ${Math.round(uni.getSystemInfoSync().screenWidth / (750 / 100))}px;`,
			form: {
				title: '', // 	标题 必传
				// sort_id: '', // 类别id 必传
				describe: '', // 	描述 必传
				sort_image: '', // 商品图片 必传
				type: 1, // 1我丢失的2我捡到的 必传
				phone: '' // 	电话号码 必传
			},
			isEdit: false,
			scrollTopPX: '' //滚动的位置
		};
	},
	computed: {
		...mapGetters(['schoolinfo']),
		disabled() {
			let val = false;
			for (let key in this.form) {
				if (key !== 'sort_image' && !this.form[key]) {
					val = true;
				}
			}
			return val;
		}
	},
	onLoad(option) {
		if (option.edit) {
			this.isEdit = true;
			let editForm = JSON.parse(option.edit);
			this.form.title = editForm.title;
			// this.form.sort_id = editForm.sort_id;
			this.selectedCategory = editForm.sort_name;
			this.form.describe = editForm.describe;
			this.form.sort_image = editForm.sort_image.join();
			this.imgsIds = editForm.sort_image;
			this.imgList = editForm.sort_images;
			this.form.type = editForm.fage == 3 ? 1 : 2; // fage 3是我丢失的4是我捡到的
			this.form.phone = editForm.phone;
			this.form.id = editForm.id;
		}
		// this.getCategoryList();
	},
	//监听滚动条滚动的距离
	onPageScroll(res) {
		this.scrollTopPX = res.scrollTop;
	},
	methods: {
		inputBlur() {
			uni.pageScrollTo({
				scrollTop: this.scrollTopPX,
				duration: 0
			});
		},
		clickLeft() {
			uni.navigateBack();
		},
		// 选择类型 1我丢失的2我捡到的
		selectedType(val) {
			val != this.form.type && (this.form.type = val);
		},
		// 分类列表
		// getCategoryList() {
		// 	this.$http.post('/api/school/sort').then(res => {
		// 		this.categoryList = res.data;
		// 	});
		// },
		// // picker change
		// bindChange(e) {
		// 	const val = e.detail.value;
		// 	this.categoryValue = val;
		// },
		// confirmPickerPopup() {
		// 	this.visible = false;
		// 	this.selectedCategory = this.categoryList[this.categoryValue[0]].brand_name;
		// 	this.form.sort_id = this.categoryList[this.categoryValue[0]].id;
		// 	this.$refs.categoryPickerPopup.close();
		// },
		// cancelPickerPopup() {
		// 	this.visible = false;
		// 	this.$refs.categoryPickerPopup.close();
		// },
		// 暂时隐藏
		// toSelectCategory() {
		// 	this.$refs.categoryPickerPopup.open();
		// 	this.visible = true;
		// },
		// 手机号输入
		phoneInput(e) {
			let val = e.target.value;
			val = val.replace(/[^\d]/g, ''); //清除"数字以外的字符
			this.form.phone = val;
		},

		// 图片上传
		ChooseImage() {
			uni.chooseImage({
				count: 9, //默认9
				sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['camera', 'album'], //从相册选择
				success: res => {
					let files = res.tempFilePaths;
					uni.showLoading({
						title: '上传中....',
						mask: true
					});
					uni.uploadFile({
						// url: this.$domain + '/api/login/upload_image',
						url: this.$domain + '/api/login/upload',
						filePath: files[0],
						name: 'file',
						header: { token: this.$store.getters.token },
						success: res => {
							uni.hideLoading();
							if (res.statusCode == 200) {
								let data = JSON.parse(res.data);
								if (data.code == 0) {
									if (this.imgList.length != 0) {
										this.imgList = this.imgList.concat(files);
									} else {
										this.imgList = files;
									}
									this.imgsIds.push(data.water_image_id);
									this.form.sort_image = this.imgsIds.join();
								}
							}
						}
					});
				}
			});
		},
		ViewImage(e) {
			uni.previewImage({
				urls: this.imgList,
				current: e.currentTarget.dataset.url
			});
		},
		DelImg(e) {
			uni.showModal({
				title: '删除图片',
				content: '确定要删除这段回忆吗？',
				cancelText: '再看看',
				confirmText: '确定',
				success: res => {
					if (res.confirm) {
						this.imgList.splice(e.currentTarget.dataset.index, 1);
						this.imgsIds.splice(e.currentTarget.dataset.index, 1);
						this.form.sort_image = this.imgsIds.join();
					}
				}
			});
		},
		// 提交发布
		submitIssue() {
			let params;
			params = JSON.parse(JSON.stringify(this.form));
			params.school_id = this.schoolinfo.id;
			if (!this.isEdit) {
				this.$http.post('/api/school/lose', params).then(res => {
					if (res.code == 0) {
						this.$refs.issuePopup.open();
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			} else {
				this.$http.post('/api/personal/edit_lose', params).then(res => {
					if (res.code == 0) {
						this.$refs.issuePopup.open();
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			}
		},
		// 返回首页
		backHome() {
			uni.switchTab({
				url: '/pages/tabbar/home'
			});
		},
		// 查看详情
		toView() {
			uni.redirectTo({
				url: `/pages/my/my-lost`
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background: #f2f2f2;
}
.lost-property-issue {
	/deep/.uni-navbar--border {
		border-color: transparent;
	}
	.container {
		.lost-property-banner {
			width: 100%;
			height: 200upx;
		}
		.card {
			box-shadow: 0px 0px 10px 0px rgba(152, 152, 152, 0.1);
			border-radius: 20upx;
			margin-top: 20upx;
			background: #ffffff;
			.card-item {
				height: 88upx;
				font-size: 32upx;
				.input {
					flex: 1;
					text-align: right;
					padding-left: 10upx;
					padding-right: 10upx;
				}
				.cuIcon-right {
					font-size: 35upx;
				}
			}
			.textarea {
				width: 100%;
				height: 230upx;
				padding-top: 30upx;
				padding-bottom: 30upx;
			}
			.upload-wrap {
				display: flex;
				flex-wrap: wrap;
				.del-icon-wrap {
					position: absolute;
					right: 0upx;
					top: 0upx;
					width: 40upx;
					height: 40upx;
				}
				.bg-img {
					position: relative;
					padding-bottom: calc(100% / 3);
					height: 0;
					width: calc(100% / 3);
					margin-bottom: 20upx;
					.img-wrap {
						width: 100%;
						height: 100%;
						padding: 15upx;
						overflow: hidden;
						position: absolute;
						top: 50%;
						left: 50%;
						transform: translate(-50%, -50%);
						.img {
							width: 100%;
							height: 100%;
							border-radius: 20upx;
						}
					}
				}
			}
		}
		.cuIcon-right {
			font-size: 35upx;
		}
		.radio-select,
		.radio-selected {
			width: 36upx;
			height: 36upx;
		}
		.issue-btn {
			box-shadow: 0px 2px 10px 0px rgba(38, 212, 153, 0.5);
		}
	}
	// 分类picker弹窗
	.picker-container {
		background: #ffffff;
		border-radius: 20upx 20upx 0px 0px;
		.picker-header {
			padding: 30upx;
			border-bottom: 2upx solid #ebebeb;
			font-size: 30upx;
		}
		picker-view {
			width: 100%;
			height: 600upx;
			margin-top: 20upx;
		}
		.item {
			line-height: 100upx;
			text-align: center;
			&.active {
				color: #26d499;
				font-weight: bold;
			}
		}
	}
	// 发布成功弹窗
	.issuePopup {
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
