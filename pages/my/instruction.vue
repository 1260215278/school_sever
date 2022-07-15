<template>
	<view class="instruction">
		<cu-custom isBack bgColor="bg-white text-black"><block slot="content">使用说明</block></cu-custom>
		<view class="container padding"><jyf-parser v-if="article" :html="article" @preview="preview" @navigate="navigate"></jyf-parser></view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			article: ''
		};
	},
	onLoad() {
		this.getData();
	},
	methods: {
		getData() {
			this.$http.post('/api/personal/rests').then(res => {
				if (res.code == 0) {
					console.log(res.data.explain)
					this.article = res.data.explain;
				}
			});
		},
		preview(src, e) {
			// do something
		},
		navigate(href, e) {
			// do something
		}
	}
};
</script>

<style lang="scss"></style>
