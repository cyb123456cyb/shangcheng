const app = getApp()
Page({
  data: {
    latitude:0,
    logitude:0,
    Category:[],
    Goods:[],
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    Custom: app.globalData.Custom,
    TabCur: 0,
    MainCur: 0,
    VerticalNavTop: 0,
    list: [],
    load: true
  },
  onLoad() {
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
    this.setList()
    let list = [{}];
    for (let i = 0; i < 26; i++) {
      list[i] = {};
      list[i].name = String.fromCharCode(65 + i);
      list[i].id = i;
    }
    this.setData({
      list: list,
      listCur: list[0]
    })
  },
  setList:function(){
   var that = this
   console.log("我是成功的结果",app.globalData.usrId)
   wx.request({
     url: app.globalData.urls+'/showAll',
    data:{
      sessionKey:app.globalData.usrId,
      latitude:31.4,
      longitude:120.5215
    },
    success:function(res){
      console.log("我是成功的结果",res.data)
      let data_temp = JSON.parse('{' + res.data + '}')
      console.log(data_temp) 
      console.log(data_temp.course)
      that.setData({
        Category:data_temp.classify.classify_name,
        Goods:data_temp.course
      })
      console.log(res.data.classify)
    },
    fail:function(res){
        console.log("我是结果",res)
    }
   })
  },
  onReady() {
    wx.hideLoading()
  },
  Submit:function(res){
    var that = this 
    console.log(res)
    wx.request({
      url: app.globalData.urls+'courseSearch',
      data:{
        sessionKey:app.globalData.usrId,
        search:res.detail.value.searchTitle
      },
      success:function(res){
        console.log("我是搜索结果:",res)
        var categ = that.data.Category
        var Goods = that.data.Goods
        if (categ[categ.length-1]=='搜索')
          Goods[categ.length-1] = res.data
        else{
          categ[categ.length] ='搜索'
          Goods[categ.length-1] = res.data
        }
        that.setData({
          Goods:Goods,
          Category:categ,
          MainCur:categ.length-1,
          TabCur: categ.length - 1,
          VerticalNavTop: (categ.length - 1) * 50
        })
      }
    })
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      MainCur: e.currentTarget.dataset.id,
      VerticalNavTop: (e.currentTarget.dataset.id - 1) * 50
    })
  },
  getUserLocation:function(res){
    let that = this
    wx.getLocation({
      success: function(res) {     
        if (res.authSetting['scope.userLocation'] != undefined && res.authSetting['scope.userLocation'] != true)
        //用户拒绝授权，请求重新授权
        wx.showModal({
          title: '',
          content: '需要获取您的地理位置，请确认授权',
          success:function(res){
            if (res.cancel) {
              wx.showToast({
                title: '拒绝授权',
                icon: 'none'
              })
              setTimeout(() => {
                wx.navigateBack()
              }, 1500)
            } else if (res.confirm) {
              wx.openSetting({
                success: function (dataAu) {
                  // console.log('dataAu:success', dataAu)
                  if (dataAu.authSetting["scope.userLocation"] == true) {
                    //再次授权，调用wx.getLocation的API
                    vm.getLocation(dataAu)
                  } else {
                    wx.showToast({
                      title: '授权失败',
                      icon: 'none'
                    })
                    setTimeout(() => {
                      wx.navigateBack()
                    }, 1500)
                  }
                } 
              })
            }
          }
        })
        },
    })
  },
  getLocation: function (userLocation) {
    let vm = this
    wx.getLocation({
      type: "wgs84",
      success: function (res) {
        // console.log('getLocation:success', res)
        var latitude = res.latitude
        var longitude = res.longitude
        vm.setData({
          latitude:latitude,
          longitude:longitude
        })
        // vm.getDaiShu(latitude, longitude)
      },
      fail: function (res) {
        // console.log('getLocation:fail', res)
        if (res.errMsg === 'getLocation:fail:auth denied') {
          wx.showToast({
            title: '拒绝授权',
            icon: 'none'
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
          return;
        }
        if (!userLocation || !userLocation.authSetting['scope.userLocation']) {
          vm.getUserLocation()
        } else if (userLocation.authSetting['scope.userLocation']) {
          wx.showModal({
            title: '',
            content: '请在系统设置中打开定位服务',
            showCancel: false,
            success: result => {
              if (result.confirm) {
                wx.navigateBack()
              }
            }
          })
        } else {
          wx.showToast({
            title: '授权失败',
            icon: 'none'
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 1500)
        }
      }
    })
  },
  VerticalMain(e) {
    let that = this;
    let list = this.data.list;
    let tabHeight = 0;
    if (this.data.load) {
      for (let i = 0; i < list.length; i++) {
        let view = wx.createSelectorQuery().select("#main-" + list[i].id);
        view.fields({
          size: true
        }, data => {
          list[i].top = tabHeight;
          tabHeight = tabHeight + data.height;
          list[i].bottom = tabHeight;     
        }).exec();
      }
      that.setData({
        load: false,
        list: list
      })
    }
    let scrollTop = e.detail.scrollTop + 20;
    for (let i = 0; i < list.length; i++) {
      if (scrollTop > list[i].top && scrollTop < list[i].bottom) {
        that.setData({
          VerticalNavTop: (list[i].id - 1) * 50,
          TabCur: list[i].id
        })
        return false
      }
    }
  }
})