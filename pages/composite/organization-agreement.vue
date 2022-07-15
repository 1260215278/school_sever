<template>
	<view v-if="info">
		<uni-nav-bar
			class="navBar"
			:title="title"
			leftIcon="back"
			color="#333"
			:fixed="true"
			:statusBar="true"
			:shadow="false"
			@clickLeft="clickLeft"
			:border="false"
			backgroundColor="#fff"
		></uni-nav-bar>

		<jyf-parser :html="info" ref="article" class="node"></jyf-parser>
	</view>
</template>

<script>
export default {
	data() {
		return {
			title: '协议',
			c_id: '',
			info: ''
		};
	},
	onLoad(options) {
		this.c_id = options.c_id;
		this.getDetails();
	},
	methods: {
		async getDetails() {
			let res = await this.$http.post('/api/training/get_agreement', { c_id: this.c_id }, { headers: { 'Content-Type': '	application/x-www-form-urlencoded' } });
			if (res.code == 0) {
				this.info = res.data;
			}
		},
		clickLeft() {
			uni.navigateBack();
		}
	}
};
</script>

<style lang="scss" scoped>
.node {
	padding: 30rpx;
}
</style>
