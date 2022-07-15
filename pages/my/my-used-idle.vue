<template>
	<view class="my-used-idle">
		<cu-custom isBack bgColor="bg-white text-black"><block slot="content">二手闲置</block></cu-custom>
		<view class="container">
			<view class="list padding-lr">
				<view @click="toDetails(item.id)" v-for="(item, index) in list" :key="index" class="list-item margin-top-sm padding-lr-sm">
					<view class="flex solid-bottom padding-tb-sm">
						<view class="img-wrap">
							<image v-if="item.sort_images.length" :src="item.sort_images[0]" class="img" mode="aspectFill"></image>
							<image v-else src="../../static/no_img.png" class="img" mode=""></image>
							<image v-if="item.fage == 1" src="../../static/idle-mark-icon.png" class="idle-mark-icon" mode=""></image>
							<image v-if="item.sort_images.length && item.fage == 2" src="../../static/demand-mark-icon.png" class="demand-mark-icon" mode=""></image>
						</view>
						<view class="flex-sub overflow flex flex-direction justify-between">
							<view class="text-lg text-bold text-cut">{{ item.title }}</view>
							<view class="text-666 text-cut">{{ item.describe }}</view>
							<view class="text-xl text-red text-bold">¥{{ item.price }}</view>
						</view>
					</view>
					<view class="flex justify-end align-center padding-tb-sm actions-state">
						<button v-if="item.type != 1" @click.stop="openPopup(2, item.id)" class="cu-btn line-gray sm margin-left-sm">上架</button>
						<button v-if="item.type != 2" @click.stop="openPopup(1, item.id)" class="cu-btn line-gray sm margin-left-sm">下架</button>
						<button @click.stop="openPopup(3, item.id)" class="cu-btn line-gray sm margin-left-sm">删除</button>
						<button @click.stop="toEdit(item)" class="cu-btn line-gray sm margin-left-sm">编缉</button>
						<view v-if="item.type == 2" class="state">已下架</view>
					</view>
				</view>
			</view>
			<tui-tips v-if="nodata" fixed imgUrl="../../static/img_nodata.png">暂无数据</tui-tips>
		</view>
		<!-- popup 弹窗 -->
		<uni-popup ref="popup" class="popup">
			<view class="popup-container">
				<view class="flex justify-center align-center popup-content">{{ popupContent.content }}</view>
				<view class="grid col-2 text-lg padding-tb-sm">
					<view @click="cancelPopup" class="flex align-center justify-center cancel">取消</view>
					<view @click="confirmPopup" class="flex align-center justify-center text-green">确定</view>
				</view>
			</view>
		</uni-popup>

		<login-modal></login-modal>
	</view>
</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import common from '@/utils/mixins/common.js';
import tuiTips from '@/components/tips/tips.vue';

export default {
	components: { uniPopup, tuiTips },
	mixins: [common],
	data() {
		return {
			list: [],
			page: 1,
			lastPage: 1,
			nodata: false,
			popupContent: { type: '', content: '' },
			selectedId: ''
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
			this.$http.post('/api/personal/demand_list', { page: this.page }).then(res => {
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
		openPopup(val, id) {
			// 1 下架 2 上架 3 删除
			if (val === 1) {
				this.popupContent.content = '下架此闲置?';
			} else if (val === 2) {
				this.popupContent.content = '上架此闲置?';
			} else {
				this.popupContent.content = '删除此闲置?';
			}
			this.popupContent.type = val;
			this.selectedId = id;
			this.$refs.popup.open();
		},
		cancelPopup() {
			this.$refs.popup.close();
		},
		confirmPopup() {
			if (this.popupContent.type == 3) {
				// 删除
				this.$http.post('/api/personal/delete_lose', { id: this.selectedId }).then(res => {
					if (res.code == 0) {
						this.$refs.popup.close();
						this.page = 1;
						this.getList();
					}
				});
			} else {
				let type;
				if (this.popupContent.type == 1) {
					type = 2;
				} else {
					type = 1;
				}
				// type 1是上架2是下架
				this.$http.post('/api/driving/edit_type', { id: this.selectedId, type: type }).then(res => {
					if (res.code == 0) {
						this.list.forEach(em => {
							if (em.id == this.selectedId) {
								em.type = em.type == 1 ? 2 : 1;
							}
						});
						this.$refs.popup.close();
					}
				});
			}
		},
		toDetails(id) {
			// type 1 是二手闲置评论 2 是失物招领评论 3 是动态评论 (跳转页面评论列表需要判断此参数)
			uni.navigateTo({
				url: `/pages/composite/used-idle-details?from=my&id=${id}&type=1`
			});
		},
		// 去编缉
		toEdit(item) {
			//fage 1是发布2是需求3是失物招领（我丢失的）4是我捡到的
			uni.navigateTo({
				url: `/pages/composite/used-idle-issue?id=${item.id}&tab=${item.fage - 1}`
			});
		}
	}
};
</script>

<style lang="scss">
.my-used-idle {
	.container {
		.list {
			.list-item {
				box-shadow: 0px 0px 10px 0px rgba(152, 152, 152, 0.2);
				border-radius: 20upx;
				.img-wrap {
					position: relative;
					border-radius: 20upx;
					overflow: hidden;
					margin-right: 20upx;
				}
				.img {
					width: 150upx;
					height: 150upx;
				}
				.idle-mark-icon,
				.demand-mark-icon {
					width: 90upx;
					height: 88upx;
					position: absolute;
					top: 0;
					left: 0;
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
						color: #26d499;
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
