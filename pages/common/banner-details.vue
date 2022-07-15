<template>
	<view class="banner-details">
		<cu-custom isBack bgColor="bg-white text-black"><block slot="content">详情</block></cu-custom>

		<view class="container padding"><jyf-parser v-if="bannerArticle" :html="bannerArticle" @linkpress="linkpress"></jyf-parser></view>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
	data() {
		return {};
	},
	computed: {
		...mapGetters(['bannerArticle'])
	},
	methods: {
		linkpress(e) {
			location.href = e.href
		}
	}
};
</script>

<style lang="scss"></style>
