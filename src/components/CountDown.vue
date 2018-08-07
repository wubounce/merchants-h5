<template>
	<span>{{ str }}</span>
</template>

<script>
/**
 * 倒计时组件
 * props
 *   time: 倒计时时间, 单位s
 *   type: 风格 1：秒，2：xx时xx秒xx分，3
 */
import moment from 'moment';
import { formatDuration } from '@/utils/tool';

export default {
	name: 'component-count-down',
	props: ['time', 'type'],
	data() {
		return {
			min : this.time,
		};
	},
	created() {
		this.startCountDown();
	},
	beforeDestroy() {
		clearInterval(this.timer);
		this.timer = null;
	},
	methods: {
		// 开始倒计时
		startCountDown() {
//			console.log(this.min)
			if (this.min <= 0) {
				this.$emit('finish');
				return false;
			}
			this.timer = setInterval(() => {
				this.min--;
				if(this.min <= 0) {
					clearInterval(this.timer);
					this.timer = null;
					this.$emit('finish');
				}
			}, 1000);
		}
	},
	computed: {
		str () {
			switch (this.type) {
				case 1:
					// 风格1：直接返回秒
					return this.min;
					break; 
				case 2:
					// 风格2: 返回00:00:00格式
					return formatDuration(this.min);
					break;
				default:
					return this.min;
					break; 
			}
		}
	},
	watch: {
		time (v) {
			this.min = v;
			clearInterval(this.timer);
			this.startCountDown();
		}
	}
};
</script>

<style lang="scss" scoped>
	
</style>