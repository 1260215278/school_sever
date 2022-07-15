<template>
	<view class="dynamic-issue">
		<cu-custom isBack bgColor="bg-white text-black"><block slot="content">发布动态</block></cu-custom>
		<view class="container">
			<view class="card padding-lr">
				<textarea @blur="inputBlur" v-model="content" class="textarea" value="" placeholder="请描述动态内容~" />
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
			<view class="padding margin-xl"><button @click="submitIssue" :disabled="disabled" type="" class="cu-btn bg-green lg round issue-btn block">发布</button></view>
		</view>
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
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import common from '@/utils/mixins/common.js';
import { mapGetters } from 'vuex';

export default {
	components: { uniPopup },
	mixins: [common],
	data() {
		return {
			imgList: [],
			imgIds: [],
			content: '',
			scrollTopPX: '' //滚动的位置
		};
	},
	computed: {
		...mapGetters(['schoolinfo']),
		disabled() {
			return !this.imgIds.length && !this.content.trim();
		}
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
									this.imgIds.push(data.water_image_id);
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
				content: '确定要删除这个图片吗？',
				cancelText: '再看看',
				confirmText: '确定',
				success: res => {
					if (res.confirm) {
						this.imgList.splice(e.currentTarget.dataset.index, 1);
						this.imgIds.splice(e.currentTarget.dataset.index, 1);
					}
				}
			});
		},
		submitIssue() {
			uni.showLoading({ title: '请稍候...', mask: true });
			this.$http.post('/api/school/dynamic', { school_id: this.schoolinfo.id, details: this.content, image: this.imgIds.join() }).then(res => {
				uni.hideLoading();
				if (res.code == 0) {
					this.$refs.issuePopup.open();
				}
			});
		},
		// 返回首页
		backHome() {
			uni.switchTab({
				url: '/pages/tabbar/dynamic'
			});
		},
		// 查看详情
		toView() {
			uni.redirectTo({
				url: '/pages/my/my-dynamic'
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background: #f5f5f5;
}
.dynamic-issue {
	.card {
		box-shadow: 0px 0px 10px 0px rgba(152, 152, 152, 0.1);
		border-radius: 20upx;
		margin: 20upx 30upx 0 30upx;
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
	.issue-btn {
		box-shadow: 0px 2px 10px 0px rgba(38, 212, 153, 0.5);
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
