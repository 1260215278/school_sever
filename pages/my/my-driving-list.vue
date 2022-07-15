<template>
	<view class="my-driving-list">
		<cu-custom isBack bgColor="bg-white text-black"><block slot="content">报名驾校</block></cu-custom>
		<view class="container">
			<view class="list margin-lr padding-top-sm">
				<view @click="toDetails(item.id)" v-for="(item, index) in list" :key="index" class="list-item padding-sm flex justify-between ">
					<image class="img margin-right-sm" :src="item.driving_images" mode=""></image>
					<view class="right flex-sub flex flex-direction justify-between">
						<view class=" flex justify-between align-center">
							<text class="text-lg text-bold text-cut">{{ item.driving_name }}</text>
							<text class="text-gray">{{ item.distances }}</text>
						</view>
						<view class="text-df">
							<text class="text-999">班型：</text>
							<text>
								{{ item.driving_first }}
								<text class="text-lg">|</text>
								{{ item.driving_class }}
							</text>
						</view>
						<view class="flex justify-between align-center">
							<view class="flex-sub text-df">
								<text class="text-999">车辆分配：</text>
								<text>{{ item.driving_referral }}</text>
							</view>
							<view class="text-xl text-red">¥{{ item.price }}</view>
						</view>
					</view>
				</view>
				<tui-tips v-if="nodata" imgUrl="../../static/img_nodata.png" fixed>暂无数据</tui-tips>
				<uni-load-more v-if="list.length > 9" :status="loadingStatus"></uni-load-more>
			</view>
		</view>

		<login-modal></login-modal>
	</view>
</template>

<script>
import tuiTips from '@/components/tips/tips.vue';
import uniLoadMore from '@/components/uni-load-more/uni-load-more.vue';
import common from '@/utils/mixins/common.js';
import { mapGetters } from 'vuex';

export default {
	components: { tuiTips, uniLoadMore },
	mixins: [common],
	data() {
		return {
			list: [],
			page: 1,
			lastPage: 1,
			nodata: false,
			loadingStatus: 'more',
			pullUpOn: false
		};
	},
	computed: {
		...mapGetters(['schoolinfo'])
	},
	onPullDownRefresh() {
		this.pullUpOn = true;
		this.page = 1;
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
	onLoad() {
		this.getList();
	},
	methods: {
		getList() {
			this.$http.post('/api/driving/driving_orderList', { school_id: this.schoolinfo.id, page: this.page }).then(res => {
				if (res.code == 0) {
					this.lastPage = res.data.lastPage;
					this.nodata = !res.data.list.length;
					if (this.page > 1) {
						this.list.push(...res.data.list);
						this.loadingStatus = 'more';
					} else {
						this.list = res.data.list;
						if (res.data.list.length < 10) {
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
		toDetails(id) {
			uni.navigateTo({
				url: `/pages/my/my-driving-details?id=${id}`
			});
		}
	}
};
</script>

<style lang="scss">
// 列表
.list-item {
	margin-bottom: 20upx;
	box-shadow: 0px 0px 20upx 0px rgba(152, 152, 152, 0.2);
	border-radius: 20upx;
	.img {
		width: 150upx;
		height: 150upx;
		border-radius: 20upx;
	}
}
</style>
