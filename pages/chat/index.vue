<template>
  <view class="chat">
    <view class="chat-item" v-for="(item, index) in chat" :key="index">
      <!-- 机器人消息 -->
      <u-transition :show="true" mode="fade-left" v-if="item.name == 'system'">
        <view class="chat-item__left u-flex">
          <u-avatar size="30" :src="robot.img || '/static/ai-chat.png'" shape="square"></u-avatar>
          <view class="chat-item__left-right">
            <!--    <view class="chat-item__left-name">
              {{ robot.name || '智能AI' }}
            </view> -->
            <view class="chat-item__left-bottom">
              <view
                class="chat-item__left-message"
                @longtap="copy(item.message)"
                style="background-color: #f5f5f5; color: #333; white-space: pre-line"
              >
                <!-- <u-parse class="message" @error="e =>console.log(e)" :content="item.message || '思考中...'"></u-parse> -->
                {{ item.message || '思考中...' }}
                <!-- <mp-html :content="item.message || '思考中...'" /> -->
                <!-- {{ item.message || '思考中...' }} -->
              </view>
              <u-loading-icon v-if="item.status == 'loading'"></u-loading-icon>
              <u-icon @tap="handleErrorClick(index)" v-if="item.status == 'error'" name="error"></u-icon>
              <view style="margin-top: auto">
                <u-icon v-if="item.status == 'success'" @tap="copy(item.message)" name="file-text"> </u-icon>
              </view>
            </view>
          </view>
        </view>
      </u-transition>
      <!-- 我的消息  -->
      <u-transition :show="true" mode="fade-right" v-else>
        <view class="chat-item__right">
          <view class="">
            <view class="chat-item__right-message primary-bg" style="color: #fff" @longtap="copy(item.problem)">
              {{ item.message }}
            </view>
          </view>
          <u-avatar size="30" shape="square" :src="userInfo.avatar"></u-avatar>
        </view>
      </u-transition>
    </view>

    <!-- 占位用的 -->
    <view style="padding: 35rpx; opacity: 0">
      <view>
        <textarea disabled style="color: #fff" auto-height v-model="problem"></textarea>
      </view>
      <view class="bottom" :class="{ open2: open_set }" style="background-color: transparent; border-top: none"> </view>
      <view style="background-color: #f8f8f8" :style="{ height: Height + 'px' }"></view>
    </view>

    <view
      class="send"
      :class="{
        isTabbar: tabbar.length > 1,
      }"
    >
      <view class="send-line">
        <view class="send-line-empty" @tap="next">
          <image src="../../static/menu/empty.png"></image>
        </view>
        <view class="send-line-input" :class="{ BigInput: problem.length == 0 }">
          <textarea
            :adjust-position="false"
            @focus="foucus"
            @blur="blur"
            :show-confirm-bar="false"
            auto-height
            v-model="problem"
          ></textarea>
        </view>

        <view class="send-line-button" @tap="getAnswer" v-if="problem.length > 0">发送</view>
      </view>
      <view style="background-color: #f8f8f8; transition: all 0.1s" :style="{ height: Height + 'px' }"></view>
      <view class="send-operation" :class="{ open2: open_set }">
        <view
          v-for="item in list"
          :key="item.id"
          class="send-operation-item"
          @tap="go(item.url)"
          style="position: relative"
        >
          <view class="send-operation-item-icon" v-show="item.badge">{{ item.badge }}</view>
          <view class="send-operation-item-img">
            <image :src="item.icon"></image>
          </view>
          <view class="send-operation-item-name">{{ item.title }}</view>
        </view>
      </view>
    </view>
    <tabbar ref="tabBar" />
    <!-- <mask :visible="loading" @stop="handleStopClick"  /> -->
    <u-toast ref="uToast"></u-toast>
  </view>
</template>

<script>
import { createParser } from 'eventsource-parser'
import { baseURL, API_PREFIX } from '@/config/request.js'
import socket from '@/config/socket.js'
import { login } from '@/config/login.js'
import { filterWords } from '@/config/filter.js'
import mask from '@/components/mask.vue'

