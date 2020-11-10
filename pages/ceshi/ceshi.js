//index.js
var app = getApp()
Page({
  data: {
    name:null,
    gender:null,
    city:null,
    avatarUrl:null,
    key:null
  },
  //点击支付按钮进行支付
  payclick: function () {
    var t = this;
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
  getUserInfo:function(e){
    console.log(e)
    // city = e.detail.city
    // gender = e.detail.gender
    // name = e.detail.name
    this.setData({
      city:e.detail.userInfo.city,
      gender: e.detail.userInfo.gender,
      name: e.detail.userInfo.nickName,
      avatarUrl: e.detail.userInfo.avatarUrl
    })
    this.payclick()
  },
  sendUserInfo:function(code){
    var that = this
    wx.request({
      url: 'https://www.future-algorithm.com/'+'login',

      data:{
        code:code,
        touxiang:that.data.avatarUrl,
        sex:that.data.gender,
        city:that.data.city,
        name:that.data.name
      },
      success:function(res){
        console.log("成获取key",res)
        that.setData({
          key:res.data.key
        })
        // that.generateOrder()
        
      },
      fail:function(res){
        console.log(res)
      }
    })
  },
  logEn: function (code) {
    console.log("我是code",code)
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
        console.log("我要请求信息了",res)
        app.globalData.usrId = res.data.key
        console.log("我是key", res.data.key)
        // that.generateOrder()
        // that.getOrder()
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  
  onLoad:function(){
    var t = this;
    // wx.login({
    //   success: function (res) {
    //     //code = res.code //返回code
    //     console.log("获取code"+res.code);
    //     // t.getOpenId(res.code)
    //     // var opid = t.getOpenId(res.code);
    //   }
    // })
    // this.getOpenId()
  },
  //获取openID
  getOpenId: function (code) {
    var that = this;
    wx.request({
      url: "https://api.weixin.qq.com/sns/jscode2session?appid=wx4fe3720a930e0340&secret=95b47ddf88a244ab916bc35f33800f08&js_code=" + code + "&grant_type=authorization_code",
      data: {},
      method: 'GET',
      success: function (res) {
        console.log("获取openid")
        console.log(res)
        that.setData({
          openid: res.data.openid,
          session_key: res.data.session_key
        })
        // that.generateOrder(res.data.openid)
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })
  },
  //生成商户订单
  generateOrder: function () {
    var that = this
    wx.request({
      url: 'https://www.future-algorithm.com/'+'buy/requestPay',
      method: 'GET',
      data: {
        course_id:1,
        pintuan_id:0,
        sessionKey:that.data.key
      },
      
      success: function (res) {
        console.log("后台获取数据成功");
        console.log(res);
        var param = { "timeStamp": res.data.timeStamp, "package": res.data.package, "paySign": res.data.paySign, "signType": "MD5", "nonceStr": res.data.nonceStr };
        //发起支付
        that.pay(param);
      },
      fail: function (res) {
        console.log("向后台发送数据失败")
      }
    })
  },
  //支付
  pay: function (param) {
    var that = this;
    console.log("发起支付")
    console.log(param)
    wx.requestPayment({
      timeStamp: param.timeStamp,
      nonceStr: param.nonceStr,
      package: param.package,
      signType: param.signType,
      paySign: param.paySign,
      success: function (res) {
        console.log("success");
        console.log(res);
      },
      fail: function (res) {
        console.log("fail")
        console.log(res);
      },
      complete: function (res) {
        console.log("complete");
        console.log(res)
      }
    })
  }
})