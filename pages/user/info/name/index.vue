<template>
	<view class="page">
		<view class="title">修改昵称</view>
		<view class="input">
			<u-input
				placeholder="请输入内容"
				border="surround"
				v-model="userInfo.name"
				:maxlength="maxlength"
			></u-input>
		</view>
		

		<view class="btn">
			<u-button :loading="loading" @tap="handleSubmit" type="primary" text="确定"></u-button>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	
	export default {
		data() {
			return {
				userInfo: uni.getStorageSync('userInfo'),
				loading:false,
				maxlength:20
			}
		},
		methods:{
			async handleSubmit() {
				const {
					name
				} = this.userInfo
				if(name.length < 2 || name >20 ) {
					this.$refs.uToast.show({
						type: 'warn',
						message: "昵称长度应在2-20之间",
					})
					return 
				}
				this.loading = true
				
				try{
					await uni.$u.http.post('/system/user/edit/name', {name})
					this.$refs.uToast.show({
						type: 'success',
						message: "修改成功",
						complete:() =>{
							uni.setStorageSync('userInfo', this.userInfo)
							this.loading = false
							uni.navigateBack()
						}
					})
				}catch(e){
					//TODO handle the exception
					this.$refs.uToast.show({
						type: 'error',
						message: e.message,
						complete:() =>{
							this.loading = false
						}
					})
				}
				
			},
	
		}
	}
</script>

<style lang="scss" scoped>
	.title {
		color: #666;
		margin:20rpx 20rpx;;
	}
	.input {
		background-color: #fff;
		margin-top: 20rpx
	}
	.btn {
		margin: 60rpx 20rpx 0;
	}
</style>