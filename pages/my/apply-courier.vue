<template>
	<view class="apply-courier">
		<cu-custom isBack bgColor="bg-white text-black"><block slot="content">申请填写</block></cu-custom>
		<view class="container">
			<image class="apply-courier-img" src="../../static/apply-courier-img.png" mode="aspectFill"></image>
			<view class="card">
				<view class="flex align-center padding-tb-sm solid-bottom">
					<view class="">姓名：</view>
					<view class="flex-sub"><input v-model="form.name" class="input" type="text" placeholder="请输入姓名" /></view>
				</view>
				<view class="flex align-center padding-tb-sm solid-bottom">
					<view class="">电话：</view>
					<view class="flex-sub"><input v-model="form.phone" @input="phoneInput" class="input" :maxlength="11" type="number" placeholder="请输入电话" /></view>
				</view>
				<view class="flex align-center padding-tb-sm solid-bottom">
					<view class="">学校：</view>
					<view class="flex-sub"><input v-model="form.school" class="input" type="text" disabled placeholder="请输入学校" /></view>
				</view>
				<view class="flex align-center padding-tb-sm solid-bottom">
					<view class="">楼号：</view>
					<view class="flex-sub"><input v-model="form.building_num" class="input" type="text" placeholder="请输入楼号" /></view>
				</view>
				<view class="flex align-center padding-tb-sm solid-bottom">
					<view class="">寝室号：</view>
					<view class="flex-sub"><input v-model="form.dormitory_num" class="input" type="text" placeholder="请输入寝室号" /></view>
				</view>
				<view class="flex align-center padding-tb-sm solid-bottom">
					<view class="">手持学生证：</view>
					<view class="flex-sub" style="margin-left: 275rpx;">
						<u-upload width="150" height="150" :action="action" max-count="1" :header="headers"
						 @on-success="uploadSuccess" @on-remove="removeImg" :file-list="fileList"></u-upload>
					</view>
				</view>
			</view>
			<view class="margin-xl padding"><button @click="submit" :disabled="!disabled" type="" class="cu-btn bg-green round lg block submit">提交</button></view>
		</view>

		<login-modal></login-modal>
	</view>
</template>

<script>
import { mapGetters } from 'vuex';
import common from '@/utils/mixins/common.js';

export default {
	mixins: [common],
	data() {
		return {
			form: {
				name: '',
				phone: '',
				school: '',
				building_num: '',
				dormitory_num: '',
				image:''
			},
			action: this.$domain + '/api/login/upload_image',
			fileList: [],
			headers:{}
		};
	},
	computed: {
		...mapGetters(['schoolinfo']),
		disabled() {
			let flag = true;
			for (let key in this.form) {
				if (!this.form[key]) {
					flag = false;
				}
			}
			return flag;
		}
	},
	onLoad() {
		this.headers.token = this.token
	},
	mounted() {
		this.form.school = this.schoolinfo.school_name;
	},
	methods: {
		uploadSuccess(data, index, lists, name){
			console
			if(data.code == 0){
				this.form.image = data.data
			}
		},
		removeImg(index,lists,name){
			this.form.image = ''
		},
		phoneInput(e) {
			let val = e.target.value;
			val = val.replace(/[^\d]/g, '');
			this.form.phone = val;
		},
		submit() {
			if (!/^(?:13\d|14\d|15\d|16\d|17\d|18\d|19\d)\d{5}(\d{3}|\*{3})$/.test(this.form.phone)) {
				uni.showToast({
					title: '手机号码格式有误',
					icon: 'none'
				});
				return;
			}
			if(!this.form.image){
				uni.showToast({
					title: '请上传手持学生证照片',
					icon: 'none'
				});
				return;
			}
			this.form.school_id = this.schoolinfo.id;
			this.$http.post('/api/personal/express_apply', this.form).then(res => {
				if (res.code == 0) {
					uni.showToast({
						title: res.msg,
						icon: 'success',
						mask: true,
						duration: 1000
					});
					setTimeout(() => {
						uni.navigateBack();
					}, 1200);
				}
			});
		}
	}
};
</script>

<style lang="scss">
page {
	background: #f2f2f2;
}
.apply-courier {
	.apply-courier-img {
		width: 100%;
		height: 200upx;
	}
	.card {
		box-shadow: 0px 0px 10px 0px rgba(152, 152, 152, 0.1);
		border-radius: 20upx;
		background: #ffffff;
		color: grey;
		font-size: 32upx;
		margin: 20upx 30upx 0 30upx;
		padding: 10upx 30upx 0 30upx;
		.input {
			text-align: right;
		}
	}
	.submit {
		box-shadow: 0px 2px 10px 0px rgba(38, 212, 153, 0.5);
	}
}
</style>
