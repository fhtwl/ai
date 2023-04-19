import {
		baseURL
	} from "@/config/request.js"
export default {
	data() {
		return {
			baseURL,
			commonStaticPath: '/static',
			userInfo:{},
			// 默认的全局分享内容
			share: {
				title: '可免费体验的人工智能AI聊天机器人和AI绘画小程序',
				// path: '/pages/home/home',    // 全局分享的路径，比如 首页
				imageUrl: 'https://static.fhtwl.cc/logo/chatgpt-mini.png', // 全局分享的图片(可本地可网络)
			}
		}
	},
	methods:  {
		shareRequest() {
			uni.$u.http.get('/system/user/share')
			.then(res =>{
				this.$refs.uToast.show({
					type: 'success',
					message: "分享成功, 免费额度已到账",
					complete:async () =>{
						this.userInfo = await uni.$u.http.get('/system/user/query')
						uni.setStorageSync('userInfo', this.userInfo)
					}
				})
			})
			.catch(err =>{

				this.$refs.uToast.show({
					type: 'success',
					message: `分享失败, 请重试`,
				})
			})
		}
	},
	// 定义全局分享
	// 1.发送给朋友
	onShareAppMessage(res) {
		this.shareRequest()
		return {
			title: this.share.title,
			path: this.share.path,
			imageUrl: this.share.imageUrl,
		}
	},
	//2.分享到朋友圈
	onShareTimeline(res) {
		this.shareRequest()
		return {
			title: this.share.title,
			path: this.share.path,
			imageUrl: this.share.imageUrl,
		}
	},
}