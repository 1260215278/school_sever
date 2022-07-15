<template>
	<view>
		<uni-nav-bar
			class="navBar"
			title="添加备注"
			leftIcon="back"
			color="#333"
			:fixed="true"
			:statusBar="true"
			:shadow="false"
			@clickLeft="clickLeft"
			:border="false"
			backgroundColor="#fff"
		></uni-nav-bar>
		<view class="form-textarea">
			<textarea v-model="remark" placeholder="请输入你要备注的信息" class="remark" />
			<button @click="save" class="btn-save" :disabled="!disabled">保存</button>
		</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			remark: ''
		};
	},
	computed: {
		disabled() {
			return !!this.remark.trim();
		}
	},
	onLoad(options) {
		if (options.remark) this.remark = options.remark;
	},
	methods: {
		save() {
			uni.$emit('saveTextarea', this.remark);
			uni.navigateBack();
		},
		clickLeft() {
			uni.navigateBack();
		}
	}
};
</script>

<style lang="scss" scoped>
.form-textarea {
	padding: 30rpx;
}
.remark {
	width: 100%;
	height: 220rpx;
	background: rgba(250, 250, 250, 1);
	border: 2rpx solid rgba(196, 196, 196, 1);
	border-radius: 20rpx;
	box-sizing: border-box;
	padding: 20rpx 30rpx;
}

.btn-save {
	margin: 40rpx auto;
	width: 240rpx;
	border-radius: 46rpx;
	background-color: #26d499;
	color: #ffffff;
	&:after {
		border-color: transparent;
	}
}
button[disabled].btn-save {
	background-color: #efefef;
	color: #333;
}
</style>
