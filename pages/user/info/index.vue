<template>
	<view class="container">
		<u-cell-group>
			<u-cell icon="account" title="昵称" :value="userInfo.name" isLink url="/pages/user/info/name/index"></u-cell>
			
			<u-cell icon="rmb" title="剩余额度" :value="String(userInfo.quota)" isLink url="/pages/user/info/quota/index"></u-cell>
			<u-cell icon="share" title="右上角分享获得免费额度" :label="shareTime && `${shareTime}后可重新获取`" ></u-cell>
			<u-cell icon="integral" title="会员" :value="vip"></u-cell>
			<u-cell icon="lock-fill" title="唯一ID">
				<view slot="value">
					<u-tooltip @tap="copy" :text="`${userInfo.id}`" overlay></u-tooltip>
				</view>
			</u-cell>
		</u-cell-group>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	import {
		getVipById
	} from '@/config/vip.js'
	import { timeDiff } from "@/common/utils.js"
	let timer 
	
	export default {
		data() {
			return {
				userInfo: uni.getStorageSync('userInfo'),
				shareTime:''
			}
		},
		onShow() {
			console.log('12')
			this.init()
		},
		onHide() {
			clearInterval(timer)
		},
		methods: {
			init() {
				console.log('userinfo', uni.getStorageSync('userInfo'))
				this.userInfo = uni.getStorageSync('userInfo')
				const getDate = () => {
					const shareTime = new Date(this.userInfo.shareTime).getTime() + 1000 * 60 * 60 *24
					if(shareTime < new Date().getTime()) {
						this.shareTime = false
					}
					else {
						this.shareTime =  timeDiff(new Date(shareTime))
					}
					
				}
				
				const timer = setInterval(getDate, 1000)
			},
			// 复制
			copy(data) {
				console.log(data)
				uni.setClipboardData({
					data,
					success: function() {
						uni.showToast({
							title: '复制成功',
							icon: 'none',
						})
					},
					fail(err) {
						console.log(err)
					}
				})
			},

		},
		computed: {
			vip() {
				return getVipById(this.userInfo.vip).label
			},
		}
	}
</script>

<style lang="scss" scoped>
	.container {
		background-color: #fff;
	}
</style>