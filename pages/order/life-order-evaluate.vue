<template>
	<view class="life-order-evaluate">
		<cu-custom isBack bgColor="bg-white text-black"><block slot="content">立即评价</block></cu-custom>
		<view class="container  padding-lr">
			<view class="item"><textarea @blur="inputBlur" class="textarea" v-model="form.content" placeholder="请描述对商品的评价~" /></view>
			<view class="item flex align-center padding-sm text-df">
				<view class="margin-right">商家服务</view>
				<rate :current="form.star" :size="20" active="#FFD200" @change="rateChange"></rate>
			</view>
			<view class="item item flex align-center padding-sm text-df">
				<!-- <view class="margin-right">上传图片</view> -->
				<view class="upload">
					<u-upload width="180" :action="action" max-count="6" :header="headers"
					 @on-success="uploadSuccess"  @on-remove="removeImg" :file-list="fileList"></u-upload>
				</view>
			</view>
			<view class=""><button @click="submitIssue" class="cu-btn bg-green lg block round issue" :disabled="!disabled" type="">发布</button></view>
		</view>
		<!-- 发布成功弹窗 -->
		<uni-popup ref="issuePopup" class="issuePopup">
			<view class="popup-container padding-top-xs">
				<view class="flex flex-direction align-center padding-tb solids-bottom">
					<image src="../../static/success-icon.png" class="success-icon" mode=""></image>
					<text class="padding-tb">评价成功</text>
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
import rate from '@/components/rate/rate.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';
export default {
	components: { rate, uniPopup },
	data() {
		return {
			id: '',
			store_id: '', // 店铺id
			form: {
				star: 0,
				content: ''
			},
			scrollTopPX: '' ,//滚动的位置
			action: this.$domain + '/api/login/upload_image',
			fileList: [],
			headers:{},
			images:[]
		};
	},
	computed: {
		disabled() {
			return this.form.star;
		}
	},
	onLoad(option) {
		this.headers.token = this.token
		this.id = option.id;
		this.store_id = option.store_id;
	},
	onPageScroll(res) {
		this.scrollTopPX = res.scrollTop;
	},
	methods: {
		uploadSuccess(data, index, lists, name){
			if(data.code == 0){
				this.images.push(data.id)
			}
		},
		removeImg(index,lists,name){
			this.images.splice(index,1)
		},
		inputBlur() {
			uni.pageScrollTo({
				scrollTop: this.scrollTopPX,
				duration: 0
			});
		},
		rateChange(e) {
			this.form.star = e.index;
		},
		submitIssue() {
			this.form.order_id = this.id;
			if(this.images.length > 0){
				this.form.images = this.images.join(',')
			}
			this.$http.post('/api/life/order_life_praise', this.form).then(res => {
				if (res.code == 0) {
					this.$refs.issuePopup.open();
				}
			});
		},
		// 返回首页
		backHome() {
			uni.redirectTo({
				url: '/pages/tabbar/home'
			});
		},
		// 查看详情
		toView() {
			uni.redirectTo({
				url: `/pages/home/life-details?id=${this.store_id}`
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background: #f2f2f2;
}
.life-order-evaluate {
	.item {
		margin-top: 20upx;
		box-shadow: 0px 0px 10upx 0px rgba(152, 152, 152, 0.1);
		border-radius: 12upx;
		background: #ffffff;
		.textarea {
			width: 100%;
			height: 260upx;
			padding: 30upx;
		}
	}
	.issue {
		height: 88upx;
		margin: 120upx 45upx;
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
