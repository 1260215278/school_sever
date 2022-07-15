<template>
	<view class="used-idle-details">
		<uni-nav-bar leftIcon="back" :title="title" @clickLeft="clickLeft" fixed :statusBar="true"></uni-nav-bar>

		<view class="container" v-if="info">
			<view class="margin-lr padding-tb-sm flex align-center solid-bottom">
				<image :src="info.avatar" class="avatar" mode="aspectFill"></image>
				<view class="flex-sub flex flex-direction justify-between overflow" style="height: 88upx">
					<view class="overflow flex justify-between align-center">
						<view class="flex-sub text-lg text-cut">{{ info.user_name }}</view>
						<view class="text-df text-999">{{ info.addtime }}</view>
					</view>
					<view class="flex align-center">
						<image src="../../static/location-address-icon.png" class="location-address-icon" mode=""></image>
						<text class="flex-sub padding-lr-xs text-666 text-cut">{{ info.school_city + ' · ' + info.school_name }}</text>
					</view>
				</view>
			</view>
			<!-- content -->
			<view class="padding-lr">
				<!-- 二手闲置-template -->
				<view v-if="info.fage == 1" class="flex justify-between align-center padding-top-sm">
					<view class="flex align-center">
						<view class="text-red text-lg text-price text-bold">{{ info.price }}</view>
						<view class="text-999 padding-lr">入手价：{{ info.start_price }}</view>
					</view>
					<view class="text-999">运费：{{ info.carriage }}</view>
				</view>
				<!-- 二手需求-template -->
				<view v-if="info.fage == 2" class="flex align-center padding-top-sm">
					<text class="text-999">期望价格：</text>
					<text class="text-price text-bold text-lg text-red">{{ info.price }}</text>
				</view>
				<view class="padding-top-sm text-lg">
					<text v-if="info.fage == 1" class="text-green margin-right-xs">{{ tagsText(info.message) }}</text>
					{{ info.title }}
				</view>
				<view class="padding-top-sm text-666 text-df">{{ info.describe }}</view>
				<view @click="viewImage(index)" :data-url="item" v-for="(item, index) in info.sort_images" :key="index" class="idle-img-wrap margin-top-sm">
					<image :src="item" class="idle-img" mode="widthFix"></image>
				</view>
			</view>
			<view v-if="!(from == 'my')" class="comments-wrap padding-left">
				<view class="flex justify-between align-center padding-right padding-top-sm">
					<view class="text-df">全部评论（{{ info.evaluate }}）</view>
					<view class="flex align-center text-666">
						<image src="../../static/views-icon.png" class="views-icon margin-lr-xs" mode=""></image>
						{{ info.count }}
					</view>
				</view>
				<view @longpress.stop="longDel(item.id)" @click="reply(item.user_name, item.id)" v-for="(item, index) in commentList" :key="index" class="flex justify-between padding-top">
					<image :src="item.avatar" class="comment-avatar" mode="aspectFill"></image>
					<view class="flex-sub flex flex-direction overflow solid-bottom padding-bottom-xs padding-right">
						<view class="flex justify-between align-center overflow">
							<view class="flex-sub text-df text-cut">{{ item.user_name }}</view>
							<view class="text-999">{{ dateFormat(item.addtime) }}</view>
						</view>
						<view class="text-666">{{ item.evaluation_content }}</view>
						<view v-if="item.list.length" class="padding-lr padding-tb-sm bg-gray margin-sm" style="border-radius: 20upx;">
							<view @longpress.stop="longDel(em.id)" @click.stop="reply(item.user_name, item.id, em.id)" v-for="(em, i) in item.list" :key="i" class="flex flex-wrap">
								<text class="text-green">{{ em.nickname }}：</text>
								<text class="flex-sub">{{ em.evaluation_content }}</text>
							</view>
						</view>
					</view>
				</view>
				<tui-tips v-if="nodata" :fixed="false" imgUrl="../../static/img_nodata.png">暂无数据</tui-tips>
				<uni-load-more v-if="commentList.length" :status="loadingStatus"></uni-load-more>
			</view>
		</view>

		<!-- 底部操作条 -->
		<view class="actions-fixed-wrap">
			<block v-if="from !== 'my'">
				<view class="actions-fixed">
					<view class="flex">
						<view
							v-if="info.fage == 1 || info.fage == 2"
							@click="collect"
							class="flex flex-direction align-center justify-between text-xxl"
							style="height: 80upx;margin-right: 80upx"
						>
							<image v-if="!info.enshrine" src="../../static/collect-icon.png" class="collect-icon" mode=""></image>
							<image v-if="info.enshrine == 1" src="../../static/collected-icon.png" class="collect-icon" mode=""></image>
							<text class="text-xs">收藏</text>
						</view>
						<!-- <view @click="clipboard" class="flex flex-direction align-center justify-between text-xxl" style="height: 80upx">
							<image src="../../static/share-icon.png" class="share-icon" mode=""></image>
							<text class="text-xs">分享</text>
						</view> -->
						<button @click="clipboard" open-type="share" class="btn-share">
							<image src="../../static/share-icon.png" class="share-icon" mode=""></image>
							<text class="share-txt text-xs">分享</text>
						</button>
					</view>
					<view class="">
						<button @click="toComment" class="cu-btn bg-green round margin-left-sm">评论</button>
						<button @click="makePhoneCall" class="cu-btn bg-red round margin-left-sm">立即联系</button>
					</view>
				</view>
			</block>
			<block v-if="from == 'my'">
				<view class="flex justify-end align-center actions-fixed-my">
					<button v-if="info.type != 1" @click.stop="openPopup(2)" class="cu-btn line-gray sm margin-left-sm">上架</button>
					<button v-if="info.type != 2" @click.stop="openPopup(1)" class="cu-btn line-gray sm margin-left-sm">下架</button>
					<button @click.stop="openPopup(3)" class="cu-btn line-gray sm margin-left-sm">删除</button>
					<button @click.stop="toEdit" class="cu-btn line-gray sm margin-left-sm">编缉</button>
				</view>
			</block>
		</view>

		<!-- 评论 -->
		<uni-popup ref="commentInput" type="bottom">
			<view class="cu-bar input commet-actions">
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
		</uni-popup>
		<!-- 回复 -->
		<uni-popup ref="replyInput" type="bottom">
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

		<login-modal ref="loginModal"></login-modal>
	</view>
