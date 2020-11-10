// pages/order/order.js
var app = getApp()
Page({

  /**
  * 页面的初始数据
  */
  data: {
    pintuan:[],
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    currtab: 0,
    swipertab: [{ name: '已完成', index: 0 }, { name: '拼团中', index: 1 }],
  },
  /**
  * 生命周期函数--监听页面加载
  */
  onLoad: function (options) {
    this.getOrder()
  },
  getOrder: function () {
    var that = this
    wx.request({
      url: app.globalData.urls + "returnOrder",
      data: {
        sessionKey: app.globalData.usrId
      },
      success: function (res) {
        console.log(res)
        if (res.data[0].code!=0)
        that.setData({
          pintuan:res.data
        })
      }
    })
  },
  upToPJ:function(res){
    console.log(res.currentTarget.id)
    wx.navigateTo({
      url: '/pages/pingjia/pingjia?id=' + res.currentTarget.id
    })
  },
onShareAppMessage:function(opts){
  var that= this
  console.log("我是即将分享的pingtuan_id",that.data.pintuan[opts.target.id].pingtuan_id)
  console.log(opts)
  if( opts.from=='button')
  return {
    title:"快来和我一起上课吧！",
    path: "/pages/goods/details?pt=" + that.data.pintuan[opts.target.id].pingtuan_id + "&id=" + that.data.pintuan[opts.target.id].course_id,
    imageUrl: that.data.pintuan[opts.target.id].course_pic1
  }
},

  backMoney:function(e){
    var that = this
    console.log(e)
    wx.showToast({
      title: '正在申请退款，请等待后台审核'
    })
    wx.request({
      url: app.globalData.urls+'/buy/requestRefund',
      data:{
        sessionKey:app.globalData.usrId,
        order_id:that.data.pintuan[e.target.id].order_id
      },
      success:function(res){
        console.log(res)
      }
    })
  },
  // onShareAppMessage: function (res) {
  //   console.log(res)
  //   // return {
  //   //   title: '来和我一起上课吧！',
  //   //   desc: '',
  //   //   imageUrl:,
  //   //   path: '/page/user?id=123' // 路径，传递参数到指定页面。
  //   // }

  // },
  /**
  * 生命周期函数--监听页面初次渲染完成
  */
  onReady: function () {
    // 页面渲染完成
    this.getDeviceInfo()
    this.orderShow()
  },

  getDeviceInfo: function () {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          deviceW: res.windowWidth,
          deviceH: res.windowHeight
        })
      }
    })
  },

  /**
  * @Explain：选项卡点击切换
  */
  tabSwitch: function (e) {
    console.log(e)
    var that = this
    if (this.data.currtab === e.target.dataset.id) {
      return false 
    } else {
      that.setData({
        currtab: e.target.dataset.id
      })
    }
  },

  tabChange: function (e) {
    this.setData({ currtab: e.detail.current })
    this.orderShow()
  },

  orderShow: function () {
    let that = this
    switch (this.data.currtab) {
      case 0:
        that.alreadyShow()
        break
      case 1:
        that.waitPayShow()
        break
      case 2:
        that.lostShow()
        break
    }
  },
  alreadyShow: function () {
    this.setData({
      alreadyOrder: [{ name: "吉他", state: "交易成功", time: "2018-09-30 14:00-16:00", status: "已完成", url: "/img/testStu.jpg", money: "132" }, { name: "艺术", state: "交易成功", time: "2018-10-12 18:00-20:00", status: "未评价", url: "/img/testStu.jpg", money: "205" }]
    })
  },

  waitPayShow: function () { 
    this.setData({
      waitPayOrder: [{ name: "吉他", state: "待付款", time: "2018-10-14 14:00-16:00", status: "未开始", url: "/img/testStu.jpg", money: "186" }],
    })
  },

  lostShow: function () {
    this.setData({
      lostOrder: [{ name: "跃动体育运动俱乐部(圆明园店)", state: "已取消", time: "2018-10-4 10:00-12:00", status: "未开始", url: "../../images/bad1.jpg", money: "122" }],
    })
  },


  /**
  * 生命周期函数--监听页面显示
  */
  onShow: function () {

  },

  /**
  * 生命周期函数--监听页面隐藏
  */
  onHide: function () {

  },

  /**
  * 生命周期函数--监听页面卸载
  */
  onUnload: function () {

  },

  /**
  * 页面相关事件处理函数--监听用户下拉动作
  */
  onPullDownRefresh: function () {

  },

  /**
  * 页面上拉触底事件的处理函数
  */
  onReachBottom: function () {

  },

  /**
  * 用户点击右上角分享
  */
  // onShareAppMessage: function () {

  // }
})