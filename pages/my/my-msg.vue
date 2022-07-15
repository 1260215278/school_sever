<template>
	<view class="my-msg">
		<cu-custom isBack bgColor="bg-white text-black"><block slot="content">消息</block></cu-custom>
		<view class="container">
			<view @longpress="delMsg(item.id)" @click="toDetails(item, index)" v-for="(item, index) in list" :key="index" class="card margin-lr margin-top-sm bg-white padding flex">
				<text v-if="item.read == 0" class="cuIcon-title text-red"></text>
				<image :src="item.avatar" class="avatar" mode="aspectFill"></image>
				<view class="flex-sub flex flex-direction overflow">
					<view class="flex">
						<view class="text-cut text-green text-df self-baseline">{{ item.user_name }}</view>
						<view class="padding-lr text-999 text-xs self-baseline">{{ dateFormat(item.addtime) }}</view>
					</view>
					<view class="padding-top-xs">
						<block v-if="item.type != 0">
							回复
							<text class="text-green">我：</text>
							{{ item.title }}
						</block>
						<block v-if="item.type == 0">{{ item.title }}</block>
					</view>
				</view>
			</view>
			<uni-load-more v-if="list.length" :status="loadingStatus"></uni-load-more>
			<tui-tips v-if="nodata" fixed imgUrl="../../static/img_nodata.png">暂无数据</tui-tips>
		</view>

		<!-- 删除弹窗 -->
		<uni-popup ref="delPopup" class="delPopup">
			<view class="popup-container padding-top-xs">
				<view class="flex flex-direction align-center padding-tb solids-bottom"><text class="padding-tb text-xl text-bold">删除此消息？</text></view>
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
import common from '@/utils/mixins/common.js';
import tuiTips from '@/components/tips/tips.vue';
import { dateUtils } from '@/utils/util.js';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';

export default {
	mixins: [common],
	components: { tuiTips, uniLoadMore, uniPopup },
	data() {
		return {
			list: [],
			page: 1,
			lastPage: 1,
			nodata: false,
			loadingStatus: 'more',
			delMsgId: '' // 删除消息 id
		};
	},
	onLoad() {
		this.getList();
	},
	onReachBottom() {
		this.loadingStatus = 'loading';
		if (this.page < this.lastPage) {
			this.page++;
			this.getList();
		} else {
			this.loadingStatus = 'noMore';
		}
	},
	methods: {
		dateFormat(val) {
			if (val) {
				return dateUtils.humanize(val * 1000);
			} else {
				return '';
			}
		},
		getList() {
			this.$http.post('/api/personal/message_lsit', { page: this.page }).then(res => {
				if (res.code == 0) {
					this.lastPage = res.data.last_page;
					this.nodata = !res.data.data.length;
					if (this.page > 1) {
						this.list.push(...res.data.data);
						this.loadingStatus = 'more';
					} else {
						this.list = res.data.data;
						if (res.data.data.length < 10) {
							this.loadingStatus = 'noMore';
						} else {
							this.loadingStatus = 'more';
						}
					}
				}
			});
		},
		toDetails(item, index) {
			if (item.read == 0) {
				this.$http.post('/api/personal/message_edit', { id: item.id }).then(res => {
					if (res.code == 0) {
						if (item.type != 0) {
							if (item.type != 3) {
								uni.redirectTo({
									url: `/pages/composite/used-idle-details?id=${item.cid}&type=${item.type}`
								});
							} else {
								uni.redirectTo({
									url: `/pages/dynamic/dynamic-details?id=${item.cid}`
								});
							}
						} else {
							this.list[index].read = 1;
							uni.showToast({
								title: '此条消息已读',
								icon: 'none'
							});
						}
					}
				});
			} else {
				if (item.type == 1 || item.type == 2) {
					uni.navigateTo({
						url: `/pages/composite/used-idle-details?id=${item.cid}&type=${item.type}`
					});
				} else if (item.type == 3) {
					uni.navigateTo({
						url: `/pages/dynamic/dynamic-details?id=${item.cid}`
					});
				}
			}
		},
		delMsg(id) {
			this.delMsgId = id;
			this.$refs.delPopup.open();
		},
		cancel() {
			this.$refs.delPopup.close();
		},
		confirm() {
			this.$http.post('/api/personal/message_delete', { id: this.delMsgId }).then(res => {
				if (res.code == 0) {
					this.$refs.delPopup.close();
					this.page = 1;
					this.getList();
				}
			});
		}
	}
};
</script>

<style lang="scss">
.my-msg {
	.card {
		box-shadow: 0px 0px 10px 0px rgba(152, 152, 152, 0.2);
		border-radius: 20upx;
		position: relative;
		.cuIcon-title {
			position: absolute;
			top: 20upx;
			right: 20upx;
			font-size: 40upx;
		}
		.avatar {
			width: 68upx;
			height: 68upx;
			border-radius: 50%;
			overflow: hidden;
			margin-right: 20upx;
		}
	}
	// 删除消息
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
