// app.js
let eventCenter = {}
App({
	globalData: {
		userInfo: {}
	},

	onLaunch() {
		// 展示本地存储能力
		const logs = wx.getStorageSync('logs') || []
		logs.unshift(Date.now())
		wx.setStorageSync('logs', logs)

		// 清除 access_token 和 access_token_expired_time
		// this.clearAccessTokenCache();

		// this.checkAccessToken();

		// this.getUserInfo()

		// this.initWebSocket()
	},

	getLatestAccessToken() {
		return wx.getStorageSync('access_token');
	},

	clearAccessTokenCache() {
		wx.removeStorageSync('access_token');
		wx.removeStorageSync('access_token_expired_time');
	},

	// 检查 access_token 是否过期
	checkAccessToken() {
		const accessToken = wx.getStorageSync('access_token');
		const accessTokenExpiredTime = wx.getStorageSync('access_token_expired_time');
		if (!accessToken || Date.now() > accessTokenExpiredTime) {
			// access_token 已经过期,需要重新获取
			this.getAccessToken();
		}
	},

	//重新获取 access_token 
	getAccessToken() {
		wx.request({
			url: 'https://api.weixin.qq.com/cgi-bin/token',
			data: {
				grant_type: 'client_credential',
				appid: 'wxdceadcbf12aae11f',
				secret: '3d968d11208ede44cefe42864fd8e3df'
			},
			success: (res) => {
				if (res.data.access_token) {
					// 将 access_token 和过期时间保存到本地存储中
					wx.setStorageSync('access_token', res.data.access_token);
					wx.setStorageSync('access_token_expired_time', Date.now() + (res.data.expires_in - 200) * 1000);
					console.log("new_access_token", res.data.access_token)
				} else {
					console.error('获取 access_token 失败:', res.data);
				}
			},
			fail: (err) => {
				console.error('获取 access_token 请求失败:', err);
			}
		});
	},

	//获取用户信息
	//用户进入这个页面时肯定已经登录，所以本地缓存一定有用户信息
	getUserInfo() {
		// 从本地缓存中读取用户信息
		// const userInfo = 
		wx.getStorage({
			key: 'userInfo',
			success(res) {
				console.log(res)
			}
		})
		if (userInfo) {
			// 如果本地缓存中有用户信息,则将其保存到全局数据中
			this.globalData.userInfo = userInfo
			console.log("app userInfo已有", this.globalData.userInfo.userInfo)
		} else {
			// 如果本地缓存中没有用户信息,则等待下次更新时再读取
			this.waitForUserInfoUpdate()
		}

	},

	// 每隔 5 秒检查一次本地缓存,看是否有用户信息更新
	waitForUserInfoUpdate() {
		// 每隔 5 秒检查一次本地缓存,看是否有用户信息更新
		this.checkUserInfoTimer = setInterval(() => {
			const userInfo = wx.getStorageSync('userInfo')
			if (userInfo) {
				// 如果本地缓存中有用户信息,则将其保存到全局数据中
				this.globalData.userInfo = userInfo
				// 停止定时器
				clearInterval(this.checkUserInfoTimer)
				console.log("app userInfo更新", this.globalData.userInfo.userInfo)
			}
		}, 5000);
	},

	initWebSocket() {
		if (this.globalData.userInfo.userInfo) {
			var id = this.globalData.userInfo.userInfo.id
			this.socketTask = wx.connectSocket({
				url: 'ws://localhost:8080/ws/driver' + '_' + id,
				header: {
					'content-type': 'application/json'
				},
				method: 'GET'
			})
			console.log("wsURL", 'wss://localhost:8080/ws/driver' + '_' + id)
		}

		this.socketTask.onOpen(function () {
			console.log('WebSocket 连接已打开')
		})

		this.socketTask.onMessage((res) => {
			let data = JSON.parse(res.data)
			console.log('收到服务器数据：', data)
			// 人车拟合消息
			if (data.type == 1) {
				this.$emit('socketMessage', data)
			}
			// 前方到站提醒
			else if (data.type == 2) {
				console.log("播放音频")
				wx.setInnerAudioOption({
					obeyMuteSwitch: 'false'
				})
				const innerAudioContext = wx.createInnerAudioContext({
					useWebAudioImplement: false
				})
				switch (data.message) {
					case 'changan':
						console.log("选择长安音频")
						innerAudioContext.src = "/audio/changan.mp3"
						break;
					case 'gaoxin':
						innerAudioContext.src = "/audio/gaoxin.mp3"
						break;
					case 'guojiyi':
						innerAudioContext.src = "/audio/guojiyi.mp3"
						break;
					case 'laodong':
						innerAudioContext.src = "/audio/laodong.mp3"
						break;
					case 'youyi':
						innerAudioContext.src = "/audio/youyi.mp3"
						break;
					case 'ziwei':
						innerAudioContext.src = "/audio/ziwei.mp3"
						break;
					default:
						break;
				}
				console.log("播放长安")
				innerAudioContext.play()
				// innerAudioContext.destroy()
			}
		})

		wx.onSocketError((res) => {
			console.error('WebSocket连接发生错误：', res.errMsg)
		})

		wx.onSocketClose((res) => {

			console.log('WebSocket连接已关闭')
		})
	},
	// 事件中心方法
	$on(eventName, callback) {
		if (!eventCenter[eventName]) {
			eventCenter[eventName] = []
		}
		eventCenter[eventName].push(callback)
	},
	$off(eventName, callback) {
		if (eventCenter[eventName]) {
			eventCenter[eventName] = eventCenter[eventName].filter(cb => cb !== callback)
		}
	},
	$emit(eventName, ...args) {
		if (eventCenter[eventName]) {
			eventCenter[eventName].forEach(cb => cb(...args))
		}
	},
	onLaunch() {
		// 清空缓存
		wx.clearStorage();
		wx.getStorage({
			fail(res) {
				console.log('清空缓存', res)
			}
		})

		// 清空全局数据
		this.globalData = {}
		console.log('清空全局数据', this.globalData)
	},

})
