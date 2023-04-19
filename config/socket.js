class Socket {
  constructor(url, time) {
    this.is_open_socket = false //避免重复连接
    this.url = url //地址
    this.data = null
    //心跳检测
    this.timeout = time //多少秒执行检测
    this.heartbeatInterval = null //检测服务器端是否还活着
    this.reconnectTimeOut = null //重连之后多久再次重连
    this.handleMessageTasks = [] // message事件回调
		
		// 事件
		this.event = {}
		
    try {
      return this.connectSocketInit()
    } catch (e) {
      console.log('catch')
      this.reconnect()
    }
  }

  // 进入这个页面的时候创建websocket连接【整个页面随时使用】
  connectSocketInit() {
    const token = uni.getStorageSync('token')
    if (!token) {
      return
    }
    this.socketTask = uni.connectSocket({
      url: this.url,
      header: {
        'content-type': 'application/json',
        authorization: token,
      },
      success: () => {
        console.log('正准备建立websocket中...')
				
        // 返回实例
        return this.socketTask
      },
    })
    this.socketTask.onOpen((res) => {
      console.log('WebSocket连接正常！')
      clearTimeout(this.reconnectTimeOut)
      clearTimeout(this.heartbeatInterval)
      this.is_open_socket = true
      this.socketTask.onMessage((res) => {
        //onMessage这个监听在封装的js中赋值给了socketTask对象
        const data = JSON.parse(res.data)
        this.onMessage(data)
      })
      this.start()
    })
    // 监听连接失败，这里代码我注释掉的原因是因为如果服务器关闭后，和下面的onclose方法一起发起重连操作，这样会导致重复连接
    // uni.onSocketError((res) => {
    // 	console.log('WebSocket连接打开失败，请检查！');
    // 	this.is_open_socket = false;
    // 	this.reconnect();
    // });
    // 这里仅是事件监听【如果socket关闭了会执行】
    this.socketTask.onClose(() => {
      console.log('已经被关闭了')
      this.reconnect()
    })
  }

  //发送消息
  send(value,success = () =>{}, fail = () =>{}) {
    // 注：只有连接正常打开中 ，才能正常成功发送消息
    this.socketTask.send({
      data: JSON.stringify(value),
       success: async () => {
				 success()
        console.log('消息发送成功')
      },
      fail: async (err) =>  {
				console.log(err)
				fail(err)
        this.reconnect()
      },
    })
  }
  //开启心跳检测
  start() {
    this.heartbeatInterval = setInterval(() => {
      this.data = {
        type: 'heart',
        msg: '心跳检测',
      }
      // console.log(this.data)
      this.send(JSON.stringify(this.data))
    }, this.timeout)
  }
  //重新连接
  reconnect() {
    //停止发送心跳
    clearInterval(this.heartbeatInterval)
    //如果不是人为关闭的话，进行重连
    if (this.is_open_socket) {
      this.reconnectTimeOut = setTimeout(() => {
        this.connectSocketInit()
      }, 6000)
    }
  }
  //手动关闭
  close() {
    this.is_open_socket = false
    this.socketTask.close()
  }
	
	get isOpen  () {
		return this.is_open_socket
	}
	onOpen() {
		this.event.open && this.event.open()
	}
  onMessage(msg) {
    this.event.message && this.event.message(msg)
    
  }
	
	on(eventName, eventCallback) {
		this.event[eventName] = eventCallback
	}
	
}
const isDev = process.env.name === 'development'
const url =  isDev ? 'ws://127.0.0.1:4101/ws' : 'wss://domain.com/ws'
const socket = new Socket(url, 60000)
console.log('socket', socket)
export default socket
