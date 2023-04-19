<template>
	<view v-if="visible" class="common-mask">
		<view class="mask-box"></view>
		<div class="btn"><u-button size="small" icon="pause" type="warning" @click="handleStop">停止</u-button></div>
		
	</view>
</template>

<script>
	export default {
		props:{
			visible:{
				type: Boolean,
				default: false
			}
		},
		methods:{
			handleStop() {
				this.$emit("stop")
			}
		}
	}
</script>

<style lang="scss" scoped>
	.common-mask {
		position: fixed;
		width: 100vw;
		height: 100vh;
		z-index: 20;
		display: flex;
		align-items: center;
		justify-content: center;
		top: 0;
		left: 0;
		.mask-box {
			background-color: rgba(0,0,0,0.20);
			width: 100%;
			height: 100%;
			position: absolute;
			left: 0;
			top: 0;
		}
		.btn {
			width: 150rpx;
		
		}
	}
</style>