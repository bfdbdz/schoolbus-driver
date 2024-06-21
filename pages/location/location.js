// pages/location/location.js
const app = getApp()

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		latitude: 0,
		longitude: 0,
		// speed: 0,
		markers: [],
		currentTime: '',
		onNumber: {},
		onStation: [],
		offNumber: {},
		offStation: [],
		userInfo: app.globalData.userInfo.userInfo
	},

	//创建定时器
	createLocationTimer() {
		this.getLocationAndSpeed()
		this.getCurrentTime()
		this.timer = setInterval(() => {
			this.getLocationAndSpeed()
			this.getCurrentTime()
		}, 60000) // 60000毫秒 = 1分钟
	},

	// 销毁定时器
	clearLocationTimer() {
		clearInterval(this.timer)
	},

	// 获取当前时间
	getCurrentTime() {
		let time = new Date();

		// 提取时和分
		let hours = time.getHours();
		let minutes = time.getMinutes();

		// 将时间格式化为字符串
		this.setData({
			currentTime: `${hours}:${minutes.toString().padStart(2, '0')}`
		})

		console.log("时间", time)
		console.log(hours)
		console.log(minutes)
		console.log(this.data.currentTime)
	},

	// 请求定位权限
	requestLocationPermission() {
		//用户之前是否已经授权过
		wx.authorize({
			scope: 'scope.userLocation',
			success: () => {
				console.log('Authorize success')
				this.getLocation()
			},
			fail: (err) => {
				console.log('Authorize error:', err)
				wx.showModal({
					title: '定位权限请求',
					content: '进行乘车需要获取您的位置信息,请授权后再使用',
					showCancel: true,
					confirmText: '确定',
					cancelText: '拒绝',
					confirmColor: '#6587b5',
					success: function (res) {
						if (res.confirm) {
							this.getLocation()
						} else if (res.cancel) {
							wx.showToast({
								icon: 'none',
								title: '您拒绝了定位授权，我们无法为您提供服务',
								duration: 1000,
								mask: true
							})
						}
					}
				})
			}
		})
	},

	// 获取用户位置和速度
	getLocationAndSpeed() {
		wx.getLocation({
			type: 'gcj02', // 返回可以用于 wx.openLocation 的坐标
			success: (res) => {
				console.log("获取位置", res)
				this.setData({
					latitude: res.latitude,
					longitude: res.longitude,
					// speed: res.speed,
					markers: [{
						id: 0,
						latitude: res.latitude,
						longitude: res.longitude,
						width: 20,
						height: 30
					}]
				})
				console.log("纬度", this.data.latitude)
				console.log("经度", this.data.longitude)
				// console.log("速度", this.data.speed)
				console.log("markers", this.data.markers)
				this.moveMapToCenter()
				//如果司机信息已经更新，开始上传速度和位置
				if (app.globalData.userInfo.userInfo.number != null) {
					this.uploadLocationAndSpeed(res.latitude, res.longitude, res.speed, this.data.currentTime)
				}
			},
			fail: (err) => {
				console.error('获取位置信息失败:', err)
				wx.showModal({
					title: '获取位置信息失败',
					content: JSON.stringify(err),
					showCancel: false
				})
			}
		})
	},

	// 将定位在页面中心展示
	moveMapToCenter() {
		this.mapContext = wx.createMapContext('myMap')
		this.mapContext.moveToLocation()
	},

	// 上传用户定位和速度
	uploadLocationAndSpeed(latitude, longitude, speed, time) {
		wx.request({
			url: 'http://localhost:8080/driver/location',
			header: {
				'Authorization': app.globalData.userInfo.userInfo.token
			},
			method: 'POST',
			data: {
				latitude,
				longitude,
				speed,
				time
			},
			success: (res) => {
				console.log('上传成功:', res.data)
			},
			fail: (err) => {
				console.error('上传失败:', err)
				wx.showToast({
					title: '请求失败，请检查网络',
					icon: 'error',
					mask: true,
					duration: 1000
				})
			}
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		this.createLocationTimer() //页面加载时创建定时器

	},

	//获取上下车站点
	getStation() {
		let onStation, offStation
		if (app.globalData.userInfo.userInfo.number == null) {
			this.setData({
				onStation: [],
				offStation: []
			})
		} else {
			switch (app.globalData.userInfo.userInfo.number) {
				case 1:
					onStation = ['长安校区乘车点', '长安校区东门']
					offStation = ['紫薇', '高新', '劳动南路', '友谊校区']
					break;
				case 2:
					onStation = ['长安校区乘车点', '长安校区东门']
					offStation = ['国际医学中心', '劳动南路', '友谊校区']
					break;
				case 3:
					onStation = ['友谊校区', '高新', '紫薇']
					offStation = ['长安校区东门', '云天苑', '教学西楼', '海天苑', '启翔楼']
					break;
				case 4:
					onStation = ['友谊校区', '国际医学中心']
					offStation = ['长安校区东门', '云天苑', '教学西楼', '海天苑', '启翔楼']
					break;
			}
			this.setData({
				onStation: onStation,
				offStation: offStation
			})
		}
		console.log(this.data.offStation)
		console.log(this.data.onStation)
	},

	//获取下车人数
	getOffNumber() {
		wx.request({
			url: 'http://localhost:8080/driver/route/getoff',
			method: 'GET',
			header: {
				'Authorization': app.globalData.userInfo.userInfo.token
			},
			success: (res) => {
				// console.log('下车站点人数', res.data)
				let offNumber = {}
				for (let key in res.data.data) {
					switch (key) {
						case 'dongmen':
							offNumber['长安校区东门'] = res.data.data[key]
							break;
						case 'guojiyi':
							offNumber['国际医学中心'] = res.data.data[key]
							break;
						case 'ziwei':
							offNumber['紫薇'] = res.data.data[key]
							break;
						case 'gaoxin':
							offNumber['高新'] = res.data.data[key]
							break;
						case 'laodong':
							offNumber['劳动南路'] = res.data.data[key]
							break;
						case 'youyi':
							offNumber['友谊校区'] = res.data.data[key]
							break;
						case 'yun':
							offNumber['云天苑'] = res.data.data[key]
							break;
						case 'jiaoxi':
							offNumber['教学西楼'] = res.data.data[key]
							break;
						case 'hai':
							offNumber['海天苑'] = res.data.data[key]
							break;
						case 'qixiang':
							offNumber['启翔楼'] = res.data.data[key]
							break;
					}
				}
				this.setData({
					offNumber: offNumber
				});
				console.log("下车站点人数", this.data.offNumber)
			}
		})
	},

	//获取上车人数
	getOnNumber() {
		wx.request({
			url: 'http://localhost:8080/driver/route/geton',
			method: 'GET',
			header: {
				'Authorization': app.globalData.userInfo.userInfo.token
			},
			success: (res) => {
				// console.log('上车站点人数', res.data)
				let onNumber = {}
				for (let key in res.data.data) {
					switch (key) {
						case 'changan':
							onNumber['长安校区乘车点'] = res.data.data[key]
							break;
						case 'dongmen':
							onNumber['长安校区东门'] = res.data.data[key]
							break;
						case 'guojiyi':
							onNumber['国际医学中心'] = res.data.data[key]
							break;
						case 'ziwei':
							onNumber['紫薇'] = res.data.data[key]
							break;
						case 'gaoxin':
							onNumber['高新'] = res.data.data[key]
							break;
						case 'laodong':
							onNumber['劳动南路'] = res.data.data[key]
							break;
						case 'youyi':
							onNumber['友谊校区'] = res.data.data[key]
							break;
					}
				}
				this.setData({
					onNumber: onNumber
				});
				console.log("上车站点人数", this.data.onNumber)
			}
		})
	},

	/**
	 * 生命周期函数--监听页面初次渲染完成
	 */
	onReady() {

	},

	/**
	 * 生命周期函数--监听页面显示
	 */
	onShow() {
		if (app.globalData.userInfo.userInfo.number != null) {
			//创建定时器
			if (!this.timer1) {
				this.timer1 = setInterval(() => {
					this.getStation()
					this.getOffNumber()
					this.getOnNumber()

				}, 5000)
			}
		}
	},

	/**
	 * 生命周期函数--监听页面隐藏
	 */
	onHide() {

	},

	/**
	 * 生命周期函数--监听页面卸载
	 */
	onUnload() {
		this.clearLocationTimer() // 页面销毁时清除定时器
	},

	/**
	 * 页面相关事件处理函数--监听用户下拉动作
	 */
	onPullDownRefresh() {

	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom() {

	},

	/**
	 * 用户点击右上角分享
	 */
	onShareAppMessage() {

	}
})