</template>
<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import uniNavBar from '@/components/uni-nav-bar/uni-nav-bar.vue';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import tuiTips from '@/components/tips/tips.vue';
import common from '@/utils/mixins/common.js';
import { mapGetters } from 'vuex';
import { dateUtils } from '@/utils/util.js';
const thorui = require('@/components/utils/clipboard.thorui.js');

export default {
	components: { uniNavBar, uniLoadMore, tuiTips, uniPopup },
	mixins: [common],
	data() {
		return {
			id: '',
			type: '', // 1 是二手闲置评论 2 是失物招领评论 3 是动态评论 (评论列表需要判断此参数)
			titleType: 1, // 1 二手闲置 2 二手需求 3 我丢失的 4 我捡到的
			from: '', // 从我的页面过来
			info: '',
			page: 1,
			lastPage: 1,
			InputBottom: 0,
			commentContent: '', // 评论内容
			replyContent: '', // 回复内容
			replyName: '', // 回复名字
			replyId: '', // 回复当前id
			pids: '', // 回复人id
			commentList: [],
			nodata: false,
			loadingStatus: 'more',
			pullUpOn: false,
			popupContent: { type: '', content: '' } // 弹窗内容
		};
	},
	computed: {
		...mapGetters(['token', 'shareData', 'userinfo']),
		title() {
			if (this.titleType == 1) {
				return '二手闲置';
			} else if (this.titleType == 2) {
				return '二手需求';
			} else if (this.titleType == 3) {
				return '我丢失的';
			} else if (this.titleType == 4) {
				return '我捡到的';
			} else {
				return '';
			}
		}
	},
	onLoad(option) {
		this.id = option.id;
		this.type = option.type;
		if (option.from) {
			this.from = option.from;
		} else {
			this.getCommentList();
		}
		this.getData();
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
	onShareAppMessage(res) {
		if (res.from === 'button') {
			// 来自页面内分享按钮
			console.log(res.target);
		}
		return {
			title: this.shareData ? this.shareData.title : '',
			path: this.shareData && this.userinfo ? `/pages/tabbar/home?invite_code=${this.userinfo.invite_code}` : ''
		};
	},
	methods: {
		setNavigationBarTitle() {
			let title = '';
			if (this.titleType == 1) title = '二手闲置';
			else if (this.titleType == 2) title = '二手需求';
			else if (this.titleType == 3) title = '我丢失的';
			else if (this.titleType == 4) title = '我捡到的';
			else return '';
			uni.setNavigationBarTitle({ title: title });
		},
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
		clickLeft() {
			uni.navigateBack();
		},
		clipboard() {
			// #ifdef H5
			let path = location.href;
			thorui.getClipboardData(path, res => {
				if (res) {
					uni.showToast({
						title: '分享链接复制成功',
						icon: 'none'
					});
				} else {
					uni.showToast({
						title: '分享链接复制失败',
						icon: 'none'
					});
				}
			});
			// #endif
		},
		// 标签转换
		tagsText(val) {
			if (val) {
				let arr = val.split(',');
				let txt = '';
				for (let i = 0; i < arr.length; i++) {
					txt += '#' + arr[i] + ' ';
				}
				return txt;
			} else {
				return '';
			}
		},
		// 评论时间转换
		dateFormat(val) {
			if (val) {
				return dateUtils.humanize(val * 1000);
			} else {
				return '';
			}
		},
		// getData(id) {
		getData() {
			this.$http.post('/api/school/demand_details', { did: this.id }).then(res => {
				if (res.code == 0) {
					this.titleType = res.data.fage; // 标题
					this.setNavigationBarTitle();
					this.info = res.data;
				}
			});
		},
		// 评论列表
		getCommentList() {
			// falg 1是二手闲置评论2是失物招领评论3是动态评论
			this.$http.post('/api/school/evaluate_list', { did: this.id, page: this.page, falg: this.type }).then(res => {
				if (res.code == 0) {
					this.lastPage = res.data.last_page;
					this.nodata = !res.data.data.length;
					if (this.page < this.lastPage) {
						this.commentList.push(...res.data.data);
						this.loadingStatus = 'more';
					} else {
						this.commentList = res.data.data;
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
		viewImage(index) {
			// uni.previewImage({
			// 	urls: this.info.sort_images,
			// 	current: e.currentTarget.dataset.url
			// });
			uni.setStorageSync('imgPreviewPicList', this.info.sort_images);
			uni.setStorageSync('currentImgIndex', index);
			uni.navigateTo({
				url: '/pages/imgPreview/imgPreview'
			});
		},

		// 评论
		toComment() {
			if (!this.token) {
				this.setLoginModal(true);
			}
			this.$refs.commentInput.open();
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
			this.$http.post('/api/school/evaluate', { falg: this.type, did: this.id, type: 1, content: this.commentContent }).then(res => {
				if (res.code == 0) {
					this.$refs.commentInput.close();
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
			if (!this.token) {
				this.setLoginModal(true);
			}
			this.replyName = name;
			this.replyId = id;
			this.$refs.replyInput.open();
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
			this.$http.post('/api/school/evaluate', { falg: this.type, did: this.id, type: 2, content: this.replyContent, pid: this.replyId, pids: this.pids }).then(res => {
				if (res.code == 0) {
					this.$refs.replyInput.close();
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
		// 收藏
		collect() {
			if (!this.token) {
				this.setLoginModal(true);
				return;
			}
			// 收藏
			if (this.info.enshrine == 0) {
				// type 1是商家2是二手闲置3是驾校
				this.$http.post('/api/driving/addEnshrine', { cid: this.id, type: 2 }).then(res => {
					if (res.code == 0) {
						this.getData();
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			} else {
				// 取消收藏
				this.$http.post('/api/driving/deleteEnshrine', { id: this.info.evaluate_id }).then(res => {
					if (res.code == 0) {
						this.getData();
					} else {
						uni.showToast({
							title: res.msg,
							icon: 'none'
						});
					}
				});
			}
		},
		// 拨打电话
		makePhoneCall() {
			uni.makePhoneCall({
				phoneNumber: this.info.phone
			});
		},

		// 从我的页面过来 操作条
		openPopup(val) {
			// 1 下架 2 上架 3 删除
			if (val === 1) {
				this.popupContent.content = '下架此闲置?';
			} else if (val === 2) {
				this.popupContent.content = '上架此闲置?';
			} else {
				this.popupContent.content = '删除此闲置?';
			}
			this.popupContent.type = val;
			this.$refs.popup.open();
		},
		cancelPopup() {
			this.$refs.popup.close();
		},
		confirmPopup() {
			if (this.popupContent.type == 3) {
				// 删除
				this.$http.post('/api/personal/delete_lose', { id: this.id }).then(res => {
					if (res.code == 0) {
						this.$refs.popup.close();
						let pages = getCurrentPages();
						let prevPage = pages[pages.length - 2];
						prevPage.page = 1;
						prevPage.getList();
						this.$nextTick(() => {
							uni.navigateBack();
						});
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
				this.$http.post('/api/driving/edit_type', { id: this.id, type: type }).then(res => {
					if (res.code == 0) {
						this.info.type = this.info.type == 1 ? 2 : 1;
						let pages = getCurrentPages();
						let prevPage = pages[pages.length - 2];
						prevPage.getList();
						this.$refs.popup.close();
					}
				});
			}
		},
		// 去编缉
		toEdit() {
			//fage 1是发布2是需求3是失物招领（我丢失的）4是我捡到的
			uni.navigateTo({
				url: `/pages/composite/used-idle-issue?id=${this.id}&tab=${this.info.fage - 1}`
			});
		}
	}
};
</script>
<style lang="scss">
.used-idle-details {
	/deep/.uni-navbar--border {
		border-color: transparent;
	}
	/deep/.uni-navbar--fixed {
		z-index: 99;
	}
	.container {
		padding-bottom: 100upx;
	}
	.avatar {
		width: 88upx;
		height: 88upx;
		border-radius: 50%;
		overflow: hidden;
		margin-right: 20upx;
	}
	.idle-img-wrap {
		width: 100%;
		// height: auto;
		// height: 400upx;
		min-height: 400upx;
		border-radius: 20upx;
		overflow: hidden;
		.idle-img {
			width: 100%;
			// height: auto;
			min-height: 400upx;
		}
	}
	.comment-avatar {
		width: 68upx;
		height: 68upx;
		border-radius: 50%;
		overflow: hidden;
		margin-right: 10upx;
	}
	.actions-fixed-wrap {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		background: #ffffff;
		box-sizing: border-box;
		box-shadow: 0px 0px 20px 0px rgba(176, 176, 176, 0.15);

		.actions-fixed {
			padding: 0 50upx;
			display: flex;
			justify-content: space-between;
			align-items: center;
			height: 100upx;
		}

		.actions-fixed-my {
			height: 100upx;
			padding: 0 30upx;
			.cu-btn.sm {
				font-size: 24upx;
				font-weight: 500;
			}
		}
	}
	.share-icon {
		width: 48upx;
		height: 48upx;
	}
	.collect-icon {
		width: 48upx;
		height: 48upx;
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

	.btn-share {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: space-between;
		height: 80rpx;
		background-color: transparent;
		padding: 0;
		margin: 0;
		&::after {
			border-color: transparent;
		}
		.share-icon {
			width: 48rpx;
			height: 48rpx;
		}
		.share-txt {
			font-size: 20rpx;
			line-height: 1;
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
