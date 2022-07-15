<style></style>
<template>
	<view class="my-lost">
		<cu-custom isBack bgColor="bg-white text-black"><block slot="content">失物招领</block></cu-custom>
		<view class="container">
			<view class="list padding-lr">
				<view @click="toDetails(item.id)" v-for="(item, index) in list" :key="index" class="list-item margin-top-sm padding-lr-sm">
					<view class="flex solid-bottom padding-tb-sm">
						<image v-if="item.sort_images.length" :src="item.sort_images[0]" class="img" mode="aspectFill"></image>
						<image v-else src="../../static/no_img.png" class="img" mode="aspectFill"></image>
						<view class="flex-sub overflow flex flex-direction justify-center">
							<view class="text-lg text-bold text-cut">{{ item.title }}</view>
							<view class="text-666 text-cut padding-top-xs">{{ item.describe }}</view>
						</view>
					</view>
					<view class="flex justify-end align-center padding-tb-sm actions-state">
						<button @click.stop="openPopup(item.id)" class="cu-btn line-gray sm margin-left-sm">删除</button>
						<button @click.stop="toEdit(item)" class="cu-btn line-gray sm margin-left-sm">编缉</button>
						<view class="state" :class="item.fage == 3 ? 'text-green' : 'text-red'">{{ item.fage == 3 ? '我的丢失的' : '我捡到的' }}</view>
					</view>
				</view>
			</view>
		</view>
		<!-- popup 弹窗 -->
		<uni-popup ref="popup" class="popup">
			<view class="popup-container">
				<view class="flex justify-center align-center popup-content">{{ popupContent }}</view>
				<view class="grid col-2 text-lg padding-tb-sm">
					<view @click="cancelPopup" class="flex align-center justify-center cancel">取消</view>
					<view @click="confirmPopup" class="flex align-center justify-center text-green">确定</view>
				</view>
			</view>
		</uni-popup>

		<tui-tips v-if="nodata" fixed imgUrl="../../static/img_nodata.png">暂无数据</tui-tips>
		<login-modal></login-modal>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import tuiTips from '@/components/tips/tips.vue';
import common from '@/utils/mixins/common.js';

export default {
	components: { uniPopup, tuiTips },
	mixins: [common],
	data() {
		return {
			list: [],
			popupContent: '删除此发布?',
			delId: '', // 删除发布id
			page: 1,
			lastPage: 1,
			nodata: false
		};
	},
	onLoad() {
		this.getList();
	},
	onReachBottom() {
		if (this.page < this.lastPage) {
			this.page++;
			this.getList();
		}
	},
	methods: {
		getList() {
			this.$http.post('/api/personal/lose_list', { page: this.page }).then(res => {
				if (res.code == 0) {
					this.lastPage = res.data.last_page;
					this.nodata = !res.data.data.length;
					if (this.page > 1) {
						this.list.push(...res.data.data);
					} else {
						this.list = res.data.data;
					}
				}
			});
		},
		openPopup(id) {
			this.delId = id;
			this.$refs.popup.open();
		},
		cancelPopup() {
			this.$refs.popup.close();
		},
		confirmPopup() {
			this.$http.post('/api/personal/delete_lose', { id: this.delId }).then(res => {
				if (res.code == 0) {
					this.page = 1;
					this.getList();
					this.$refs.popup.close();
				}
			});
		},
		toDetails(id) {
			// type 1 是二手闲置评论 2 是失物招领评论 3 是动态评论 (跳转页面评论列表需要判断此参数)
			uni.navigateTo({
				url: `/pages/composite/used-idle-details?from=my&id=${id}&type=2`
			});
		},
		toEdit(item) {
			uni.navigateTo({
				url: `/pages/composite/lost-property-issue?edit=${JSON.stringify(item)}`
			});
		}
	}
};
</script>

<style lang="scss">
/deep/.cu-custom .cu-bar {
	z-index: 99;
}
.my-lost {
	.container {
		.list {
			.list-item {
				box-shadow: 0px 0px 10px 0px rgba(152, 152, 152, 0.2);
				border-radius: 20upx;
				.img {
					width: 120upx;
					height: 120upx;
					margin-right: 20upx;
					border-radius: 20upx;
					overflow: hidden;
				}
				.cu-btn.sm {
					font-size: 24upx;
					font-weight: 500;
				}
				.actions-state {
					position: relative;
					.state {
						position: absolute;
						top: 50%;
						left: 0;
						transform: translateY(-50%);
						font-size: 26upx;
					}
				}
			}
		}
	}
	// popup 弹窗
	.popup {
		.popup-container {
			width: 500upx;
			background: rgba(255, 255, 255, 1);
			border-radius: 20upx;
			.popup-content {
				padding: 60upx 30upx;
				font-size: 36upx;
				border-bottom: 2upx solid #ebebeb;
			}
			.cancel {
				position: relative;
				color: #999;
				&:after {
					content: '';
					width: 2upx;
					height: 40upx;
					background: rgba(235, 235, 235, 1);
					border-radius: 1upx;
					position: absolute;
					top: 50%;
					right: 0;
					transform: translateY(-50%);
				}
			}
		}
	}
}
</style>
