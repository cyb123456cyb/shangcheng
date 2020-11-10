const app = getApp();

Page({
	data: {
    options:null,
		StatusBar: app.globalData.StatusBar,
		CustomBar: app.globalData.CustomBar,
		hidden: true,
		current: 0,lines: 0,
    swiper:[],
		swiperlist: [{
			id: 0,
			url: 'https://image.weilanwl.com/img/4x3-1.jpg',
			type: 1
		}, {
			id: 1,
			url: 'https://image.weilanwl.com/img/4x3-2.jpg',
			type: 2

		}, {
			id: 2,
			url: 'https://image.weilanwl.com/img/4x3-3.jpg',
			type: 3
		}, {
			id: 3,
			url: 'https://image.weilanwl.com/img/4x3-4.jpg',
			type: 4
		}],
		iconList: [{
			id: 1,
			icon: 'questionfill',
			color: 'red',
			name: '好处',
			type: 1
		}, {
			id: 2,
			icon: 'group_fill',
			color: 'orange',
			name: '加入',
			type: 2
		}, {
			id: 3,
			icon: 'shopfill',
			color: 'yellow',
			name: '经营',
			type: 1
		}, {
			id: 4,
			icon: 'discoverfill',
			color: 'olive',
			name: '收益',
			type: 1
		}],
		Headlines: [{
			id:1,
			title:"测试标题1",
			type: 1
		},{
			id:2,
			title:"测试标题2",
			type: 2
		},{
			id:3,
			title:"测试标题3",
			type: 3
		},{
			id:4,
			title:"测试标题4",
			type: 4
		}],
	goods:null
	},
	onLoad: function (options) {
    this.setData({
      options:options
    })
      this.checkInfo()
    if (options.scene) {
      let scene = decodeURIComponent(options.scene);
      let note_id=scene.note_id
      }
		/*console.log(app.globalData.StatusBar);
		console.log(app.globalData.CustomBar);*/
    this.getNav()
    this.getHotClass()
	    wx.getSetting({
	        success: res => {
		        if (!res.authSetting['scope.userInfo']) {
		            wx.redirectTo({
		              	url: '/pages/auth/auth'
		            })
		        }
	        }
	    });

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
            lang:"zh_CN",
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
          that.showSettingToast("请授权")
          wx.navigateTo({
            url: '/pages/getUserInfo/getUserInfo?pages=' + '/pages/home/index/index?options='+that.data.options
          })
        }
      }
    })
  },
  login_en:function(){
    console.log("我执行了登录函数")
    var that = this
    wx.login({
      success:function(res){
        console.log("我获取的code",res)
        that.logEn(res.code)
      },
      fail:function(res){
        console.log("我失败了",res)
      }
    })
  },
  logEn:function(code){
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
        console.log("我是登录",res)
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
  getNav:function(){
    var that = this
    wx.request({
      url: app.globalData.urls+'/lunbo/show?',
      data:{
        sessionKey:app.globalData.usrId
      },
      success:function(res){
        console.log("我是输出",res.data.url)
        let re = res.data.url
        that.setData({
            swiper:re
        })
      }
    })
  },
  getHotClass:function(){
    var that = this
    console.log("开始测试" + app.globalData.usrId)
    wx.request({
      url: app.globalData.urls + '/recCourse',
      data:{
        sessionKey: app.globalData.usrId,
        city: "杭州"
      },
      success:function(res){
        console.log(res.data)
        that.setData({
          goods:res.data 
        })
        console.log("我要获取课程了",res)
      },
      fail:function(res){
        console.log(res)  
      }    
    })
  },
	swiperchange: function (e) {
		this.setData({
			current:e.detail.current
		});
	},
	swipclick: function (e) {
		let that = this;
		var swip = that.data.swiperlist[that.data.current];
		console.log(swip);
		if (swip.type === 1) {
			wx.navigateTo({
				url: '/pages/home/doc/index?id=' + swip.id
			});
		}
	},
	lineschange: function (e) {
		this.setData({
			lines:e.detail.current
		});
	},
	linesclick: function (e) {
		let that = this;
		var swip = that.data.Headlines[that.data.current];
		console.log(swip);
		if (swip.type === 1) {
			wx.navigateTo({
				url: '/pages/home/doc/index?id=' + swip.id
			});
		}
	},
	itemckcred: function (e) {
		let that = this;
		var item = e.currentTarget.dataset;
		console.log(item.index,item.itemtype)
		if (item.itemtype === 1) {
			wx.navigateTo({
				url: '/pages/home/doc/index?id=' + item.index
			});
		}
		if (item.itemtype === 2) {
			wx.navigateTo({
				url: '/pages/home/joinus/index?id=' + item.index
			});
		}
	},
	search: function () {
		wx.navigateTo({
			url: '/pages/home/search/index'
		});
	}
});
