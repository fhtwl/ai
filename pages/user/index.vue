<template>
  <view class="user">
    <view class="user-head">

      <u-avatar :size="60" :scr="userInfo.avatar"></u-avatar>
      <view @tap="handleGoInfo" class="u-m-l-40 u-w-200 u-flex-1" v-if="isLogin">
        <view class="name">{{ userInfo.name }}</view>
        <view class="vip">
				<text class="vip-label">
					{{ getVipById(userInfo.vip).label }}
				</text> 
				<text class="quota">
					{{
					    userInfo.vip === 1
					      ? "会员不限次数"
					      : `剩余额度: ${userInfo.quota || 0}`
					  }}
				</text>
				</view>
     
				
      </view>
      <view class="u-m-l-40 u-w-200 u-flex-1" v-else @tap="login">
        <view>登录</view>
        <view class="u-m-t-20 u-font-24 u-content-color">登录即可享受完整体验 </view>
      </view>
      <view v-if="isLogin" @tap="handleGoInfo">
        <u-icon name="arrow-right" color="#000" size="20"></u-icon>

      </view>
    </view>
    <!-- <view class="user-vip u-flex u-flex-between u-flex-y-center" v-if="isLogin">
			<view class="user-vip__position--left">
				<view>会员中心</view>
				<view class="u-m-t-20 u-font-24 ">{{
          userInfo.expireTime
            ? `到期时间: ${userInfo.expireTime}`
            : "会员不限次数"
        }}</view>
			</view>
			<u-button customStyle="width: 200rpx;" type="primary" shape="circle"
				:text="userInfo.expireTime ? '续费会员' : '开通会员'" @tap="handleGoVip"></u-button>
		</view> -->
   <view class="group">
      <u-cell-group  >
        <u-cell
          :title="item.title"
          :isLink="item.isLink"
          :icon="item.icon"
					:value="item.value"
          v-for="item in list"
          :key="item.id"
          :url="item.url"
        >
				</u-cell>

      </u-cell-group>
    </view>
		<u-toast ref="uToast"></u-toast>
    <tabbar ref="tabBar" />
  </view>
</template>

<script>
import { login } from '@/config/login.js'
import { getVipById } from '@/config/vip.js'
import { getSystemInfo } from "@/config/system.js"
export default {
  data() {
    return {
      userInfo: uni.getStorageSync('userInfo') ||{},
      isLogin: false,
			version: '1.0.3'
    }
  },
  onLoad() {
		const {
			version
		} = getSystemInfo()
		this.version = version
	},
  onShow() {
    this.getUserInfo()
    this.$nextTick(() => {
      this.$refs.tabBar.setTabbar()
    })
    this.isLogin = uni.getStorageSync('token') ? true : false
		console.log(this.isLogin)
  },
  methods: {
    getVipById,
		handleGoVip() {
			uni.navigateTo({
				url: '/pages/user/vip/index'
			})
		},
		handleGoInfo() {
			uni.navigateTo({
				url: '/pages/user/info/index'
			})
		},
    go(e) {
      uni.$u.route(e)
    },
    async getUserInfo() {
      this.userInfo = await uni.$u.http.get('/system/user/query')
			uni.setStorageSync('userInfo', this.userInfo)
    },
    login() {
      // uni.navigateTo({
      //   url: "/pages/login/index?type=miniprogram",
      // });
      login(200, () => {
				this.isLogin = uni.getStorageSync('token') ? true : false
			})
    },
    async getList() {
      const { data } = await uni.$u.http.post('/app/renovation/user/menu/list')
      this.list = data.data
    },

  },
		
	computed:{
		list() {
			return [
				{
					title: '历史记录',
					id: 'histroy',
					url: "/pages/user/history/index",
					isLink: true,
					icon: 'clock'
				},
				{
					title: '提升额度',
					id: 'quota',
					url: "/pages/user/info/quota/index",
					isLink: true,
					icon: 'kefu-ermai'
				},
				{
					title: '关于',
					id: 'about',
					url: "/pages/user/about/index",
					isLink: true,
					icon: 'info',
					value: `版本${this.version}`
				},
		
				// {
				// 	title:'退出登录',
				// 	id: 'about',
				// 	url: "/pages/user/about/index"
				// }
			]
		}
	}
}
</script>

<style lang="scss" scoped>
.user {
	background-color: #f5f5f5;
	height: 100vh;
  &-head {
    /* 顶部背景图 start */
    padding: 100rpx 40rpx 0 40rpx;
    box-sizing: border-box;
    height: 450rpx;
    display: flex;
    align-items: center;
		background-color: #fff;
		margin-bottom: 20rpx;

		.name {
			font-size: 50rpx;
			font-weight: bold;
			color: #000;
		}
		.vip {
			margin-top: 20rpx;
			color: #444;
			padding-bottom: 16rpx;
			.vip-label {
				background: $uni-color-primary;
				border-radius: 20rpx;
				padding: 4rpx 10rpx;
				color: #fff;
				margin-right: 10rpx;
			}
		}
		.quota {
			color: #444;
		}
  
  }

  &-vip {
    display: flex;
    margin: 20rpx;
    padding: 20rpx;
    height: 160rpx;
    margin-top: -100rpx;
    border-radius: 20rpx;
    align-items: center;

    background: linear-gradient(-120deg, #3e445a, #31374a, #2b3042, #262b3c);

    &__position--left {
      display: flex;
      flex-direction: column;
      justify-content: center;
      margin-left: 20rpx;
      color: #fff;
      width: 500rpx;
    }
  }
	
	.group {
		background-color: #fff;
		margin-bottom: 20rpx;
	}
}
</style>
