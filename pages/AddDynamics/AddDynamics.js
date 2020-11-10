var app = getApp();
// pages/AddDynamics/AddDynamics.js
Page({


  data: {
    note_id:null,
    word:"我是测试",
    imgList: [],
    title:"我是标题",
    status:[],
    additional:[],
     upload_photos: [],
    upload_photos_uploaded: [],
    upload_photos_filename: [],
    upload_photos_progress: {},
    upload_pic_max_sum:4,
    upload_video_max_duration: 60,
    upload_video_min_duration: 3,
    upload_pic_max_sum: 20,
    upload_video_show_max_width: 260,
    upload_video_show_width: 200,
    upload_video_show_height: 200,
    pic_contents:[],
    pic_contents_updated:[],
    note_type:1,
    upload_video_show:'',
    upload_video_max_duration:60,
    upload_video:null,
    upload_video_width: null,
    upload_video_height: null,
    upload_video_duration:null,
    upload_video_size: null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log(app.globalData.urls)
    this.setData({
      note_type:options.note_type
    })
    wx.request({
      url: app.globalData.urls+'note/showTopic',
      data:{
        sessionKey: app.globalData.usrId
      },
      success:function(res){
        console.log(res)
        that.setData({
          additional:res.data.data
        })
        // var status =[]
        // [res.data.data.length - 1] = 0
      },
      fail:function(res){
        console.log(res)
      }
    })
  },
 
  label:function(e){
    console.log(e)
    var contentRe = this.data.status
    contentRe[e.target.id] = !contentRe[e.target.id]
    this.setData({
      status:contentRe
    })
  },
  
  bindVideoAdd: function (t) {

    var e = this
    wx.chooseVideo({
      sourceType: ["album", "camera"],
      maxDuration: 60,
      compressed: true,
      camera: ["back"], 
      success: function (t) {
        
        if (console.log(t), t.duration > e.data.upload_video_max_duration || t.duration < e.data.upload_video_min_duration) wx.showModal({
          title: "温馨提示",
          content: "支持" + e.data.upload_video_min_duration + "~" + e.data.upload_video_max_duration + "秒",
          confirmText: "我知道了",
          showCancel: !1,
          success: function (t) { }
        }); else {
          e.setData({
            upload_video_show: t.tempFilePath
          });
          var o = e.data.upload_video_show_max_width;
          t.width >= t.height ? e.setData({
            upload_video_show_width: o,
            upload_video_show_height: o * t.height / t.width
          }) : e.setData({
            upload_video_show_width: o * t.width / t.height,
            upload_video_show_height: o
          }), e.setData({
            upload_video: t.tempFilePath,
            upload_video_width: t.width,
            upload_video_height: t.height,
            upload_video_duration: t.duration,
            upload_video_size: t.size
          });
        }
      }
    });
  },
  bindRemoveVideo:function (t) {
    var e = this 
    console.log(t), e.setData({
      upload_video: "",
      upload_video_show: ""
    });
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
    console.log(this.data.imgList)
  },

  uploadVideo: function (e) {
    console.log("我要开始上传视频了")
    var that =this
    wx.uploadFile({
      //；路径需要修改
      url: app.globalData.urls + "note/postVideo",
      filePath: e.path,
      name: "video",
      // header: {
      //   "User-Ticket": t.getUserTicket()
      // },
      formData: {
        note_id: that.data.note_id,
        sessionKey:app.globalData.usrId,

      },
      success:function(res){
        console.log("我是视频上传返回的结果",res)
        wx.hideLoading()
        wx.navigateBack({
          delta:1
        })
      },
      fail:function(res){
        console.log(res)
      }
    });
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

  uploadimg: function (data){
    var that = this

    var i=data.i ? data.i : 1 //当前上传的哪张图片
    var success=data.success ? data.success :0//上传成功的个数
    data.success = success
    console.log("我要上传的图片路径是",data.path)
    console.log("我是第",i)
    //  wx.uploadFile({
    //   url: app.globalData.urls+'note/postPic',
    //    filePath: that.data.imgList[0],
    //    name: 'pic',
    //   formData: {
    //     sessionKey:app.globalData.usrId,
    //     note_id:that.data.note_id,
    //     num:1
    //   },
    //   success:function(res){
    //       console.log(res)
    //   },
    //   fail:function(res){
    //     console.log(res)
    //   }
    //  })

    var fail=data.fail ? data.fail : 0;//上传失败的个数
    wx.uploadFile({
      url: app.globalData.urls+'note/postPic',
      filePath: data.path[i-1],
      name: 'pic',
      formData: {
        sessionKey:app.globalData.usrId,
        note_id:that.data.note_id,
        num:i,
        content:that.data.pic_contents[i-1]
      },
      success: (resp) => {
        success++;//图片上传成功，图片上传成功的变量+1
        let re = JSON.parse(resp.data)
        console.log('我是结果',re.errcode)
        if (re.errcode!=0){
          wx.hideLoading()
          wx.showToast({
            title: '图文存在敏感信息，上传失败'
          })
          wx.request({
            url: app.globalData.urls + 'note/delete',
            data: {
              sessionKey: app.globalData.usrId,
              note_id: that.data.note_id
            },
            success: function (res) {
              console.log("删除成功?", res)
            },
            fail: function (res) {
              console.log("删除失败", res)
            }
          })
          wx.navigateBack({
            delta:1
          })
        }
        console.log(i);
        //这里可能有BUG，失败也会执行这里,所以这里应该是后台返回过来的状态码为成功时，这里的success才+1 
      },
      fail: (res) => {
        fail++;//图片上传失败，图片上传失败的变量+1
        console.log('fail:' + i + "fail:" + fail,"失败原因是:",res);
      },
      complete: () => {
        console.log(i);
        i++;//这个图片执行完上传后，开始上传下一张            
        if (i -1== data.path.length) {   //当图片传完时，停止调用          
          console.log('执行完毕');
          console.log('成功：' + success + " 失败：" + fail);
          wx.hideLoading()
          wx.navigateBack({
            delta:1
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
    // wx.chooseImage({
    //   count: 4, //默认9
    //   sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
    //   sourceType: ['album'], //从相册选择
    //   success: (res) => {
    //     if (this.data.imgList.length != 0) {
    //       console.log(res.tempFilePaths)
    //       this.setData({
    //         imgList: this.data.imgList.concat(res.tempFilePaths)
    //       })
    //     } else {
    //       console.log(res.tempFilePaths)
    //       this.setData({
    //         imgList: res.tempFilePaths
    //       })
    //     }
    //   }
    // });





    
  var that = this;
    wx.chooseImage({
            count: 1, //默认9
      sizeType: [ 'compressed'], //可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', "camera"], //从相册选择
      success(res) {
        var d = that.data.imgList
        if (d.length >= that.data.upload_pic_max_sum) {
          app.showToastNone("最多上传" + that.data.upload_pic_max_sum + "图片")
          return
        };
        var data = that.data.imgList
        data[data.length] =res.tempFilePaths[0]
        console.log(res.tempFilePaths)
        // console.log(app.globalData.userID)
          // console.log(that.tempFilePaths)
          that.setData({
            imgList: data
          })
        
        console.log("我是测试结果")
       }
    })
  },

  submitNoteCreate:function(e){
    var  that = this
    for(var i = 0 ; i <that.data.pic_contents;i++){
      if (that.data.pic_contents[i]==''){
        wx.showToast({
          title: '您的内容还有空白哦',
        })
        return 
      }
    }
    console.log("我是这里的输出",e)
    var title = e.detail.value.title
    var content = e.detail.value.content
    var tip = []
    var len = 0
    console.log(this.data.status)
    for(var i = 0 ; i<this.data.additional.length;i++){
      if (this.data.status[i] ==true){
        tip[len] = this.data.additional[i]
       len = len+1          
       console.log("结果")
      }
    }
    if (len>5){
      wx.showToast({
        title: '标签数量不能大于5个噢',
        icon: "none",
        duration: 2e3
      })
      return
    }
    wx.showLoading({
      title: '正在上传中',
      mask:true
    })
    wx.request({
      url: app.globalData.urls + 'note/add',
      data:{
        sessionKey:app.globalData.usrId,
        note_title:title,
        note_content:content,
        note_hide:0,
        topic1:tip[0],
        topic2:tip[1],
        topic3:tip[2],
        topic4:tip[3],
        topic5:tip[4]
      },
      success:function(res){
        
        console.log("我是动态的反馈" ,res)
        that.setData({
          note_id:res.data.note_id
        })
        if (that.data.note_type == 1)
        that.uploadimg({path:that.data.imgList})
        else if (that.data.note_type == 2)
          that.uploadVideo({ path: that.data.upload_video_show})
      }
    })
  },
  submit:function(e){
    console.log(e)
    var that=this;
    wx.uploadFile({
      url: 'http://47.97.219.21/addNote', //仅为示例，非真实的接口地址
      filePath: that.data.imgList[0],
      name: 'note_pic',
      formData: {
            'note_hide':0,
            'note_time':"2019-11-15 15:37:00",
            'user_id':1,
            'note_content':"test",
            'note_title': "sdsd",
            'sessionKey':"2415125",
      },
      success(res) {
        const data = res.data
        console.log(res)
        //do something
      },
      fail(res){
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
        delta:1
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

  // submitNoteCreate:function(res){
  //   console.log(res)
  // },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  },
  // }, uploadPhoto: function (e) {
  //   wx.uploadFile({
  //     url: t.globalData.configs.api_url_prefix + "note_upload_pic",
  //     filePath: e.path,
  //     name: "file",
  //     header: {
  //       "User-Ticket": t.getUserTicket()
  //     },
  //     formData: {
  //       note_id: e.note_id,
  //       content: e.content
  //     },
  //     success: e.success
  //   });
  // },
  onPicContentInput:function(t){
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