export default {
  components: { mask },
  data() {
    return {
      list: [],
      robot: {},
      problem: '',
      open_set: false,
      show: false,
      start_show: true,
      is_fouces: false,
      Height: 0, // 键盘高度
      userInfo: uni.getStorageSync('userInfo') || {},
      tabbar: uni.getStorageSync('tabbar') || [],
      chat: uni.getStorageSync('chat') || [],
      userInfo: {},
      loading: false, // 是否正在请求
    }
  },

  onLoad(e) {
    this.problem = e.problem || ''
    // this.getSession()
    this.toBottom()
    // this.chat = [
    //   {
    //     name: 'system',
    //     status: 'success',
    //     message:``
    //  },
    // ]
  },
  onShow() {
    this.$nextTick(() => {
      this.$refs.tabBar.setTabbar()
    })
    this.robot = uni.getStorageSync('robot') || {}
    this.tabbar = uni.getStorageSync('tabbar') || []
    this.chat = uni.getStorageSync('chat') || []
    this.userInfo = uni.getStorageSync('userInfo') || {}
    this.initSocket()
  },
  methods: {
    initSocket() {
      socket.on('open', () => {})
      socket.on('message', (msg) => {
        const { type, data } = msg
        const index = this.chat.length - 1
        switch (type) {
          case 'line': {
            this.updateChat(data, index)
            break
          }
          case 'finish': {
            this.$set(this.chat, index, {
              name: 'system',
              message: this.chat[index].message,
              status: 'success',
            })
            console.log(this.chat[index].message)
            uni.setStorageSync('chat', this.chat)
            this.toBottom()

            this.loading = false
            break
          }

          case 'line-error': {
            this.$set(this.chat, index, {
              name: 'system',
              message: data,
              status: 'error',
            })
            console.log('line-error', data)
            uni.setStorageSync('chat', this.chat)
            this.toBottom()

            this.loading = false
            break
          }
          case 'updateQuota': {
            uni.setStorageSync('userInfo', {
              ...uni.getStorageSync('userInfo'),
              quota: data,
            })
            break
          }
          default:
            break
        }
      })
    },
    handleStopClick() {
      socket.send({
        type: 'abort',
      })
    },
    requestMsg(newChat) {
      const userInfo = uni.getStorageSync('userInfo')
      const length = newChat.length
      if (length > 4) {
        newChat = newChat.splice(length - 5, length - 1)
      }
      const body = {
        messages: newChat.map((message) => {
          return {
            role: message.name,
            content: message.message,
          }
        }),
        max_tokens: 250,
        model: 'gpt-3.5-turbo',
        presence_penalty: 0,
        stream: true,
      }
      socket.send(
        {
          type: 'message',
          body,
        },
        () => {
          this.loading = true
        }
      )
    },
    handleErrorClick(index) {
      uni.showModal({
        title: '提示',
        content: '是否重试?',
        success: () => {
          this.$set(this.chat, index, {
            name: 'system',
            message: '',
            status: 'loading',
          })
          const newChat = [...this.chat.slice(0, this.chat.length - 2)]
          this.toBottom()
          this.requestMsg(newChat)
        },
        fail() {},
      })
    },
    // 复制
    copy(val) {
      uni.setClipboardData({
        data: this.answer || val,
        success: function () {
          uni.showToast({
            title: '复制成功',
            icon: 'none',
          })
        },
      })
    },
    go(e) {
      uni.$u.route(e)
    },
    // 下个问题
    next() {
      uni.removeStorageSync('chat')
      this.chat = []
      uni.showToast({
        title: '记忆已经清除！',
      })
    },
    async getSession() {
      let { data } = await uni.$u.http.get('/chat/session')
      console.log(data)
    },
    // 滚动到最底部
    toBottom() {
      this.$nextTick(() => {
        uni.pageScrollTo({
          scrollTop: 9999,
          duration: 300,
        })
      })
    },
    updateChat(content, index) {
      // console.log('updateChat', content)
      const message = content // .replaceAll('\n', `\↵\n`) //.replaceAll('\n', `<br>`)
      // console.log(message.indexOf('\n'),content.indexOf('↵'))
      this.$set(this.chat, index, {
        name: 'system',
        message,
        // xx: content,
        status: 'loading',
      })
      // console.log(content)
      this.$nextTick(() => {
        this.toBottom()
      })
    },
    // 获取问题答案
    async getAnswer() {
      if (!socket.isOpen) {
        uni.showToast({
          title: '正在连接，请稍后重试',
          icon: 'none',
        })
        if (!socket.isOpen) {
          this.initSocket()
        }
        return
      }

      if (this.problem == '清除记忆') {
        this.next()
        return
      }
      if (!this.problem) {
        uni.showToast({
          title: '你还没有输入问题呢！',
          icon: 'none',
        })
        return
      }
      const problem = filterWords(this.problem)
      if (typeof problem === 'object' && problem.type === 'sensitive') {
        uni.showToast({
          icon: 'none',
          title: problem.msg,
        })
        return
      }
      const isLogin = uni.getStorageSync('token') ? true : false
      if (!isLogin) {
        uni.showToast({
          title: '请先登录',
          icon: 'none',
        })
        login()
        return
      }
      if (uni.getStorageSync('userInfo').quota <= 0) {
        uni.showToast({
          title: '今日次数已耗尽,请明日再来!',
          icon: 'none',
        })
        return
      }
      const newChat = [
        ...this.chat,
        {
          name: 'user',
          message: this.problem,
          status: 'success',
        },
      ]
      this.chat = [
        ...newChat,
        {
          name: 'system',
          message: '',
          status: 'loading',
        },
      ]
      let index = this.chat.length - 1
      this.problem = ''
      this.toBottom()
      this.requestMsg(newChat)
    },

    foucus(e) {
      this.Height = e.target.height
      this.open_set = false
      this.is_fouces = true
    },
    blur(e) {
      this.Height = 0
      this.is_fouces = false
    },
  },
}
</script>

