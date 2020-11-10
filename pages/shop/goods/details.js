const app = getApp();

Page({
    data: {
      item_price:0,
      course_detail:[],
      course_teacher:"",
      starting_time:"",
      course_place:"",
      comment:[],
      pingtuan_id:null,
      item_name:"",
      num:10,
      img:"",
      name:"",
      StatusBar: app.globalData.StatusBar,
      CustomBar: app.globalData.CustomBar, 
      deviceH:800,
      deviceW:0,
      currtab: 0,
      nav: ["详情", "讲师信息", "用户评价"],
        id:0,
        StatusBar: app.globalData.StatusBar + 6,
        TabbarBot: app.globalData.tabbar_bottom,
        swiperlist: [
            'https://image.weilanwl.com/img/4x3-1.jpg',
            'https://image.weilanwl.com/img/4x3-2.jpg',
            'https://image.weilanwl.com/img/4x3-3.jpg',
            'https://image.weilanwl.com/img/4x3-4.jpg',
        ],
    },
    buyCourse:function(){
      this.generateOrder()
    },
  checkInfo: function () {
    var that = this
    wx.getSetting({
      success(res) {
        // console.log("res", res)
        if (res.authSetting['scope.userInfo']) {
          console.log("已授权=====")
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            lang: "zh_CN",
            success(res) {
              console.log("获取用户信息成功", res)
              app.globalData.name = res.userInfo.nickName,
                app.globalData.avatarUrl = res.userInfo.avatarUrl,
                app.globalData.city = res.userInfo.city,
                app.globalData.gender = res.userInfo.gender
                that.login_en()
            },
            fail(res) {
              console.log("获取用户信息失败", res)
            }
          })
        } else {
          console.log("未授权=====")
          that.showSettingToast("请授权")
        }
      }
    })
  },

  login_en: function () {
    var that = this
    wx.login({
      success: function (res) {
        that.logEn(res.code)
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
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
  showSettingToast: function (e) {
    wx.navigateTo({
      url: '../getUserInfo/getUseInfo',
    })
    wx.showModal({
      title: '提示！',
      confirmText: '去登陆',
      showCancel: false,
      content: e,
      success: function (res) {
        if (res.confirm) {
          wx.navigateTo({
            url: '../../getUserInfo/getUserInfo',
          })
        }
      }
    })
  },
  generateOrder: function () {
    var that = this
    wx.request({
      url: 'https://www.future-algorithm.com/' + 'buy/requestPay',
      method: 'GET',
      data: {
        course_id: that.data.course_id,
        pingtuan_id: 0,
        sessionKey: app.globalData.usrId
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
  },
  getDeviceInfo: function () {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          deviceW: res.windowWidth,
          deviceH: res.windowHeight
        })
        console.log(res.windowHeight)
      }
    })
  },
  tabChange(e){
    this.setData({
      currtab:e.detail.current
    })
  },
  getDetail:function(option){
    var that = this 
    wx.request({
      url: app.globalData.urls + '/coursePic',
      data: {
        sessionKey: app.globalData.usrId,
        course_id:option.id 
      },
      success: function (res) {
        console.log("我是结果",res)
        that.setData({
          course_detail: res.data.pic
        })
      },
      fail:function(res){
        console.log(res)
      }
    })
    wx.request({
      url: app.globalData.urls + '/teacherPic',
      data: {
        sessionKey: app.globalData.usrId,
        course_id: option.id
      },
      success: function (res) {
        console.log("我是结果", res)
        that.setData({
          teacher_detail: res.data.pic
        })
      },
      fail: function (res) {
        console.log(res)
      }
    })
  },
    onLoad: function (options) {
      var that = this
      console.log("我是课程id", options.id)
      that.setData({
        id: options.id
      })
    if (options.id)
      this.checkInfo()
      if (options.pintuan_id)
        this.setData({
          pintuan_id:options.pintuan_id
        })
      wx.getUserInfo({
        success: function (res) {
          that.setData({
            img:res.userInfo.avatarUrl,
            name:res.userInfo.nickName
          })
          console.log(res.userInfo.avatarUrl)
        }
      })
      this.getDetail(options)
      this.getDeviceInfo()
      
      wx.request({
        url: app.globalData.urls+'/courseInf',
        data:{
          sessionKey:app.globalData.usrId,
          course_id:options.id
        },
        success:function(res){
          console.log("获取信息成功",res)
          console.log(res.data)
        let re = JSON.parse('{'+res.data+'}')
        console.log("我是course_照片"+re.course_pic)
        if(re.comment[0].code == 0){
          re.comment = []
        }
        that.setData({
          swiperlist:re.course_pic,
          item_count:re.course.course_count,
          item_name:re.course.course_title,
          item_price:re.course.course_price,
          comment:re.comment,
          course_place:re.course.course_place,
          starting_time:re.course.course_time,
          course_teacher:re.course.course_teacher,
          course_id:re.course.course_id,
          pingtuan_id:re.course.pingtuan,
          course_detail:re.course_pic,
        })
        console.log("我要输出了::"+that.data)
        },
        fail:function(res){
              console.log("获取信息失败",res)
        }
      })
      wx.request({
        url: app.globalData.urls+'/teacherPic',
        data:{
          sessionKey: app.globalData.usrId,
          course_id: options.id
        },
        success:function(res){
          console.log("我是教师成功信息",res.data.pic)
          // that.setData({
          //   teachers_deta
          // })
            // console.log("我是教师信息"+JSON.stringify(res))
        },
        fail:function(res){
          console.log("我是教師失敗信息"+res)
        }
      })
    },
     tabSelect(e) {
    this.setData({
      currtab: e.currentTarget.dataset.id,
    
    })
  }
});

