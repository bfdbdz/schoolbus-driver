// pages/register/register.js
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		showPassword1: false,
		showPassword2: false,
		// array: ['乘客', '司机'],
		// current: '',
		checked: false
	},
	changePassword1: function () {
		this.setData({
			showPassword1: !this.data.showPassword1
		});
	},
	changePassword2: function () {
		this.setData({
			showPassword2: !this.data.showPassword2
		});
	},
	checkboxChange: function (e) {
		if (e.detail.value.length > 0) {
			this.setData({
				checked: true
			});
		} else {
			this.setData({
				checked: false
			});
		}
		console.log(this.data.checked);
	},
	// radioChange: function (e) {
	// 	console.log(e);
	// 	for (let i = 0; i < this.data.array.length; i++) {
	// 		if (i == e.detail.value) {
	// 			this.setData({
	// 				current: i
	// 			});
	// 			break;
	// 		}
	// 	}
	// 	console.log(this.data.current);
	// },
	registerSubmit: function (e) {
		console.log("注册提交", e);
		if (this.data.checked == false) {
			console.log("未勾选协议");
			wx.showToast({
				title: "请阅读并同意页面下方的协议",
				mask: true,
				icon: "none",
				duration: 1000
			});
		} else {
			wx.request({
				url: "http://localhost:8080/auth/register",
				method: 'POST',
				data: {
					name: e.detail.value.name,
					phone: e.detail.value.phone,
					password: e.detail.value.password,
					username: e.detail.value.username,
					role: 1,
					checkPassword: e.detail.value.checkPassword
				},
				success: (res) => {
					console.log("200?", res);
					if (res.statusCode === 200) {
						if (res.data.code === 200) {
							wx.showToast({
								icon: 'none',
								title: '注册成功！即将跳转至登录页',
								mask: true,
								duration: 2000
							});
							// 成功后自动跳转至登录界面
							setTimeout(() => {
								wx.navigateBack()
								console.log("跳转");
							}, 2000); //2秒后跳转
						} else {
							wx.showToast({
								title: res.data.message,
								mask: true,
								icon: 'none',
								duration: 1000
							});
						}
					}
				},
				fail: () => {
					wx.showToast({
						title: '请求失败',
						mask: true,
						icon: 'error',
						duration: 1000
					});
				}
			});
		}
	},
	switchSection: function () {
		wx.navigateBack()
	},


	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad(options) {
		console.log("根目录", wx.env.USER_DATA_PATH);
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