<template>
	<view class="default-img-prompts">
		<text v-for="item in imgPromptsOptions" @tap="handleClick(item)" :key="item.label" class="item">
			{{item.label}}
		</text>
		<u-toast ref="uToast"></u-toast>
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				imgPromptsOptions: []
			}
		},
		mounted() {
			this.getImgPrompts()
		},
		methods:{
			getImgPrompts() {
				uni.$u.http.get("/chat/imgPrompts")
				.then(res =>{
					this.imgPromptsOptions = res || []
				})
			},
			handleClick(data) {
				this.$emit('select', data)
			}
		}
	}
</script>

<style lang="scss">
	.default-img-prompts {
		display: flex;
		align-items: center;
		flex-wrap: wrap;
		margin-top: 10rpx;
		.item {
			border: 1rpx solid #eee;
			padding: 6rpx 12rpx;
			background: #eee;
			margin: 6rpx;
		}
	}
</style>