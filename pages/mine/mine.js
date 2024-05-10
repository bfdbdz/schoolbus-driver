// pages/mine/mine.js
const app = getApp()

Page({

	isPageShowing:true,

	/**
	 * 页面的初始数据
	 */
	data: {
		userInfo: app.globalData.userInfo.userInfo
	},

	toChangePW() {
		wx.navigateTo({
			url: '/pages/password/password',
		})
	},

	logout() {
		// 清空本地缓存
		wx.clearStorage();

		//清空全局数据
		app.globalData.userInfo = {}
		console.log(app.globalData.userInfo)
	
		// 断开webSocket连接
		wx.closeSocket()

		// 返回登录页
		wx.reLaunch({
			url: '/pages/login/login',
		})
		console.log("退出登录")
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		if (this.data.userInfo !== app.globalData.userInfo.userInfo) {
			// 全局数据已更新,重置页面数据
			this.setData({
				userInfo: app.globalData.userInfo.userInfo
			});
		}
		console.log("个人信息",app.globalData.userInfo.userInfo)
		console.log('信息页面显示',this.data.userInfo)
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
		this.setData({
			userInfo:{}
		})
		// 移除页面实例缓存
		this.isPageShowing = false; // 设置一个标记,表示页面已不在显示
		currentPages = getCurrentPages(); // 获取当前所有页面实例
		currentPages.forEach(page => {
			if (!page.isPageShowing) {
				page = null; // 手动移除已不显示的页面实例的缓存
			}
		});
		console.log("页面卸载",this.data.userInfo)
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