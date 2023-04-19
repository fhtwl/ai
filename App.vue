<script>
import { login } from './config/login.js'
import socket from './config/socket.js'

export default {
  onLaunch: function () {
		
		console.log(1)
    this.getTabbar()
    uni.hideTabBar(); // 隐藏tabbar
		uni.showShareMenu({
			withShareTicket: true,
			menus: ["shareAppMessage", "shareTimeline"]
		})
    // this.getConfig();
    // this.getRobot();
    // this.getAd();
  },
	
  methods: {
    initSocket() {
    },
    async getTabbar() {
      // const {
      // 	data
      // } = await uni.$u.http.post("/app/renovation/tabbar/list");
      const tabbar = [
        {
          pagePath: '/pages/chat/index',
          text: '对话',
					icon: 'chat'
        },
				{
				  pagePath: '/pages/createImage/index',
				  text: '绘画',
					icon: 'create-image'
				},
        {
          pagePath: '/pages/user/index',
          text: '我的',
					icon: 'user'
        },
      ]
      uni.setStorageSync('tabbar', tabbar)
      if (tabbar) {
        let tabbarIndex = uni.getStorageSync('selectedIndex')
        uni.switchTab({
          url: tabbarIndex ? tabbar[tabbarIndex].pagePath : tabbar[0].pagePath,
        })
      }
    },
    async getConfig() {
      const { data } = await uni.$u.http.get('/app/application/info/config')
      if (data.code != 1000) {
        uni.showToast({
          title: data.message,
          icon: 'none',
        })
      }
      uni.setStorageSync('config', data.data)
      login()
    },
    // 获取机器人配置
    async getRobot() {
      const { data } = await uni.$u.http.get('app/robot/info/info', {
        params: {
          id: 1,
        },
      })
      uni.setStorageSync('robot', data.data)
    },
    async getAd() {
      const { data } = await uni.$u.http.post('/app/ad/info/list')
      if (data.code != 1000) {
        uni.showToast({
          title: data.message,
          icon: 'none',
        })
      }
      uni.setStorageSync('ad', data.data)
    },
  },
}
</script>

<style lang="scss">
/* 注意要写在第一行，同时给style标签加入lang="scss"属性 */
// @import 'uview-ui/index.scss';
// @import 'style/uview.theme.scss'; 
@import 'uni.scss';
@import 'style/common.scss';
@import 'style/iconfont.css';
page {
  font-size: 28rpx;
}
</style>
