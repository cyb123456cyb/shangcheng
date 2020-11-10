// pages/getUserInfo/getUserInfo.js
var app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pages:"",
    options:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log(options)
      this.setData({
        pages:options.pages,
        options:options.options
      })
    wx.showModal({
      title: '提示',
      content: '您的头像和用户名功能将仅用于动态发布功能',
      showCancel: false
    })
  
  },
  getUserInfo:function(e){
    var that = this
    app.globalData.city= e.detail.userInfo.city,
      app.globalData.gender = e.detail.userInfo.gender,
       app.globalData.name = e.detail.userInfo.nickName,
         app.globalData.avatarUrl = e.detail.userInfo.avatarUrl
    wx.login({
      //获取code换取openID    
      success: function (res) {
        //code = res.code //返回code
        console.log("获取code");
        console.log(res.code)
        that.logEn(res.code)
        //  t.getOpenId(res.code)   
        // t.sendUserInfo(res.code)   
        // var opid = t.getOpenId(res.code);
      }
    })
  },

  logEn: function (code) {

    var that = this
    wx.request({
      url: 'https://www.future-algorithm.com/' + 'login',
      data: {
        code: code,
        touxiang: app.globalData.avatarUrl,
        sex: app.globalData.gender,
        city: app.globalData.city,
        name: app.globalData.name
      },
      success: function (res) {
        console.log(res)
        app.globalData.usrId = res.data.key
        console.log("我是key", res.data.key)
        // that.generateOrder()
        // that.getOrder()
        wx.reLaunch({
          url: that.data.pages+'?options='+that.data.options
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  }
})