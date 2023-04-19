<template>
	<view class=".info-page">
		<view class="center">
			<div class="title">
				免费额度
			</div>
			<view class="list">
				<view class="p">
					新注册的用户, 直接拥有5点额度。
				</view>
				<view class="p">
					在本小程序的任何地方, 每天都可以通过右上角分享来获得5点额度。
				</view>
				<view class="p">
					成功获得额度后, 需等待24小时后, 才能再次分享获得新的免费额度
				</view>
			</view>
			<div class="title">购买额度</div>
			<u-grid :border="true">
				<u-grid-item v-for="item in baseList" :key="item.value">
					<text>{{item.lebel}}</text>
					
					<text class="grid-text">{{item.value}}</text>
				</u-grid-item>
			</u-grid>
			
			<view class="title">
				充值流程
			</view>
			<view class="list">
				<view class="p">
					1. 在小程序中<text class="bold">我的</text>-<text class="bold">个人信息</text>页面，长按复制<text class="bold">唯一ID</text>
				</view>
				<view class="p">
					<text>2. 通过赞赏码付款，或者添加开发者微信, 付款时需提供<text class="bold">唯一ID</text>和希望购买的额度</text>
					
					<view class="img-box">
						<image style="width: 500rpx;height: 500rpx;" :show-menu-by-longpress="true" :src="`${baseURL}${commonStaticPath}/赞赏码.png`" mode=""></image>
					</view>
					<view class="img-box">
						<image  :show-menu-by-longpress="true" :src="`${baseURL}${commonStaticPath}/开发者微信.jpg`" mode=""></image>
					</view>
				</view>
				
			</view>
		</view>
		<u-toast ref="uToast"></u-toast>
	</view>
</template>

<script>
	
	import { quotaOptions } from "@/config/vip.js"
	export default {
		data() {
			return {
				baseList: quotaOptions
			}
		},
		
	}
</script>

<style lang="scss" scoped>
	
</style>