<template>
	<view>
		<u-subsection :list="list" :current="current" @change="handleSelectType"></u-subsection>
		<view v-show="current === 0">
			<u-list v-if="chatList.length > 0"  @scrolltolower="scrolltolower">

				<u-list-item v-for="(item, index) in chatList" :key="index">
					<view class="chat">
						<!-- 我的消息  -->
						<u-transition :show="true" mode="fade-right">
							<view class="chat-item__right">
								<view class="">
									<view class="chat-item__right-message primary-bg" style="color: #fff">
										{{ item.prompt }}
									</view>

								</view>
								<u-avatar size="30" shape="square" :src="userInfo.avatar"></u-avatar>
							</view>
						</u-transition>
						<!-- 机器人消息 -->
						<u-transition :show="true" mode="fade-left">
							<view class="chat-item__left u-flex">
								<u-avatar size="30" :src="'/static/ai-chat.png'" shape="square"></u-avatar>
								<view class="chat-item__left-right">

									<view class="chat-item__left-bottom">
										<view class="chat-item__left-message"
											style="background-color: #f5f5f5;color: #333;white-space: pre-line;">
											{{item.result}}
										</view>
									</view>
								</view>
							</view>
						</u-transition>

					</view>
				</u-list-item>



			</u-list>
			<u-empty marginTop="30rpx" v-show="chatList.length === 0" mode="history">
			</u-empty>
		</view>
		<view v-show="current === 1">
			<u-list v-if="imgList.length > 0" @scrolltolower="scrolltolower">
				<u-list-item v-for="(item, index) in imgList" :key="index">
					<view class="item">
						<u-album singleSize="150rpx" slot="icon" :urls="[	`${baseURL}/history/${item.result}`]"></u-album>
						<view class="right">
							<view class="title"><u-tooltip direction="bottom" :text="item.prompt.text_prompts[0].text"></u-tooltip>
							</view>
							<view class="date">{{item.createdAt}}</view>
						</view>
					</view>
					<!-- <u-cell
									:title="item.prompt.text_prompts[0].text"
								>
									<u-album singleSize="35" slot="icon" :urls="[	`${baseURL}/history/${item.result}`]" ></u-album>
							
								</u-cell> -->
				</u-list-item>
			</u-list>
			<u-empty marginTop="30rpx" v-show="imgList.length === 0" mode="history" />
		</view>
	</view>
</template>

<script>
	import {
		baseURL
	} from "@/config/request.js"
	export default {
		data() {
			return {
				baseURL,
				list: ['对话', '绘画'],
				current: 0,
				table: []
			}
		},
		onLoad() {
			this.getHistory()
		},
		methods: {
			handleSelectType(current) {
				this.current = current;
			},
			async getHistory() {
				const data = await uni.$u.http.get('/chat/history/query')

				this.table = data.map(item => {
					return {
						...item,
						prompt: item.type === 2 ? JSON.parse(item.prompt) : item.prompt
					}
				})
				console.log(this.table)
			},
			scrolltolower() {
				this.loadmore()
			},
			loadmore() {
				console.log("loadmore")
				// for (let i = 0; i < 30; i++) {
				// 	this.indexList.push({
				// 		url: this.urls[uni.$u.random(0, this.urls.length - 1)]
				// 	})
				// }
			}
		},
		computed: {
			chatList() {
				return this.table.filter(item => item.type === 1)
			},
			imgList() {
				return this.table.filter(item => item.type === 2)
			}
		}
	}
</script>

<style scoped lang="scss">
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

	.item {
		display: flex;
		padding: 0 20rpx;
		margin: 16rpx 0;

		.right {
			flex: 1;
			margin-left: 20rpx;
			width: calc(100% - 170rpx);

			.title {
				font-size: 28rpx;

				/deep/.u-tooltip__wrapper {
					white-space: pre-wrap;
					width: 100%;
					word-break: break-all;
					overflow: hidden;
					display: -webkit-box;
					-webkit-line-clamp: 2;
					-webkit-box-orient: vertical;
				}
			}

			.date {
				color: #999;
				font-size: 24rpx;
				margin-top: 40rpx;
			}
		}
	}
</style>