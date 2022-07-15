<template>
	<view class="instruction">
		<cu-custom isBack bgColor="bg-white text-black"><block slot="content">关于我们</block></cu-custom>
		<view class="container padding"><jyf-parser v-if="article" :html="article" @imgtap="preview" @linkpress="linkpress"></jyf-parser></view>
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
					this.article = res.data.regard;
				}
			});
		},
		preview(src, e) {
			// do something
		},
		linkpress(e) {
			location.href = e.href
		}
	}
};
</script>

<style lang="scss"></style>
