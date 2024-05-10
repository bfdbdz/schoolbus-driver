// pages/task/task.js
const app = getApp()

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		selected: null,
		taskList: [],
		showTask: true,
		showBtn:Boolean
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		this.getTask()
	},

	getTask() {
		return new Promise((resolve, reject) => {
			wx.request({
				url: 'http://192.168.74.155:8080/driver/task',
				method: 'GET',
				header: {
					'content-type': 'application/json',
					'Authorization': app.globalData.userInfo.userInfo.token
				},
				success: (res) => {
					// console.log(res.data.data)
					resolve(res.data)
					this.setData({
						taskList: res.data.data
					})
					console.log("未执行工单", this.data.taskList)
					this.checkRoute()
					this.checkBtn()
				},
				fail: (err) => {
					reject(err)
				}
			})
		})
	},

	checkRoute() {
		let taskList = this.data.taskList
		if (taskList != null) {
			for (let i = 0; i < Object.keys(taskList).length; i++) {
				switch (taskList[i]['number']) {
					case 1:
						taskList[i].route = "长安->友谊 西万路"
						break;
					case 2:
						taskList[i].route = "长安->友谊 西太路"
						break;
					case 3:
						taskList[i].route = "友谊->长安 西万路"
						break;
					case 4:
						taskList[i].route = "友谊->长安 西太路"
						break;
				}
			}
			this.setData({
				taskList: taskList
			})
			console.log("获取路线名", this.data.taskList)
		}
	},

	checkBtn(){
		if(JSON.stringify(this.data.taskList) !=="[]"){
			this.setData({
				showBtn:true
			})
		}else{
			this.setData({
				showBtn:false
			})
		}
		console.log("显示按钮",this.data.showBtn)
	},

	chooseTask(e) {
		const index = e.currentTarget.dataset.index
		this.setData({
			selected: index
		})
		console.log(this.data.selected)
	},

	doTask() {
		if (this.data.selected == null) {
			console.log('未选择工单')
			wx.showToast({
				title: '请先选择一个工单',
				icon: 'none',
				mask: 'true',
				duration: 1000
			})
		} else {
			let choice = this.data.taskList[this.data.selected]
			console.log("选择执行的工单", choice)
			let id = choice['id']
			wx.request({
				url: 'http://192.168.74.155:8080/driver/task/' + id,
				method: 'PUT',
				header: {
					'content-type': 'application/json',
					'Authorization': app.globalData.userInfo.userInfo.token
				},
				success: (res) => {
					if (res.statusCode == 200) {
						if (res.data.code === 200) {
							// 更新司机信息
							this.getDriverInfo()
							wx.showToast({
								icon: 'none',
								title: '选择成功！',
								mask: true,
								duration: 2000
							});
							setTimeout(() => {
								this.setData({
									showTask: false,
								})
							}, 2000);
						}
					}
					console.log(res)
				},
				fail: (res) => {
					console.log(res)
				}
			})
		}
	},

	//获取最新的司机信息，包括路线、
	getDriverInfo() {
		wx.request({
			url: 'http://192.168.74.155:8080/driver/current',
			method: 'GET',
			header: {
				'content-type': 'application/json',
				'Authorization': app.globalData.userInfo.userInfo.token
			},
			success: (res) => {
				if (res.statusCode === 200) {
					if (res.data.code === 200) {
						console.log("获取司机路线id", res)
						const newUserInfo = {
							number: res.data.data.number,
							routeId: res.data.data.routeId
						}
						const userInfoPast = app.globalData.userInfo.userInfo
						const userInfo = {
							...userInfoPast,
							...newUserInfo
						}
						console.log("更新后的司机信息", userInfo)
						//更新本地存储
						wx.setStorage({
							key: 'userInfo',
							userInfo
						})
						//更新全局数据
						app.globalData.userInfo = {
							userInfo
						}
						console.log("全局数据更新成功？", app.globalData.userInfo.userInfo)
					}
				}
			},
			fail: (err) => {
				//请求失败
				console.log("获取司机最新信息失败", err);
			}
		})
	},

	cancelTask() {
		if (this.data.selected == null) {
			console.log('未选择工单')
			wx.showToast({
				title: '请先选择一个工单',
				icon: 'none',
				mask: 'true',
				duration: 1000
			})
		} else {
			let choice = this.data.taskList[this.data.selected]
			console.log("选择执行的工单", choice)
			let id = choice['id']
			wx.request({
				url: 'http://192.168.74.155:8080/driver/task/cancel/' + id,
				method: 'PUT',
				header: {
					'content-type': 'application/json',
					'Authorization': app.globalData.userInfo.userInfo.token
				},
				success: (res) => {
					if (res.statusCode == 200) {
						if (res.data.code === 200) {
							// 更新司机信息
							this.deleteDriverInfo()
							this.setData({
								showTask: true
							})
							wx.showToast({
								icon: 'none',
								title: '取消工单成功',
								mask: true,
								duration: 2000
							});
							this.getTask()
						}
					}
					console.log(res)
				},
				fail: (res) => {
					console.log(res)
				}
			})
		}
	},

	deleteDriverInfo() {
		const {
			number,
			routeId,
			...rest
		} = app.globalData.userInfo.userInfo
		const userInfo = rest
		console.log("更新后的司机信息", userInfo)
		//更新本地存储
		wx.setStorage({
			key: 'userInfo',
			userInfo
		})
		//更新全局数据
		app.globalData.userInfo = {
			userInfo
		}
		console.log("全局数据更新成功？", app.globalData.userInfo.userInfo)

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
		this.getTask().then(() => {
			// 数据获取成功后停止下拉刷新动画
			wx.stopPullDownRefresh();
		});
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