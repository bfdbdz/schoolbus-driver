// pages/password/password.js
const app = getApp()

Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		userInfo: app.globalData.userInfo.userInfo
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {

	},

	passwordSubmit: function (e) {
		console.log("提交的数据", e.detail.value)
		wx.request({
			url: 'http://localhost:8080/driver/password',
			method: 'PUT',
			data: {
				oldPassword: e.detail.value.oldPassword,
				newPassword: e.detail.value.newPassword
			},
			header: {
				'content-type': 'application/json',
				'Authorization': this.data.userInfo.token
			},
			success: (res) => {
				if (res.statusCode === 200) {
					if (res.data.code === 200) {
						console.log("修改密码成功", res)
						wx.showToast({
							icon: 'none',
							title: '修改成功！即将跳转至上页',
							mask: true,
							duration: 2000
						});
						setTimeout(() => {
							wx.navigateBack()
						}, 2000); //2秒后跳转
					} else {
						console.log("修改失败", res)
						wx.showToast({
							icon: 'none',
							title: res.data.message,
							mask: true,
							duration: 2000
						});
					}
				}
			},
			fail: (err) => {
				console.log("连接失败", err)
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