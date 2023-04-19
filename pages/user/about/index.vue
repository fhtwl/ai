<template>
  <view class=".info-page">
		
		<view class="list">
			<view class="img-box">
				<img style="width: 72rpx;height: 72rpx;margin-top: 20rpx" src="/static/ai-chat.png" alt="" srcset="">
			</view>
		</view>
  		<div class="title">
  			关于{{systemInfo.appName}}
  		</div>
  		<view class="list">
  			<view class="p">
  				<text class="bold">{{systemInfo.appName}}</text>是一个基于大语言模型和潜在扩散模型的小程序,主要功能包括AI聊天和AI绘画等。 
  			</view>
  		</view>
  		<div class="title">关于额度</div>
			<view class="list">
				<view class="p">
					为了服务的持续, 需要AI聊天和AI绘画需要使用<text class="bold">额度</text>才能运行。
				</view>
				<view class="p">
					新注册的用户, 直接拥有5点额度。
				</view>
				<view class="p">
					在本小程序的任何地方, 每天都可以通过右上角分享来获得5点额度。
				</view>
				<view class="p">
					成功获得额度后, 需等待24小时后, 才能再次分享获得新的免费额度
				</view>
				<view class="p">
					除此之外, 您还可以通过充值获取更多的额度, 具体方案如下:
					<u-grid border>
						<u-grid-item v-for="item in baseList" :key="item.value">
							<text>{{item.lebel}}</text>
							
							<text class="grid-text">{{item.value}}</text>
						</u-grid-item>
					</u-grid>
				</view>
			</view>
			
  		
  		
  		<view class="title">
  			关于开发者
  		</view>
  		<view class="list">
  			<view class="p">
  				非感谢您使用本产品。
  			</view>
  			<view class="p">
  				<text>在使用中, 如果遇到问题, 欢迎联系我, 我会尽快为您处理。</text>
  				
  			</view>
				<view class="p">
					下面是我的联系方式
				</view>
				<view class="p" style="display: flex;">
					<u-icon name="email"></u-icon><u-tooltip text="15927027721@163.com"></u-tooltip>
					
				</view>
				<view class="p">
					<view class="img-box">
						<image show-menu-by-longpress src="https://static.fhtwl.cc/logo/%E5%BC%80%E5%8F%91%E8%80%85%E5%BE%AE%E4%BF%A1.jpg" mode=""></image>
					</view>
				</view>
  			
  		</view>
  	<u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
	import { quotaOptions } from "@/config/vip.js"
	import { getSystemInfo } from "@/config/system.js"
export default {
  data() {
		return {
			systemInfo: {
				appName: 'charTalkBots',
				
			},
			baseList: quotaOptions
		}
	},
	onLoad() {
		this.systemInfo = {
			...systemInfo,
			...getSystemInfo()
		}
	}
}
</script>

<style lang="scss" scoped>

</style>
