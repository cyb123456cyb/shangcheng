 const app = getApp();
Page({
  data: {
    details:"",
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    order_id:"",
    staticImg: app.globalData.staticImg,
    current: 0,
    attitude: true,
    time: true,
    efficiency: true,
    environment: true,
    professional: true,
    code: 1,
    code1: 2,
    pinJ:[5,5,5,5,5,5,5,5],
    userStars: [[
      "/img/sx.png",
      "/img/kx.png",
      "/img/kx.png",
      "/img/kx.png",
      "/img/kx.png",],
      [
        "/img/sx.png",
        "/img/sx.png",
        "/img/kx.png",
        "/img/kx.png",
        "/img/kx.png"],
        [
          "/img/sx.png",
          "/img/sx.png",
          "/img/sx.png",
          "/img/kx.png",
          "/img/kx.png"
      ], [
        "/img/sx.png",
        "/img/sx.png",
        "/img/sx.png",
        "/img/sx.png",
        "/img/kx.png"
      ],
      [
        "/img/sx.png",
        "/img/sx.png",
        "/img/sx.png",
        "/img/sx.png",
        "/img/sx.png"
      ]
    ],
    
    wjxScore: [5, 5, 5, 5, 5, 5, 5, 5,5,5],
    // textarea
    min: 5,//最少字数
    max: 300, //最多字数 (根据自己需求改变) 
    pics: [],
  },

  // 星星点击事件
  starTap: function (e) {
    console.log(e)
    var that = this;
    var level = e.currentTarget.dataset.level;
    var index = e.currentTarget.dataset.index; // 获取当前点击的是第几颗星星
    var pinJ = this.data.wjxScore;
    pinJ[level] = index+1

    // var tempUserStars = this.data.userStars; // 暂存星星数组
    // var len = tempUserStars.length; // 获取星星数组的长度
    // for (var i = 0; i < len; i++) {
    //   if (i <= index) { // 小于等于index的是满心
    //     tempUserStars[i] = "/img/sx.png";
    //   } else { // 其他是空心
    //     tempUserStars[i] = "/img/kx.png"
    //   }
    // }
    // if (level==0)
    // // 重新赋值就可以显示了
    // that.setData({
    //   userStars: tempUserStars
    // })
    // else if (level==1){
    //   that.setData({
    //     userStars2: tempUserStars
    //   })
    // }
    // else {
    //   that.setData({
    //     userStars3: tempUserStars
    //   })
    // }
    this.setData({
      wjxScore: pinJ
    })
  },
  // 标签
  label: function (e) {
    console.log(e)
    var that = this;
    that.setData({
      attitude: !e.currentTarget.dataset.index
    })
  },
  label1: function (e) {
    console.log(e)
    var that = this;
    that.setData({
      time: !e.currentTarget.dataset.index
    })
  },
  label2: function (e) {
    console.log(e)
    var that = this;
    that.setData({
      efficiency: !e.currentTarget.dataset.index
    })
  },
  label3: function (e) {
    console.log(e)
    var that = this;
    that.setData({
      environment: !e.currentTarget.dataset.index
    })
  },
  label4: function (e) {
    console.log(e)
    var that = this;
    that.setData({
      professional: !e.currentTarget.dataset.index
    })
  },
  // 留言
  //字数限制  
  inputs: function (e) {
    // 获取输入框的内容
    var value = e.detail.value;
    // 获取输入框内容的长度
    var len = parseInt(value.length);
    //最多字数限制
    if (len > this.data.max)
      return;
    // 当输入框内容的长度大于最大长度限制（max)时，终止setData()的执行
    this.setData({
      currentWordNumber: len ,//当前字数  
      details: e.detail.value
    });
  },
  // 图片
  choose: function (e) {//这里是选取图片的方法
    var that = this;
    var pics = that.data.pics;
    wx.chooseImage({
      count: 5 - pics.length, // 最多可以选择的图片张数，默认9
      sizeType: ['original', 'compressed'], // original 原图，compressed 压缩图，默认二者都有
      sourceType: ['album', 'camera'], // album 从相册选图，camera 使用相机，默认二者都有
      success: function (res) {
        var imgsrc = res.tempFilePaths;
        pics = pics.concat(imgsrc);
        console.log(pics);
        // console.log(imgsrc);
        that.setData({
          pics: pics,
          // console.log(pics),
        });
      },
      fail: function () {
        // fail
      },
      complete: function () {
        // complete
      }
    })

  },
  uploadimg: function () {//这里触发图片上传的方法
    var pics = this.data.pics;
    console.log(pics);
    app.uploadimg({
      url: 'https://........',//这里是你图片上传的接口
      path: pics//这里是选取的图片的地址数组
    });
  },
  onLoad: function (options) {
    console.log(options.id)
    this.setData({
      order_id:options.id
    })
  },
  // 删除图片
  deleteImg: function (e) {
    var pics = this.data.pics;
    var index = e.currentTarget.dataset.index;
    pics.splice(index, 1);
    this.setData({
      pics: pics
    });
  },
  // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    //所有图片
    var pics = this.data.pics;
    wx.previewImage({
      //当前显示图片
      current: pics[index],
      //所有图片
      urls: pics
    })
  },
  handleBtn() {
    var that = this
    wx.showLoading({
      title: '正在提交',
    })
    wx.request({
      url: app.globalData.urls+'/buy/addComment',
      data:{
        sessionKey:app.globalData.usrId,
        order_id:that.data.order_id,
        comment_detail:that.data.details,
        score1:that.data.wjxScore[0],
        score2: that.data.wjxScore[1],
        score3: that.data.wjxScore[2],
        score4: that.data.wjxScore[3],
        score5: that.data.wjxScore[4],
        score6: that.data.wjxScore[5],
        score7: that.data.wjxScore[6],
        score8: that.data.wjxScore[7],
        score9: that.data.wjxScore[8],
      },
      success:function(res){
        console.log(res)
        wx.hideLoading()
      },
      fail:function(res){
        wx.hideLoading()
        wx.showToast({
          title: '提交失败',
        })
      }
    })
    wx: if (this.data.code == 1) {
      wx.showToast({
        title: '评价成功',
        icon: 'succes',
        duration: 1500,
        mask: true,
        success: function () {
          setTimeout(function () {
            wx.reLaunch({
              url: '../index/index'
            })
          }, 1500)
        }
      });
    } else if (this.data.code1 == 2) {
      console.log("111")
      wx.showToast({
        title: '评价失败',
        image: '../img/fail.png',
        duration: 1500,
        mask: true
      })
    }
  }
})