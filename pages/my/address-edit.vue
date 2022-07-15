<template>
	<view class="address-edit">
		<cu-custom isBack bgColor="bg-white text-black"><block slot="content">收货地址</block></cu-custom>
		<view class="container">
			<view class="card bg-white text-lg padding-lr padding-top-xs">
				<view class="flex align-center padding-tb solid-bottom">
					<view class="">姓名：</view>
					<view class="flex-sub"><input @blur="inputBlur" v-model="form.name" class="input" type="text" placeholder="请输入姓名" /></view>
				</view>
				<view class="flex align-center padding-tb solid-bottom">
					<view class="">联系方式：</view>
					<view class="flex-sub">
						<input @blur="inputBlur" v-model="form.phone" @input="phoneInput" :maxlength="11" class="input" type="number" placeholder="请输入联系方式" />
					</view>
				</view>

				<view @click="openAddres" class="flex align-center padding-tb solid-bottom">
					<view class="">地址：</view>
					<view class="flex-sub flex align-center">
						<input v-model="pickerText" disabled class="input flex-sub" type="text" placeholder="请选择地址" />
						<text class="cuIcon-right text-999"></text>
					</view>
				</view>
				<simple-address ref="simpleAddress" :pickerValueDefault="cityPickerValueDefault" @onConfirm="onConfirm" themeColor="#26D499"></simple-address>

				<view class="flex align-center padding-tb solid-bottom">
					<view class="">学校：</view>
					<view v-if="!schoolRange.length" @click="schoolRangeClick" class="flex-sub flex align-center">
						<input v-model="school_name" disabled class="input flex-sub" type="text" placeholder="请选择学校" />
						<text class="cuIcon-right text-999"></text>
					</view>
					<picker v-if="schoolRange.length" :value="schoolIndex" :range="schoolRange" range-key="school_name" @change="schoolChange" class="school-picker">
						<view class="flex-sub flex align-center">
							<input v-model="school_name" disabled class="input flex-sub" type="text" placeholder="请选择学校" />
							<text class="cuIcon-right text-999"></text>
						</view>
					</picker>
				</view>

				<view class="flex align-center padding-tb solid-bottom">
					<view class="">几号楼：</view>
					<view class="flex-sub flex align-center">
						<input @blur="inputBlur" v-model="form.build_no" @input="buildNumberInput" class="input flex-sub" type="text" placeholder="请输入楼号" />
					</view>
				</view>

				<view class="flex padding-tb">
					<view class="">详细地址：</view>
					<view class="flex-sub overflow"><textarea @blur="inputBlur" v-model="form.address" class="textarea flex-sub" placeholder="如：学校，楼号，寝室号" /></view>
				</view>
			</view>
			<view class="btn-wrap padding-xl margin-xl"><button @click="submit" :disabled="!disabled" type="" class="cu-btn bg-green round lg block">提交</button></view>
		</view>
	</view>
</template>

<script>
import simpleAddress from '@/components/simple-address/simple-address.nvue';
import { mapGetters } from 'vuex';

