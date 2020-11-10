const app = getApp();

Page({
    data: {
      course_id:0,
      item_price:0,
      course_detail:[],
      course_teacher:"",
      starting_time:"",
      course_place:"",
      comment:[],
      pingtuan_id:0,
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
  generateOrder: function () {
    var that = this
    console.log("我是拼团id", that.data.pingtuan_id)
    console.log("我是course_id",that.data.course_id)
    wx.request({
      
      url: 'https://www.future-algorithm.com/' + 'buy/requestPay',
      method: 'GET',
      data: {
        course_id: that.data.course_id,
        pingtuan_id: that.data.pingtuan_id,
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
      if (app.globalData.usrId==2415125)
        this.checkInfo(options)
      
      var that = this
      wx.getUserInfo({
        success: function (res) {
          that.setData({
            img:res.userInfo.avatarUrl,
            name:res.userInfo.nickName
          })
          console.log(res.userInfo.avatarUrl)
        }
      })
      this.getDetail(options);
      this.getDeviceInfo();
      console.log("我输出了",options.id)
        that.setData({
          course_id:options.id
        })
        console.log("我输出了","我是course_id",that.data.course_id)
      wx.request({
        url: app.globalData.urls+'/courseInf',
        data:{
          sessionKey:app.globalData.usrId,
          course_id:options.id
        },
        success:function(res){
          console.log("请叫我结果",res.data)
        let re = JSON.parse('{'+res.data+'}')
        that.setData({
          swiperlist:re.course_pic,
          item_count:re.course.course_count,
          item_name:re.course.course_title,
          item_price:re.course.course_price,
          comment:re.comment,
          course_place:re.course.course_place,
          starting_time:re.course.course_time,
          course_teacher:re.course.course_teacher,
          pingtuan_id:re.course.pingtuan
        })
          if (options.pt) {
            that.setData({
              pingtuan_id: options.pt
            })

          }
        },
        fail:function(res){
          console.log("我失败了",res)
        }
      })
      
    },
     tabSelect(e) {
    this.setData({
      currtab: e.currentTarget.dataset.id,
    })
  },
  checkInfo: function (options) {
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
                app.globalData.gender = res.userInfo.gender,
                that.login_en()
            },

            fail(res) {
              console.log("获取用户信息失败", res)
            }
          })
        } else {
          console.log("未授权=====")
          wx.navigateTo({
            url: '/pages/getUserInfo/getUserInfo?page='+'/pages/goods/details?options='+options
          })
        }
      }
    })
  },
  login_en: function () {
    console.log("我执行了登录函数")
    var that = this
    wx.login({
      success: function (res) {
        console.log("我获取的code", res)
        that.logEn(res.code)
      },
      fail: function (res) {
        console.log("我失败了", res)
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
        console.log("我是登录", res)
        app.globalData.usrId = res.data.key
        app.globalData.user_id = res.data.user_id
        console.log("我是key", res.data.key)
        that.loadImages();
        that.loadImages2();
        // that.generateOrder()
        // that.getOrder()
      },
      fail: function (res) {
        console.log(res)
      }
    })
  }
});
