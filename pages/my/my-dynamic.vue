<template>
	<view class="my-dynamic">
		<cu-custom isBack bgColor="bg-white black"><block slot="content">我的动态</block></cu-custom>
		<view class="container padding-lr">
			<dynamic-card @click.native="toDetails(item.id)" @longpress.native="delDynamic(item.id)" v-for="(item, index) in list" :key="index" :item="item"></dynamic-card>
			<tui-tips v-if="nodata" fixed imgUrl="../../static/img_nodata.png">暂无数据</tui-tips>
		</view>

		<login-modal></login-modal>
	</view>
</template>

<script>
import dynamicCard from '@/components/dynamic/dynamic-card.vue';
import common from '@/utils/mixins/common.js';
import tuiTips from '@/components/tips/tips.vue';

export default {
	components: { dynamicCard, tuiTips },
	mixins: [common],
	data() {
		return {
			page: 1,
			lastPage: 1,
			nodata: false,
			list: []
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
			this.$http.post('/api/personal/dynamic', { page: this.page }).then(res => {
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
		toDetails(id) {
			uni.navigateTo({ url: `/pages/dynamic/dynamic-details?id=${id}` });
		},

		// 删除此条动态
		delDynamic(id) {
			uni.showModal({
				content: '删除此条动态？',
				cancelColor: '#989898',
				confirmColor: '#26D499',
				success: e => {
					if (e.confirm) {
						this.$http.post('/api/school/dynamic_delete', { id: id }).then(res => {
							if (res.code == 0) {
								this.page = 1;
								this.getList();
								uni.showToast({
									title: '删除成功',
									icon: 'none'
								});
							}
						});
					}
				}
			});
		}
	}
};
</script>

<style></style>