export default {
	components: { simpleAddress },
	data() {
		return {
			cityPickerValueDefault: [0, 0, 1],
			pickerText: '',
			id: '', // 编辑地址id
			form: {
				name: '',
				phone: '',
				province: '',
				city: '',
				district: '',
				build_no: '',
				address: '',
				school_id: '' // 选择学校id
			},
			schoolIndex: 0,
			schoolRange: [],
			school_name: '',

			scrollTopPX: '' //滚动的位置
		};
	},
	computed: {
		...mapGetters(['schoolinfo']),
		disabled() {
			let flag = true;
			for (let key in this.form) {
				if (!this.form[key].trim()) {
					flag = false;
				}
			}
			return flag;
		}
	},
	onLoad(option) {
		if (option.id) {
			this.id = option.id;
			this.form.name = option.name;
			this.form.phone = option.phone;
			this.form.province = option.province;
			this.form.city = option.city;
			this.form.district = option.district;
			this.form.build_no = option.build_no;
			this.form.address = option.address;
			this.form.school_id = option.school_id;
			this.school_name = option.school_name;
			this.pickerText = this.form.province + '-' + this.form.city + '-' + this.form.district;
			if (this.form.province) {
				this.getSchoolRange(this.form.province);
			}
		}
	},
	//监听滚动条滚动的距离
	onPageScroll(res) {
		this.scrollTopPX = res.scrollTop;
	},
	methods: {
		inputBlur() {
			uni.pageScrollTo({
				scrollTop: this.scrollTopPX,
				duration: 0
			});
		},
		// 根据城市选择 学校列表
		getSchoolRange(province) {
			this.$http.post('/api/school/city_school', { city: province }).then(res => {
				if (res.code == 0) {
					this.schoolRange = res.data;
				}
			});
		},
		schoolRangeClick() {
			if (!this.form.province) {
				uni.showToast({
					title: '请先选择地址',
					icon: 'none'
				});
				return;
			}
			if (!this.schoolRange.length) {
				uni.showToast({
					title: '当前地址省份下暂无学校',
					icon: 'none'
				});
				return;
			}
		},

		schoolChange(e) {
			if (!this.form.province) {
				uni.showToast({
					title: '请先选择地址',
					icon: 'none'
				});
				return;
			}
			if (!this.schoolRange.length) {
				uni.showToast({
					title: '当前地址省份下暂无合作学校',
					icon: 'none'
				});
				return;
			}
			if (this.schoolRange[e.detail.value].school_name != this.schoolinfo.school_name) {
				uni.showToast({
					title: '当前定位不是该学校,请切换学校',
					icon: 'none'
				});
				return;
			}
			this.schoolIndex = e.detail.value;
			this.form.school_id = this.schoolRange[e.detail.value].sid.toString();
			this.school_name = this.schoolRange[e.detail.value].school_name;
		},
		openAddres() {
			this.$refs.simpleAddress.open();
		},
		onConfirm(e) {
			this.pickerText = e.label;
			let arr = this.pickerText.split('-');
			this.form.province = arr[0];
			this.form.city = arr[1];
			this.form.district = arr[2];
			this.school_name = '';
			this.form.school_id = '';
			console.log(this.form)
			if (this.form.city) {
				this.getSchoolRange(this.form.province);
			}
		},
		phoneInput(e) {
			let val = e.target.value;
			val = val.replace(/[^\d]/g, '');
			this.form.phone = val;
		},
		buildNumberInput(e) {
			// let val = e.target.value;
			// val = val.replace(/[^\d]/g, '');
			// this.form.build_no = val;
		},
		submit() {
			if (!/^(?:13\d|14\d|15\d|16\d|17\d|18\d|19\d)\d{5}(\d{3}|\*{3})$/.test(this.form.phone)) {
				uni.showToast({
					title: '手机号码格式有误',
					icon: 'none'
				});
				return;
			}
			if (!this.id) {
				this.$http.post('/api/personal/address', this.form).then(res => {
					if (res.code == 0) {
						uni.navigateBack();
					} else uni.showToast({ title: res.msg, icon: 'none' });
				});
			} else {
				this.form.id = this.id;
				this.$http.post('/api/personal/edit_address', this.form).then(res => {
					if (res.code == 0) {
						uni.navigateBack();
					} else uni.showToast({ title: res.msg, icon: 'none' });
				});
			}
		}
	}
};
</script>

<style lang="scss">
page {
	background-color: #fafafa;
}
.address-edit {
	.card {
		box-shadow: 0px 0px 10px 0px rgba(152, 152, 152, 0.1);
		border-radius: 20upx;
		margin: 30upx;
		.input {
			text-align: right;
		}
		.textarea {
			width: 100%;
			height: 120upx;
			text-align: right;
		}
	}
	.cu-btn.lg {
		box-shadow: 0px 2px 10px 0px rgba(38, 212, 153, 0.5);
	}

	.school-picker {
		flex: 1;
	}
}
</style>
