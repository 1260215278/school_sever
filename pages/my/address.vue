<template>
	<view class="address">
		<cu-custom isBack bgColor="bg-white text-black"><block slot="content">收货地址</block></cu-custom>
		<view v-if="nodata" class="no-data-wrap" :style="style">
			<image src="../../static/no-data-img.png" class="no-data-img" mode=""></image>
			<view class="no-data-text">您还没有收货地址哦~</view>
			<button @click="add" class="cu-btn bg-green block add-btn lg round">+新增收货地址</button>
		</view>
		<view v-if="!nodata" class="container">
			<view class="list padding-lr">
				<view v-for="(item, index) in list" :key="index" class="list-item card bg-white">
					<view @click="selectedAddress(item)" class="solid-bottom padding-lr">
						<view class="text-lg text-black padding-top-sm">
							<text>{{ item.name }}</text>
							<text class="padding-lr">{{ item.phone }}</text>
						</view>
						<view class="text-df padding-tb-sm">{{ item.site }}</view>
					</view>
					<view class="flex justify-between align-center padding-tb padding-lr">
						<view @click.stop="setDefault(item)" class="">
							<text v-if="item.is_ture == 0" class="cuIcon-round" style="vertical-align: middle;"></text>
							<text v-if="item.is_ture == 1" class="cuIcon-roundcheckfill text-green" style="vertical-align: middle;"></text>
							<text class="padding-lr-xs" :class="item.is_ture == 0 ? '' : 'text-green'" style="vertical-align: middle;">{{ item.is_ture == 0 ? '设为默认' : '已设为默认' }}</text>
						</view>
						<view class="flex align-center">
							<view @click.stop="editAddress(item)" class="flex align-center padding-left">
								<text class="cuIcon-edit text-666"></text>
								<text class="padding-lr-xs">编缉</text>
							</view>
							<view @click.stop="delAddress(item.id)" class="flex align-center padding-left">
								<text class="cuIcon-delete text-666"></text>
								<text class="padding-lr-xs">删除</text>
							</view>
						</view>
					</view>
				</view>
			</view>
			<view @click="add" class="add-wrap"><button class="cu-btn bg-green block add-btn">+新增收货地址</button></view>
		</view>

		<login-modal></login-modal>
	</view>
</template>

<script>
import common from '@/utils/mixins/common.js';

export default {
	mixins: [common],
	data() {
		return {
			StatusBar: this.StatusBar,
			CustomBar: this.CustomBar,
			nodata: false,
			page: 1,
			lastPage: 1,
			loadingStatus: 'more',
			list: [],
			from: '' // behalf 从发布帮取快递页面过来
		};
	},
	onLoad(option) {
		if (option.from) {
			this.from = option.from;
		}
	},
	onShow() {
		this.page = 1;
		this.getList();
	},
	computed: {
		style() {
			var StatusBar = this.StatusBar;
			var CustomBar = this.CustomBar;
			var bgImage = this.bgImage;
			var style = `height: calc(100vh - ${CustomBar}px - ${StatusBar}px)`;
			return style;
		}
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
		getList() {
			this.$http.post('/api/personal/address_list', { page: this.page }).then(res => {
				if (res.code == 0) {
					this.lastPage = res.data.last_page;
					this.nodata = !res.data.data.length;
					if (this.page > 1) {
						this.list.push(...res.data.data);
						this.loadingStatus = 'more';
					} else {
						this.list = res.data.data;
						if (res.data.data.length < 10) {
							this.loadingStatus = 'nomore';
						} else {
							this.loadingStatus = 'more';
						}
					}
				}
			});
		},
		setDefault(item) {
			if (item.is_ture == 0) {
				this.$http.post('/api/personal/is_ture', { id: item.id }).then(res => {
					if (res.code == 0) {
						if (this.from == 'behalf') {
							let pages = getCurrentPages();
							let prevPage = pages[pages.length - 2];
							prevPage.defaultAddress = { name: item.name, phone: item.phone, site: item.site, id: item.id };
							uni.navigateBack();
						} else {
							uni.showToast({
								title: res.msg,
								icon: 'none'
							});
							this.list.forEach(em => {
								if (em.id == item.id) {
									em.is_ture = 1;
								} else {
									em.is_ture = 0;
								}
							});
						}
					}
				});
			}
		},
		delAddress(id) {
			this.$http.post('/api/personal/delte_address', { id: id }).then(res => {
				if (res.code == 0) {
					uni.showToast({
						title: '删除成功',
						icon: 'none',
						mask: true
					});
					this.page = 1;
					this.getList();
				}
			});
		},
		editAddress(item) {
			uni.navigateTo({
				url: `/pages/my/address-edit?id=${item.id}&name=${item.name}&phone=${item.phone}&province=${item.province}&city=${item.city}&district=${item.district}&address=${
					item.address
				}&build_no=${item.build_no}&school_name=${item.school_name}&school_id=${item.school_id}`
			});
		},
		add() {
			uni.navigateTo({
				url: '/pages/my/address-edit'
			});
		},
		selectedAddress(item) {
			if (this.from == 'behalf') {
				let pages = getCurrentPages();
				let prevPage = pages[pages.length - 2];
				prevPage.defaultAddress = { name: item.name, phone: item.phone, site: item.site, id: item.id };
				uni.navigateBack();
			}
		}
	}
};
</script>

<style lang="scss">
page {
	background: #f2f2f2;
}
.address {
	.container {
		padding-bottom: 120upx;
	}
	.list-item.card {
		border-radius: 20upx;
		margin-top: 20upx;
		.cuIcon-round,
		.cuIcon-roundcheckfill,
		.cuIcon-edit,
		.cuIcon-delete {
			font-size: 36upx;
		}
	}
	.add-wrap {
		position: fixed;
		left: 0;
		right: 0;
		bottom: 0;
		height: 100upx;
		.add-btn {
			height: 100%;
			border-radius: 0;
		}
	}
	.no-data-wrap {
		padding: 150upx 85upx 0 85upx;
		display: flex;
		flex-direction: column;
		align-items: center;
		background: #ffffff;
		box-sizing: border-box;
		.no-data-img {
			width: 200upx;
			height: 200upx;
		}
		.no-data-text {
			padding: 50upx 0 125upx 0;
			font-size: 30upx;
			color: #999999;
		}
		.add-btn {
			height: 88upx;
			width: 100%;
		}
	}
}
</style>
