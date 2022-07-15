<template>
	<view class="used-idle-issue">
		<uni-nav-bar title="二手闲置" leftIcon="back" @clickLeft="clickLeft" fixed :statusBar="true"></uni-nav-bar>
		<view class="container">
			<view class="grid col-2 text-lg tab-wrap">
				<view @click="changeTab(0)" :class="['tab-item', currentTab === 0 ? 'text-green active' : 'text-999']">我的闲置</view>
				<view @click="changeTab(1)" :class="['tab-item', currentTab === 1 ? 'text-green active' : 'text-999']">我的需求</view>
			</view>
			<view v-if="currentTab === 0" class="idle-wrap">
				<view class=""><image src="../../static/sale-idle.png" class="sale-idle" mode="aspectFill"></image></view>
				<view class="card padding-lr padding-top-xs">
					<view class="card-item solid-bottom flex align-center">
						<view class="text-999">标题：</view>
						<input v-model="idleForm.title" class="input" type="text" placeholder="请输入标题" />
					</view>
					<view class="card-item solid-bottom flex align-center">
						<view class="text-999">手机号：</view>
						<input v-model="idleForm.phone" @input="phoneInput" :maxlength="11" class="input" type="number" placeholder="请输入手机号" />
					</view>
					<view @click="toSelectCategory" class="card-item solid-bottom flex align-center">
						<view class="text-999">分类：</view>
						<view class="flex-sub flex align-center">
							<input v-model="selectedCategory" class="input" disabled type="text" placeholder="请选择分类" />
							<text class="cuIcon-right text-999"></text>
						</view>
					</view>
					<view @click="toSelectMorePopup" class="card-item flex align-center">
						<view class="text-999">更多信息：</view>
						<view class="flex-sub flex align-center">
							<input v-model="idleForm.message" class="input" type="text" disabled placeholder="请选择" />
							<text class="cuIcon-right text-999"></text>
						</view>
					</view>
				</view>
				<view class="card padding-lr padding-top-xs">
					<view class="card-item solid-bottom flex align-center">
						<view class="text-999">价格：</view>
						<input v-model="idleForm.price" @input="onInput($event, 0)" class="input" type="number" placeholder="¥0.00" :maxlength="moneyMaxLeng" />
					</view>
					<view class="card-item solid-bottom flex align-center">
						<view class="text-999">入手价：</view>
						<view class="flex-sub flex align-center"><input v-model="idleForm.start_price" @input="onInput($event, 1)" class="input" type="number" placeholder="¥0.00" /></view>
					</view>
					<view class="card-item flex align-center">
						<view class="text-999">运费：</view>
						<view class="flex-sub flex align-center"><input v-model="idleForm.carriage" @input="onInput($event, 2)" class="input" type="number" placeholder="¥0.00" /></view>
					</view>
				</view>
				<view class="card padding-lr">
					<textarea @blur="inputBlur" v-model="idleForm.describe" class="textarea" placeholder="请描述商品内容~" />
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
			<view v-if="currentTab === 1" class="demand-wrap">
				<view class=""><image src="../../static/demand-banner.jpg" class="demand-banner" mode="aspectFill"></image></view>
				<view class="card padding-lr padding-top-xs">
					<view class="card-item solid-bottom flex align-center">
						<view class="text-999">标题：</view>
						<input v-model="demendForm.title" class="input" type="text" placeholder="请输入标题" />
					</view>
					<view class="card-item solid-bottom flex align-center">
						<view class="text-999">手机号：</view>
						<input v-model="demendForm.phone" @input="phoneInput" class="input" :maxlength="11" type="number" placeholder="请输入手机号" />
					</view>
					<view @click="toSelectCategory" class="card-item solid-bottom flex align-center">
						<view class="text-999">分类：</view>
						<view class="flex-sub flex align-center">
							<input v-model="selectedCategory" disabled class="input" type="text" placeholder="请选择分类" />
							<text class="cuIcon-right text-999"></text>
						</view>
					</view>
				</view>
				<view class="card padding-lr padding-top-xs">
					<view class="card-item solid-bottom flex align-center">
						<view class="text-999">期望价格：</view>
						<input v-model="demendForm.price" class="input" @input="onInput($event, 0)" type="number" placeholder="¥0.00" />
					</view>
				</view>
				<view class="card padding-lr">
					<textarea @blur="inputBlur" v-model="demendForm.describe" class="textarea" placeholder="请对您的需求进行描述~" />
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
		</view>
		<!-- 选择分类弹窗 -->
		<uni-popup ref="categoryPickerPopup" type="bottom">
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
		</uni-popup>
		<!-- 更多信息弹窗 -->
		<uni-popup ref="morePopup" type="bottom">
			<view class="popup-container">
				<view class="popup-header flex justify-between align-center">
					<view @click="cancelMorePopup" class="text-999">取消</view>
					<view class="picker-title">更多信息（可多选）</view>
					<view @click="confirmMorePopup" class="text-green">完成</view>
				</view>
				<view class="popup-content">
					<view class="flex flex-wrap">
						<button
							@click="toSelectedMoreTags(item)"
							v-for="(item, index) in moreTagsList"
							:key="index"
							class="cu-btn round margin-right-sm margin-bottom"
							:class="item.selected ? 'bg-green text-white' : 'bg-ebebeb'"
						>
							{{ item.label }}
						</button>
					</view>
				</view>
			</view>
		</uni-popup>
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
	</view>
