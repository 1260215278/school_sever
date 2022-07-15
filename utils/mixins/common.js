import {
	mapGetters,
	mapActions
} from 'vuex';
import loginModal from '@/components/login/login-modal.vue'

export default {
	components: {
		loginModal
	},
	data() {
		return {}
	},
	computed: {
		...mapGetters(['loginModal']),
	},
	methods: {
		...mapActions(['setLoginModal'])
	}
}
