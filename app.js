//app.js
App({
  
    onLaunch: function () {
      var that = this;
      that.url();
      var conf = require("/config.js")
      var res = conf.test()
      console.log(res)
      // this.globalData.avatar = res.avatarUrl
      // this.globalData.nickName=res.nickName
      // this.globalData.city =res.city
      // console.log(this.globalData.city)
    wx.getSystemInfo({
      success: e => {
        this.globalData.StatusBar = e.statusBarHeight;
        let custom = wx.getMenuButtonBoundingClientRect();
        this.globalData.Custom = custom;  
        this.globalData.CustomBar = custom.bottom + custom.top - e.statusBarHeight;
      }
    })
    wx.login({

      success:function(res){
          console.log(res.code)

      }
    })  
    },
  showToastNone: function (t) {
    wx.showToast({
      title: t,
      icon: "none",
      duration: 1e3
    });
  },
    config:require('config.js'),
    url:function(){
      this.globalData.urls = this.config.url
      this.config.test()
      console.log(this.globalData.urls)
    },
    globalData: {
      urls:null,
      city:"",
      avatarUrl:null,
      name:null,
      gender:null,
        userInfo: null,
        usrId:2415125
    }
});