</template>

<script>
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import { mapGetters } from 'vuex';

export default {
	components: { uniNavBar, uniPopup },
	data() {
		return {
			id: '', // 编缉id
			currentTab: 0, // 0-我的闲置 1-我的需求
			imgList: [], // 上传图片数组
			imgsIds: [], // 上传图片ids
			visible: false, // picker view 显示隐藏
			categoryList: [], // 分类picker 数据
			categoryValue: [0],
			selectedCategory: '',
			indicatorStyle: `height: ${Math.round(uni.getSystemInfoSync().screenWidth / (750 / 100))}px;`,
			moreTagsList: [{ label: '全新', selected: false }, { label: '不讲价', selected: false }, { label: '仅自提', selected: false }], // 更多信息列表
			moneyMaxLeng: 8, //规定最大可输入的长度
			idleForm: {
				title: '', // 标题 必传
				phone: '', // 手机号 必传
				sort_id: '', // 类别id 必传
				message: '', // 更多信息 必传
				price: '', // 价格 必传
				start_price: '', // 入手价 必传
				carriage: '', // 运费
				describe: '', // 描述 必传
				sort_image: '' // 商品图 必传
			},
			demendForm: {
				title: '', // 标题 必传
				phone: '', // 手机号 必传
				sort_id: '', // 类别id 必传
				price: '', // 期望价格 必传
				describe: '', // 描述 必传
				sort_image: '' // 商品图
			},
			successId: '', // 新发布成后ic
			scrollTopPX: '' //滚动的位置
		};
	},
	computed: {
		...mapGetters(['schoolinfo']),
		disabled() {
			let val = false;
			if (this.currentTab === 0) {
				for (let key in this.idleForm) {
					if (key !== 'carriage' && !this.idleForm[key]) {
						val = true;
					}
				}
				return val;
			} else {
				for (let key in this.demendForm) {
					if (key !== 'sort_image' && !this.demendForm[key]) {
						val = true;
					}
				}
				return val;
			}
		}
	},
	onLoad(option) {
		if (option.id) {
			this.id = option.id;
			this.currentTab = Number(option.tab);
			// 获取编缉数据
			this.getEditData();
		}
		this.getCategoryList();
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
		// 获取编缉详情
		getEditData() {
			this.$http.post('/api/school/demand_details', { did: this.id }).then(res => {
				if (res.code == 0) {
					if (this.currentTab == 0) {
						for (let key in this.idleForm) {
							this.idleForm[key] = res.data[key];
						}
						this.idleForm.sort_image = this.idleForm.sort_image.join();
						this.imgList = res.data.sort_images;
						this.imgsIds = res.data.sort_image;
						this.selectedCategory = res.data.sort_name;
						let arr = res.data.message.split(',');
						this.moreTagsList.forEach((em, index) => {
							if (em.label == arr[index]) {
								em.selected = true;
							}
						});
					} else {
						for (let key in this.demendForm) {
							this.demendForm[key] = res.data[key];
						}
						if (!res.data.sort_image) {
							this.demendForm.sort_image = res.data.sort_image;
						} else {
							this.demendForm.sort_image = res.data.sort_image.join();
						}
						this.imgList = res.data.sort_images;
						this.imgsIds = res.data.sort_image;
						this.selectedCategory = res.data.sort_name;
					}
				}
			});
		},
		clickLeft() {
			uni.navigateBack();
		},
		changeTab(val) {
			this.currentTab !== val && (this.currentTab = val);
			if (this.currentTab === 0) {
				for (let key in this.demendForm) {
					this.demendForm[key] = '';
				}
			} else {
				for (let key in this.idleForm) {
					this.idleForm[key] = '';
				}
			}
			this.selectedCategory = '';
			this.imgList = [];
			this.imgsIds = [];
		},
		// input number类型输入
		onInput(e, type) {
			let val = e.target.value;
			val = val.replace(/[^\d.]/g, ''); //清除"数字"和"."以外的字符
			val = val.replace(/\.{2,}/g, '.'); //只保留第一个. 清除多余的
			val = val.match(/^\d*(\.?\d{0,2})/g)[0] || '';
			if (val.includes('.')) {
				let numDian = val.toString().split('.')[1].length;
				if (numDian === 2) {
					//小数点是2位数时输入框内容限制输入长度
					this.moneyMaxLeng = val.length;
				}
			} else {
				this.moneyMaxLeng = 8;
			}
			//前两位不能是0加数字
			if (val.indexOf('.') < 0 && val != '') {
				val = parseFloat(val);
			}
			// 0 价格 1 入手价 2 运费
			if (type === 0) {
				this.currentTab === 0 && (this.idleForm.price = val);
				this.currentTab === 1 && (this.demendForm.price = val);
			} else if (type === 1) {
				this.idleForm.start_price = val;
			} else {
				this.idleForm.carriage = val;
			}
		},
		// 手机号输入
		phoneInput(e) {
			let val = e.target.value;
			val = val.replace(/[^\d]/g, ''); //清除"数字以外的字符
			if (this.currentTab === 0) {
				this.idleForm.phone = val;
			} else {
				this.demendForm.phone = val;
			}
		},
		// 分类列表
		getCategoryList() {
			this.$http.post('/api/school/sort').then(res => {
				this.categoryList = res.data;
			});
		},
		// picker change
		bindChange(e) {
			const val = e.detail.value;
			this.categoryValue = val;
		},
		confirmPickerPopup() {
			this.visible = false;
			this.selectedCategory = this.categoryList[this.categoryValue[0]].brand_name;
			this.currentTab === 0 && (this.idleForm.sort_id = this.categoryList[this.categoryValue[0]].id);
			this.currentTab === 1 && (this.demendForm.sort_id = this.categoryList[this.categoryValue[0]].id);
			this.$refs.categoryPickerPopup.close();
		},
		cancelPickerPopup() {
			this.visible = false;
			this.$refs.categoryPickerPopup.close();
		},
		toSelectCategory() {
			this.$refs.categoryPickerPopup.open();
			this.visible = true;
		},

		// 选择更多信息弹窗
		toSelectMorePopup() {
			this.$refs.morePopup.open();
		},
		cancelMorePopup() {
			this.$refs.morePopup.close();
		},
		confirmMorePopup() {
			let val = [];
			this.moreTagsList.forEach(em => {
				if (em.selected) {
					val.push(em.label);
				}
			});
			this.idleForm.message = val.join();
			this.$refs.morePopup.close();
		},
		toSelectedMoreTags(item) {
			item.selected = !item.selected;
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
									this.currentTab === 0 && (this.idleForm.sort_image = this.imgsIds.join());
									this.currentTab === 1 && (this.demendForm.sort_image = this.imgsIds.join());
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
						this.imgsIds.splice(e.currentTarget.dataset.index, 1);
						this.currentTab === 0 && (this.idleForm.sort_image = this.imgsIds.join());
						this.currentTab === 1 && (this.demendForm.sort_image = this.imgsIds.join());
					}
				}
			});
		},

		// 提交发布
		submitIssue() {
			let params;
			if (this.currentTab === 0) {
				params = JSON.parse(JSON.stringify(this.idleForm));
			} else {
				params = JSON.parse(JSON.stringify(this.demendForm));
			}

			params.school_id = this.schoolinfo.id;
			params.type = this.currentTab + 1;
			if (this.id) {
				params.id = this.id;
				this.$http.post('/api/personal/announces', params).then(res => {
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
				this.$http.post('api/school/announce', params).then(res => {
					if (res.code == 0) {
						this.$refs.issuePopup.open();
						this.successId = res.data;
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
			if (this.id) {
				uni.redirectTo({
					url: `/pages/composite/used-idle-details?id=${this.id}&type=1&from=my`
				});
			} else {
				uni.redirectTo({
					url: `/pages/composite/used-idle-details?id=${this.successId}&type=1&from=my`
				});
			}
		}
	}
};
</script>

<style lang="scss">
page {
	background: #f2f2f2;
}
.used-idle-issue {
	/deep/.uni-navbar--border {
		border-color: transparent;
	}
	/deep/.uni-navbar--fixed {
		z-index: 9;
	}
	.tab-wrap {
		height: 80upx;
		background: #ffffff;
		.tab-item {
			position: relative;
			display: flex;
			justify-content: center;
			align-items: center;
			transition: all 0.2s;
			&:after {
				content: '';
				position: absolute;
				left: 50%;
				transform: translateX(-50%);
				bottom: 0;
				width: 36upx;
				height: 4upx;
				background: transparent;
				border-radius: 2upx;
			}
			&.active {
				&:after {
					background: rgba(38, 212, 153, 1);
				}
			}
		}
	}
	.sale-idle,
	.demand-banner {
		width: 100%;
		height: 200upx;
	}
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
		// border-radius:44upx;
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
	// 更多信息弹窗
	.popup-container {
		border-radius: 20upx 20upx 0px 0px;
		background: #ffffff;
		.popup-header {
			padding: 30upx;
			border-bottom: 2upx solid #ebebeb;
			font-size: 30upx;
		}
		.popup-content {
			padding: 30upx 30upx 60upx 30upx;
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
