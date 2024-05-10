// pages/stop/stop.js
const app = getApp()

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		userInfo: app.globalData.userInfo.userInfo,
		showNoTask: true,
		onNumber: {},
		onStation: [],
		offNumber: {},
		offStation: []
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		if (app.globalData.userInfo.userInfo.number != null) {
			this.setData({
				showNoTask: false
			})
			this.getStation()
			//创建定时器
			this.timer = setInterval(() => {
				this.getOffNumber()
				this.getOnNumber()
			}, 5000)
		}
	},

	// 销毁定时器
	clearLocationTimer() {
		clearInterval(this.timer)
	},

	//获取上下车站点
	getStation() {
		let onStation, offStation
		switch (this.data.userInfo.number) {
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
		console.log(this.data.offStation)
		console.log(this.data.onStation)
	},

	//获取下车人数
	getOffNumber() {
		wx.request({
			url: 'http://192.168.74.155:8080/driver/route/getoff',
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
			url: 'http://192.168.74.155:8080/driver/route/geton',
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