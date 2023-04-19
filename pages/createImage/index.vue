<template>
  <view class="container">
    <view class="bg"></view>
    <view class="form">
      <view class="header">
        <view class="title">AI绘画-根据文本生成图像</view>
      </view>
      <u-transition :show="true" mode="fade-left">
        <view class="panel">
          <view class="head">
            <view class="title">请填写您对图像的描述</view>
          </view>
          <view class="textarea">
            <u--textarea
              height="140"
              v-model="problem"
              placeholder="生成时间大概6-40s，请耐心等待"
              confirm-type="send"
            >
            </u--textarea>
          </view>
          <view class="btn-group">
            <u-button
              iconColor="#ffffff"
              type="primary"
              icon="edit-pen"
              :loading="loading"
              :text="loading ? '正在生成图片' : '生成图片'"
              @tap="getAnswer"
            ></u-button>
          </view>
        </view>
      </u-transition>
      <defaultImgPrompts @select="handleSelectImgPrompts" />
      <u-transition :show="answer" mode="fade-left">
        <view class="panel">
          <view class="head">
            <view class="title">结果</view>
            <view class="tips"></view>
          </view>
          <view class="textarea">
            <!-- <u--textarea
              height="140"
              :value="answer"
              placeholder="支持可复制您的答案"
              confirm-type="send"
            >
            </u--textarea> -->
            <u-image width="100%" :src="answer"></u-image>
          </view>
          <!-- <view class="btn-group">
            <view class="btn get" style="width: 100%">
              <u-button
                iconColor="#ffffff"
                color="#0071ff"
                icon="download"
                text="分享图片"
                @tap="copy"
              >
              </u-button>
            </view>
          </view> -->
        </view>
      </u-transition>
    </view>
		<u-toast ref="uToast"></u-toast>
    <tabbar ref="tabBar" />
  </view>
</template>

<script>
import defaultImgPrompts from './defaultImgPrompts'
export default {
  components: { defaultImgPrompts },
  data() {
    return {
      problem: '',
      answer: '',
      show: false,
      key: '',
      loading: false,
    }
  },
  onShow() {
    this.$nextTick(() => {
      this.$refs.tabBar.setTabbar()
    })
  },
  methods: {
		
    handleSelectImgPrompts(data) {
      this.problem = data.value
    },
    // 获取问题答案
    async getAnswer() {
      if (this.loading) {
        return
      }
      // uni.showToast({
      //   title: 'AI绘画次数已耗尽,请明日再来!',
      //   icon: 'none',
      // })
      // return
      if (this.problem == "清除记忆") {
        this.next();
        return;
      }
      if (!this.problem) {
        uni.showToast({
          title: "你还没有输入描述呢！",
          icon: "none",
        });
        return;
      }
      const userInfo = uni.getStorageSync('userInfo')
      if(userInfo.quota <=0 ) {
      	uni.showToast({
      	  title: '今日次数已耗尽,请明日再来!',
      	  icon: 'none',
      	})
      	return
      }

      this.loading = true;

      try {
        const data = await uni.$u.http.post(
          "/chat/createImage",
          {
            prompt: this.problem,
            n: 1,
      			size: '512x512',
      			response_format: 'b64_json'
          },
          {
            timeout: 400000, // 由于接口请求时间较长
          }
        );
      	this.loading = false;
      	if(data.message) {
      		uni.showToast({
      			title: data.message,
      			icon: 'none'
      		})
      		return
      	}
      	this.answer = `data:image/png;base64,${data[0].base64}`
      	// uni.setStorageSync('createImgNum', createImgNum + 1)
      	uni.setStorageSync('userInfo', {
      		...userInfo,
      		quota:userInfo.quota - 1
      	})

      } catch (e) {
        this.answer = e;
      	uni.showToast({
      		title: "描述可能涉及敏感词汇，请重试",
      		icon: 'none'
      	})
      	this.loading = false;
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.share {
  position: fixed;
  right: 40rpx;
  bottom: 120rpx;
  width: 40%;

  .u-button {
    box-shadow: 0rpx 10rpx 10rpx #eee !important;
  }
}

.tool {
  width: 90%;
  margin: 15rpx auto;

  .header {
    .title {
      margin-bottom: 30rpx;
    }
  }

  .grid {
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: space-between;

    .item {
      width: 30%;
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: #f0faf8;
      margin: 15rpx 0rpx;
      padding: 30rpx 0rpx;
      border-radius: 10rpx;

      .title {
        color: #1b2b20;
        margin-top: 15rpx;
      }

      .desc {
        color: #67776c;
        font-size: 24rpx;
      }
    }
  }
}

.alert {
  width: 90%;
  margin: 30rpx auto;
}

.form {
  width: 90%;
  margin: 0 auto;
  z-index: 999;

  .header {
    margin-bottom: 30rpx;

    .title {
      text-align: center;
      color: #fff;
      margin: 30rpx 0rpx;
    }
  }

  .panel {
    padding: 30rpx;
    background-color: #fff;
    border-radius: 15rpx;
    box-shadow: 0rpx 10rpx 10rpx #eee;

    .head {
      display: flex;
      flex-direction: row;
      justify-content: space-between;

      .tips {
        color: #dd6161;
      }
    }

    .textarea {
      margin-top: 30rpx;
    }
  }
}

.btn-group {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 30rpx;

  .paste {
    width: 40%;
  }

  .get {
    width: 56%;
  }
}

.bg {
  position: fixed;
  top: 0rpx;
  left: 0rpx;
  width: 100%;
  background-color: $uni-color-primary;
  min-height: 200rpx;
  border-radius: 0rpx 0rpx 140rpx 140rpx;
  z-index: -1;
}
</style>