<style lang="scss" scoped>
.chat {
  padding: 20rpx;
  box-sizing: border-box;

  &-item {
    &__left {
      display: flex;
      margin-top: 30rpx;

      &-right {
        margin-left: 20rpx;
      }

      &-name {
        font-size: 24rpx;
      }

      &-message {
        // margin-top: 10rpx;
        padding: 20rpx;
        border-radius: 10rpx;
        font-size: 28rpx;
        color: #fff;
        margin-right: 20rpx;
        line-height: 40rpx;
        max-width: 70vw;
      }

      &-bottom {
        display: flex;
      }
    }

    &__right {
      display: flex;
      margin-top: 30rpx;
      justify-content: flex-end;

      &-message {
        margin-right: 20rpx;
        padding: 20rpx;
        border-radius: 10rpx;
        font-size: 28rpx;
      }
    }
  }
}

.send {
  position: fixed;
  height: auto;
  // bottom: 100rpx;
  left: 0;
  bottom: var(--window-bottom, 0);

  &.isTabbar {
    bottom: 100rpx !important;
  }

  &-line {
    z-index: 99;
    display: flex;
    align-items: center;
    background: #f8f8f8;
    width: 750rpx;
    padding: 20rpx;
    box-sizing: border-box;
    justify-content: space-between;

    &-empty {
      background: $uni-color-primary;
      width: 60rpx;
      height: 60rpx;
      min-width: 60rpx;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;

      image {
        width: 40rpx;
        height: 40rpx;
      }
    }

    &-input {
      width: 500rpx;
      height: auto;
      display: flex;
      border-radius: 4rpx;
      margin-left: 20rpx;
      padding: 6rpx 20rpx;
      background-color: #ffffff;
      box-sizing: border-box;
      justify-content: space-between;

      textarea {
        width: 450rpx;
        margin-top: 7.5rpx;
        line-height: 50rpx;
        font-size: 32rpx;
      }

      transition: all 0.3s;

      &.BigInput {
        flex: 1;
        // padding-right: 130rpx;
      }

      &-icon {
        width: 60rpx;
        height: 60rpx;
        display: flex;
        position: relative;
        justify-content: center;
        align-items: center;
        color: #fff;

        image {
          height: 45rpx;
          width: 45rpx;
        }

        transition: transform 0.3s;
      }
    }

    &-button {
      margin-left: 20rpx;
      width: 100rpx;
      min-width: 100rpx;
      height: 76rpx;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: $uni-color-primary;
      color: #fff;
      border-radius: 4rpx;
      font-size: 26rpx;
    }
  }

  .open1 {
    transform: rotate(225deg);
  }

  &-operation {
    overflow: hidden;
    height: 0;
    width: 750rpx;
    transition: height 0.3s;
    background: #f8f8f8;
    display: flex;
    align-items: center;
    // justify-content: space-around;
    flex-wrap: wrap;

    &-item {
      width: 25%;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 55rpx 0;

      &-img {
        background-color: #fff;
        border-radius: 25rpx;
        height: 110rpx;
        width: 110rpx;
        color: #717171;
        display: flex;
        align-items: center;
        justify-content: center;

        image {
          width: 55rpx;
          height: 55rpx;
        }
      }

      &-name {
        font-size: 24rpx;
        margin-top: 15rpx;
      }

      &-icon {
        position: absolute;
        background-color: #f50e0e;
        color: #ffeeee;
        border-radius: 8rpx;
        padding: 5rpx 10rpx;
        top: 50rpx;
        font-size: 24rpx;
        right: 10rpx;
        transform: scale(0.7);
      }
    }
  }
}

.open2 {
  border-top: 1px solid #e6e6e6;
  min-height: 260rpx;
  height: auto;
}
.message {
  white-space: pre-line;
  uni-view {
    white-space: pre-line;
  }
}
.avatar {
  width: 30rpx;
  height: 30rpx;
}
</style>
