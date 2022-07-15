<template>
	<view class="dynamic-details">
		<!-- <cu-custom bgColor="bg-white text-black" isBack><block slot="content">详情</block></cu-custom> -->

		<view class="container" v-if="item">
			<view class="padding-lr padding-top-sm"><dynamic-card @viewImage="viewImage" @liked="liked" :item="item"></dynamic-card></view>

			<view class="comments-wrap padding-left padding-top">
				<view class="flex justify-between align-center">
					<view class="text-df">全部评论（{{ item.evaluate }}）</view>
				</view>
				<view @longpress.stop="longDel(em.id)" @click="reply(em.user_name, em.id)" v-for="(em, index) in list" :key="index" class="flex justify-between padding-top">
					<image :src="em.avatar" class="comment-avatar" mode="aspectFill"></image>
					<view class="flex-sub flex flex-direction overflow solid-bottom padding-right padding-bottom-xs">
						<view class="flex justify-between align-center overflow">
							<view class="flex-sub text-df text-cut">{{ em.user_name }}</view>
							<view class="text-999">{{ dateFormat(em.addtime) }}</view>
						</view>
						<view class="text-666">{{ em.evaluation_content }}</view>
						<view v-if="em.list.length" class="padding-lr padding-tb-sm bg-gray margin-sm" style="border-radius: 20upx;">
							<view @longpress.stop="longDel(e.id)" @click.stop="reply(em.user_name, em.id, e.id)" v-for="(e, i) in em.list" :key="i" class="flex flex-wrap">
								<text class="text-green">{{ e.nickname }}：</text>
								<text class="flex-sub">{{ e.evaluation_content }}</text>
							</view>
						</view>
					</view>
				</view>
				<tui-tips v-if="nodata" :fixed="false" imgUrl="../../static/img_nodata.png">暂无数据</tui-tips>
				<uni-load-more v-if="list.length" :status="loadingStatus"></uni-load-more>
			</view>
		</view>

		<view v-if="!isReply" class="cu-bar input commet-actions">
			<view class="search-form round">
				<image src="../../static/edit-icon.png" class="edit-icon" mode=""></image>
				<input
					v-model="commentContent"
					@focus="InputFocus"
					@blur="InputBlur"
					:adjust-position="false"
					class="bg-gray input"
					:focus="false"
					maxlength="300"
					:cursor-spacing="10"
					placeholder="在这里写下精彩评论~"
				/>
			</view>
			<button @click="sendComment" class="cu-btn bg-green shadow-blur round send">发送</button>
		</view>
		<!-- 回复 -->
		<uni-popup ref="replyPopup" type="bottom" @change="closeReplyPopup">
			<view class="cu-bar input commet-actions">
				<view class="search-form round">
					<image src="../../static/edit-icon.png" class="edit-icon" mode=""></image>
					<input
						v-model="replyContent"
						@focus="InputFocus"
						@blur="InputBlur"
						:adjust-position="false"
						class="bg-gray input"
						:focus="true"
						maxlength="300"
						:cursor-spacing="10"
						:placeholder="'回复：' + replyName"
					/>
				</view>
				<button @click="sendReply" class="cu-btn bg-green shadow-blur round send">回复</button>
			</view>
		</uni-popup>
		<login-modal></login-modal>
	</view>
</template>

<script>
import dynamicCard from '@/components/dynamic/dynamic-card.vue';
import common from '@/utils/mixins/common.js';
import { mapGetters } from 'vuex';
import { dateUtils } from '@/utils/util.js';
import tuiTips from '@/components/tips/tips.vue';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import uniPopup from '@/components/uni-popup/uni-popup.vue';

