// pages/login/login.js
const app = getApp();

Page({
	/**
	 * 页面的初始数据
	 */
	data: {
		showPassword: false,
		checked: false,
		message: ''
	},
	switchSection: function () {
		wx.navigateTo({
			url: '../register/register',
		})
	},
	changePassword: function () {
		this.setData({
			showPassword: !this.data.showPassword
		})
	},
	checkboxChange: function (e) {
		if (e.detail.value.length > 0) {
			this.setData({
				checked: true
			})
		} else {
			this.setData({
				checked: false
			})
		}
		console.log(this.data.checked)
	},
	loginSubmit: function (e) {
		console.log("提交", e.detail.value)
		if (this.data.checked == false) {
			console.log("未勾选协议");
			wx.showToast({
				title: '请阅读并同意页面下方的协议',
				icon: 'none',
				mask: true,
				duration: 1000
			});
		} else {
			wx.request({
				url: 'http://localhost:8080/auth/login',
				method: 'POST',
				data: {
					username: e.detail.value.username,
					password: e.detail.value.password,
					role: 1
				},
				success: (res) => {
					if (res.data.code === 200) {
						console.log('登录信息', res.data.data);
						// 从响应数据中提取需要的字段
						const userInfo = {
							id: res.data.data.id,
							name: res.data.data.name,
							phone: res.data.data.phone,
							role: 1,
							username: res.data.data.username,
							token: res.data.data.token
						}
						// 将用户信息存储在缓存中
						wx.setStorage({
							key: 'userInfo',
							data: userInfo
						})
						app.globalData.userInfo = {
							// 新的用户信息
							userInfo
						}
						console.log("登录成功")
						console.log('globalData', app.globalData.userInfo.userInfo)
						wx.getStorage({
							key: 'userInfo',
							success(res) {
								console.log('缓存信息', res)
							}
						})
						app.initWebSocket()
						wx.showToast({
							title: '登录成功!',
							mask: true,
							icon: "none",
							duration: 2000
						});
						//登录成功后跳转至工单页面
						setTimeout(() => {
							wx.switchTab({
								url: '/pages/task/task'
							})
							console.log("跳转")
						}, 2000); //2秒后跳转
					} else {
						//登录失败
						console.log(res.data);
						wx.showToast({
							title: res.data.message,
							mask: true,
							icon: 'none',
							duration: 1000
						});
					}
				},
				fail: () => {
					//请求失败
					console.log("请求失败");
					wx.showToast({
						title: '请检查网络连接',
						mask: true,
						icon: 'error',
						duration: 1000
					});
				}
			})
		}
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {

		// this.setData({
		// 	userInfo: app.globalData.userInfo.userInfo
		// });

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