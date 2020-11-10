var app = getApp();
// pages/AddDynamics/AddDynamics.js
Page({

  /**
   * 页面的初始数据
   *
   * 
   * 
   * 
   * 
   */
  data: {
    imgUrl:null,
    avatarurl:"",
    res:null,
    comment_list:[],
    note_id: null,
    imgList: [],
    status: [],
    upload_photos: [],
    upload_photos_uploaded: [],
    upload_photos_filename: [],
    upload_photos_progress: {},
    upload_pic_max_sum: 4,
    upload_pic_max_sum: 20,
    pic_contents: [],
    pic_contents_updated: [],
    state:0,
    note_likes:0,
    note_type: 1,
    note_content:"",
  },
  downLoad:function(){
    let that = this 
    wx.downloadFile({
      url:that.data.code,
      header:{},
      success:function(res){
        that.setData({ tempFileCode: res.tempFilePath})
      }
    })
  },
 
  showSharePic:function(){
    var that = this
    wx.request({
      url: app.globalData.urls+'share',
      data:{
        note_id:that.data.note_id,
        page:'pages/showDynamic/AddDyynamics'
      },
      success:function(res){
         var base64 = res.data
         console.log(base64.url)
        that.setData({imgUrl:base64.url})
        console.log(res)
        that.savePhoto()
      },
      fail:function(res){
        console.log(res)
      }
    })
  },
  likeNote:function(){
    var that = this
    if (that.data.state==0)
    wx.request({
      url: app.globalData.urls+'note/like',
      data:{
        sessionKey:app.globalData.usrId,
        note_id: that.data.note_id
      },
      success:function(res){
        console.log("我是点赞成功的反馈",res)
        that.setData({
          state:1,
          note_likes:that.data.note_likes+1
        })
      }

    })
    else{
      wx.showToast({
        title: '您已经点过赞了',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  addNoteCmt:function(res){
    var that = this
    wx.request({
      url: app.globalData.urls+'note/addComment',
      data:{
        sessionKey:app.globalData.usrId,
        note_id:that.data.note_id,
        content: that.data.comment_details
      },
      success:function(res){
        console.log(res)
        wx.showToast({
          title: '评论成功！',
        })
      }
    })
  },
  changeInput:function(res){
    console.log(res)
    this.setData({
      comment_details:res.detail.value
    })
  },
  onLoad: function (options) {
    // console.log("我是跳转后的结果",options)
    if (app.globalData.usrId == 2415125)
      this.checkInfo(options)
    let imgs = ""
    if (options.scene){
      let scene = decodeURIComponent(options.scene);
      this.setData({note_id:scene.note_id})
      wx.request({
        url: app.globalData.urls +'note/show',
        data:{
          sessionKey:app.globalData.usrId,
          note_id:note_id
        },
      success:function(res){
          imgs = JSON.parse(res)
      }
      })
    }
    else{
      imgs = JSON.parse(options.res)
      console.log(imgs)

    }
    var that = this
      this.setData({
        windowWidth: wx.getSystemInfoSync().windowWidth*0.8,
        windowHeight: wx.getSystemInfoSync().windowHeight*0.7,
        winHeight: wx.getSystemInfoSync().windowHeight,
        winW: wx.getSystemInfoSync().windowWidth
      })
    console.log(imgs.user_id)
    this.setData({
      avatarurl: imgs.user_touxiang,
      user_id:imgs.user_id
    })
    this.searchDetail()
  
    this.setData({
      title:imgs.note_title,
      note_content:imgs.note_content,
      note_likes: imgs.note_likes,
      state:imgs.state,
      note_id:imgs.note_id,
      user_id :imgs.user_id
    })
    if (options.note_type==1){
      
      this.setData({
        res:imgs.content,
        note_type:1,
      })
      return 
    }   
    console.log(app.globalData.urls)
    this.setData({
      note_type: 2,
      upload_video_show:imgs.video
    })
    wx.request({
      url: app.globalData.urls + 'note/showComment',
      data: {
        sessionKey: app.globalData.usrId,
        note_id: imgs.note_id
      },

      success: function (res) {
        console.log("我是评论内容", res)
        if (res.data[0].code != 0) {
          that.setData({
            comment_list: res.data
          })
        }
      }
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
            url: '/pages/getUserInfo/getUserInfo?page=' + '/pages/showDynamic/AddDynamics?options=' + options
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
  },
  searchDetail:function(res){
    var that = this

    wx.request({
      url: app.globalData.urls+'queryFollow',
      data:{
        sessionKey:app.globalData.usrId,
        user_id:that.data.user_id
      },
    success:function(res){
      console.log("判断是否关注",res.data.errmsg)
      that.setData({
        user_followed:res.data.errmsg
      })
    }
    })
  },
  label: function (e) {
    console.log(e)
    var contentRe = this.data.status
    contentRe[e.target.id] = !contentRe[e.target.id]
    this.setData({
      status: contentRe
    })
  },
  DelImg(e) {
    wx.showModal({
      title: '记忆回收站',
      content: '确定要删除这个照片吗？',
      cancelText: '再看看',
      confirmText: '删除',
      success: res => {
        if (res.confirm) {
          this.data.imgList.splice(e.currentTarget.dataset.index, 1);
          this.setData({
            imgList: this.data.imgList
          })
        }
      }
    })
  },
  followUser:function(res){
    var that = this
    // console.log("我是被关注用户", this.data.user_id)
    wx.request({
      url: app.globalData.urls + 'follow',
      data: {
        sessionKey: app.globalData.usrId,
        star_id: that.data.user_id,

      },
      success: function (res) {
        console.log("我是关注按钮", res)
        that.setData({
          user_followed:1
        })
      }
    })
  },
  unFollowUser:function(res){
    var that = this
    // console.log("我是被关注用户", this.data.user_id)
    wx.request({
      url: app.globalData.urls + 'unfollow',
      data: {
        sessionKey: app.globalData.usrId,
        star_id: that.data.user_id
      },
      success: function (res) {
        console.log("我是关注按钮", res)
        that.setData({
          user_followed: 0
        })
      }
    })
  },
  uploadimg: function (data) {
    var that = this
    var i = data.i ? data.i : 1 //当前上传的哪张图片
    var success = data.success ? data.success : 0//上传成功的个数
    data.success = success
    console.log("我要上传的图片路径是", data.path)
    console.log("我是第", i)
    

    var fail = data.fail ? data.fail : 0;//上传失败的个数
    wx.uploadFile({
      url: app.globalData.urls + 'note/postPic',
      filePath: data.path[i - 1],
      name: 'pic',
      formData: {
        sessionKey: app.globalData.usrId,
        note_id: that.data.note_id,
        num: i,
        content: that.data.pic_contents[i - 1]
      },
      success: (resp) => {
        success++;//图片上传成功，图片上传成功的变量+1
        console.log(resp)
        console.log(i);
      },
      fail: (res) => {
        fail++;//图片上传失败，图片上传失败的变量+1
        console.log('fail:' + i + "fail:" + fail, "失败原因是:", res);
      },
      complete: () => {
        console.log(i);
        i++;//这个图片执行完上传后，开始上传下一张            
        if (i - 1 == data.path.length) {   //当图片传完时，停止调用          
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
          wx.hideLoading()
          wx.navigateBack({
            delta: 1
          })
        } else {//若图片还没有传完，则继续调用函数                
          console.log(i);
          data.i = i;
          data.success = success;
          data.fail = fail;
          that.uploadimg(data);
        }
      }
    });
  },
  ChooseImage() {
    var that = this;
    wx.chooseImage({
      count: 1, //默认9
      sizeType: ['compressed'], /
      sourceType: ['album', "camera"], //从相册选择
      success(res) {
        var d = that.data.imgList
        if (d.length >= that.data.upload_pic_max_sum) {
          app.showToastNone("最多上传" + that.data.upload_pic_max_sum + "图片")
          return
        };
        var data = that.data.imgList
        data[data.length] = res.tempFilePaths[0]
        console.log(res.tempFilePaths)
        that.setData({
          imgList: data
        })
      }
    })
  },

  submitNoteCreate: function (e) {
    var that = this
    console.log("我是这里的输出", e)
    var title = e.detail.value.title
    var content = e.detail.value.content
    var tip = []
    var len = 0
    console.log(this.data.status)
    wx.showLoading({
      title: '正在上传中',
      mask: true
    })
    wx.request({
      url: app.globalData.urls + 'note/add',
      data: {
        sessionKey: app.globalData.usrId,
        note_title: title,
        note_content: content,
        note_hide: 0,
      },
      success: function (res) {

        console.log("我是动态的反馈", res)
        that.setData({
          note_id: res.data.note_id
        })
        if (that.data.note_type == 1)
          that.uploadimg({ path: that.data.imgList })
        else if (that.data.note_type == 2)
          that.uploadVideo({ path: that.data.upload_video_show })
      }
    })
  },
  submit: function (e) {
    console.log(e)
    var that = this;
    wx.uploadFile({
      url: 'http://47.97.219.21/addNote', 
      filePath: that.data.imgList[0],
      name: 'note_pic',
      formData: {
        'note_hide': 0,
        'note_time': "2019-11-15 15:37:00",
        'user_id': 1,
        'note_content': "test",
        'note_title': "sdsd",
        'sessionKey': "2415125",
      },
      success(res) {
        const data = res.data
        console.log(res)
        //do something
      },
      fail(res) {
        console.log(res)
      }
    })
    wx.showToast({
      title: '发布成功',
      icon: 'success',
      duration: 1500,
      mask: false,
    })
    setTimeout(function () {
      wx.navigateBack({
        delta: 1
      })
    }, 1500)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

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
  noteAction: function (res) {
    let that = this
    if (this.data.user_id==app.globalData.user_id ) wx.showActionSheet({
      itemList: ["返回主页", "删除动态"],
      success: function (t) {
        0 == t.tapIndex ? wx.navigateBack({
          delta:1
        }): 1 == t.tapIndex && wx.showModal({
          success: function (t) {
            t.confirm ? that.removeNote() : t.cancel;
          }
        });
      }
    })
  },
  
  onShareAppMessage: function () {
  },
  onPicContentInput: function (t) {
    console.log("onPicContentInput", t);
    var e = t.currentTarget.dataset.index, o = t.detail.value, a = this.data.pic_contents;
    a[e] = o;
    var i = this.data.pic_contents_updated;
    i[e] = !0, this.setData({
      pic_contents: a,
      pic_contents_updated: i
    });
  }
})