export default {
	components: { dynamicCard, tuiTips, uniLoadMore, uniPopup },
	mixins: [common],
	data() {
		return {
			InputBottom: 0,
			id: '',
			item: '',
			list: [],
			page: 1,
			lastPage: 1,
			nodata: false,
			loadingStatus: 'more',
			pullUpOn: false,
			commentContent: '',
			isReply: false,
			replyContent: '', // 回复内容
			replyId: '', // 回复id
			replyName: '', // 回复对象名字
			pids: '' // 回复人id
		};
	},
	computed: {
		...mapGetters(['token'])
	},
	onLoad(option) {
		this.id = option.id;
		this.getData();
		this.getCommentList();
	},
	onPullDownRefresh() {
		this.pullUpOn = true;
		this.page = 1;
		this.getCommentList();
	},
	onReachBottom() {
		this.loadingStatus = 'loading';
		if (this.page < this.lastPage) {
			this.page++;
			this.getCommentList();
		} else {
			this.loadingStatus = 'noMore';
		}
	},
	methods: {
		// 评论长按删除
		longDel(id) {
			uni.showModal({
				content: '删除此条评论？',
				cancelColor: '#989898',
				confirmColor: '#26D499',
				success: e => {
					if (e.confirm) {
						this.$http.post('/api/school/delete_evaluate', { id: id }).then(res => {
							if (res.code == 0) {
								this.page = 1;
								this.getCommentList();
								uni.showToast({
									title: '删除成功',
									icon: 'none'
								});
							} else {
								uni.showToast({
									title: res.msg,
									icon: 'none'
								});
							}
						});
					}
				}
			});
		},
		dateFormat(val) {
			if (val) {
				return dateUtils.humanize(val * 1000);
			} else {
				return '';
			}
		},
		getData() {
			this.$http.post('/api/school/dynamic_details', { id: this.id }).then(res => {
				if (res.code == 0) {
					this.item = res.data;
				}
			});
		},
		// 点赞
		liked(item) {
			if (!this.token) {
				this.setLoginModal(true);
				return;
			}
			this.$http.post('/api/personal/favour', { id: item.id }).then(res => {
				if (res.code == 0) {
					if (item.fage == 1) {
						item.dzcount--;
						item.fage = 2;
					} else {
						item.dzcount++;
						item.fage = 1;
					}
				}
			});
		},

		// 评论
		getCommentList() {
			// type 1 是二手闲置评论 2 是失物招领评论 3 是动态评论 (评论列表需要判断此参数)
			this.$http.post('/api/school/evaluate_list', { did: this.id, page: this.page, falg: 3 }).then(res => {
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
					if (this.pullUpOn) {
						this.pullUpOn = false;
						uni.stopPullDownRefresh();
						uni.showToast({
							title: '刷新成功',
							icon: 'none'
						});
					}
				}
			});
		},

		InputFocus(e) {
			this.InputBottom = e.detail.height;
		},
		InputBlur(e) {
			this.InputBottom = 0;
		},
		sendComment() {
			if (!this.commentContent.trim()) {
				uni.showToast({
					title: '评论内容不能为空！',
					icon: 'none'
				});
				return;
			}
			// falg	1是二手闲置2失物招领3是动态评论 did 当前商品id type 1是评论2是回复评论 content 评论内容
			this.$http.post('/api/school/evaluate', { falg: 3, did: this.id, type: 1, content: this.commentContent }).then(res => {
				if (res.code == 0) {
					this.commentContent = '';
					this.page = 1;
					this.getCommentList();
					uni.showToast({
						title: '评论成功',
						icon: 'none'
					});
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			});
		},
		// 回复
		reply(name, id, pids) {
			this.replyName = name;
			this.replyId = id;
			this.isReply = true;
			this.pids = pids;
			this.$refs.replyPopup.open();
		},
		closeReplyPopup(e) {
			if (!e.show) {
				this.isReply = false;
			}
		},
		sendReply() {
			if (!this.replyContent.trim()) {
				uni.showToast({
					title: '回复内容不能为空！',
					icon: 'none'
				});
				return;
			}
			// falg	1是二手闲置2失物招领3是动态评论 did 当前商品id type 1是评论2是回复评论 content 评论内容
			this.$http.post('/api/school/evaluate', { falg: 3, did: this.id, type: 2, content: this.replyContent, pid: this.replyId, pids: this.pids }).then(res => {
				if (res.code == 0) {
					this.$refs.replyPopup.close();
					this.isReply = false;
					this.replyContent = '';
					this.page = 1;
					this.getCommentList();
					uni.showToast({
						title: '回复成功',
						icon: 'none'
					});
				} else {
					uni.showToast({
						title: res.msg,
						icon: 'none'
					});
				}
			});
		},

		// 预览图片
		viewImage(url, urls, i) {
			uni.previewImage({
				urls: urls,
				current: url
			});
			// uni.setStorageSync('imgPreviewPicList', urls);
			// uni.setStorageSync('currentImgIndex', i);
			// uni.navigateTo({
			// 	url: '/pages/imgPreview/imgPreview'
			// });
		}
	}
};
</script>

<style lang="scss">
/deep/.cu-custom .cu-bar {
	z-index: 99;
}
.dynamic-details {
	.container {
		padding-bottom: 100upx;
	}
	.comments-wrap {
		background: #ffffff;
		.comment-avatar {
			width: 68upx;
			height: 68upx;
			border-radius: 50%;
			overflow: hidden;
			margin-right: 10upx;
		}
	}
	// 评论输入条
	.commet-actions {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		.search-form {
			padding-top: 8upx;
		}
		.edit-icon {
			width: 36upx;
			height: 36upx;
			margin-left: 30upx;
		}
	}
}
</style>
