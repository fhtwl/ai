<template>
  <view class="login">
    <!-- 微信小程序登录 -->
    <view class="login-wechat" v-show="type == 'miniprogram'">
      <!-- 内容区域 -->
      <view class="login-wechat__wrapper">
        <view class="login-wechat__sub-img">
          <image src="/static/login.png"></image>
        </view>
        <!-- 标题 -->
        <view class="login-wechat__title">授权登录</view>
        <!-- tips -->
        <view class="login-wechat__sub-title"> 一键授权登录，完整功能体验 </view>
        <!-- 保存按钮 -->
        <view class="login-wechat__submit-btn" @tap="getLoginCode"> 一 键 登 录 </view>
      </view>
    </view>
    <!-- 微信授权头像昵称 -->
    <wx-user-info-modal v-model="userInfoShow" :currentUserInfo="userInfo" @updated="updatedUserInfo" />
		<u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import requestConfig from '@/config/request.js'
import WxUserInfoModal from '@/uni_modules/tuniaoui-wx-user-info/components/tuniaoui-wx-user-info/tuniaoui-wx-user-info.vue'
import socket from '../../config/socket'

export default {
  data() {
    return {
      type: '',
      nickname: '',
      password: '',
      passwordV: '',
      userInfoShow: false,
      userInfo: {
        avatar: '',
        nickname: '',
      },
    }
  },
  components: {
    WxUserInfoModal,
  },
  onLoad(e) {
    this.type = e.type
  },
  methods: {
    // 获取code
    getLoginCode() {
      uni.login({
        success: (e) => {
          this.login(e)
        },
      })
    },
    // 微信登录
    async login(res) {
      uni.showLoading({
        title: '登录中',
      })
			
      if (res.code && ['login:ok'].includes(res.errMsg)) {
        const data = await uni.$u.http.post('/system/auth/login', {
          code: res.code,
        })
				uni.hideLoading()
				uni.showToast({
				  title: '登录成功',
				  icon: 'none',
				})
        uni.setStorageSync('token', data)
        socket.connectSocketInit()
        const userInfo = await uni.$u.http.get('/system/user/query')
       
        uni.setStorageSync('userInfo', userInfo)
        
        uni.navigateBack()
      } else {
        //异常处理，再次发起请求或者抛出异常
        // .....
        uni.hideLoading()
        uni.showToast({
          title: '登录失败，请重试',
          icon: 'none',
        })
      }
    },
  },
}
</script>

<style lang="scss">
.login {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  &-account {
    width: 600rpx;

    &-header {
      padding: 200rpx 0 70rpx 0;

      font-weight: bold;

      .hello {
        font-size: 50rpx;
        font-weight: 500;
        display: flex;
        align-items: center;
      }
    }

    &-content {
      input {
        border: 0;
        color: #333;
        line-height: 70rpx;
        border-bottom: 1px solid #dfdee4;
        margin-top: 30rpx;
        padding-bottom: 20rpx;
      }

      .placeholder {
        color: #c0c3cb;
        font-size: 32rpx;
      }

      &-tip {
        font-size: 28rpx;
        margin: 25rpx 0 0 0rpx;
        &.link {
          color: $uni-color-primary;
        }
      }

      button {
        margin-top: 50rpx;
        height: 80rpx;
        background: $uni-color-primary;
        color: #fff;
        border-radius: 45rpx;
        font-size: 32rpx;
        line-height: 80rpx;
      }
    }

    &-footer {
    }
  }

  &-wechat {
    padding: 200rpx 0 0 0;
    width: 600rpx;

    /* title */
    &__title {
      font-size: 34rpx;
    }

    /* sub-title */
    &__sub-title {
      font-size: 26rpx;
      color: #aaaaaa;
      margin-top: 16rpx;
      padding-bottom: 30rpx;
    }

    /* sub-img */
    &__sub-img {
      text-align: center;

      image {
        width: 300rpx;
        height: 300rpx;
      }
    }

    /* 保存按钮 */
    &__submit-btn {
      background-color: $uni-color-primary;
      color: #ffffff;
      margin-top: 30rpx;
      border-radius: 10rpx;
      padding: 25rpx;
      font-size: 32rpx;
      display: flex;
      align-items: center;
      justify-content: center;

      &.disabled {
        background-color: #e6e6e6;
      }
    }
  }
}
</style>
