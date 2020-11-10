var app = getApp()
let col1H = 0;
let col2H = 0;
// pages/myNote/myNote.js

Page({

  /**
   * 页面的初始数据
   */
  data: {
    images:[],
    col1: [],
    col2: [],
    scrollH:0,
    imgWidth:0,
    loadingCount: 0,
    images: [],
    totalImg:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.48;
        let scrollH = wh;
        this.setData({
          scrollH: scrollH,
          imgWidth: imgWidth,
          wh: wh
        });
      }
  })
    this.loadImages()
  },
      onImageLoad: function (e) {
        console.log("我执行了3")
        console.log(e.currentTarget.id)
        let imageId = e.currentTarget.id;
        let oImgW = e.detail.width; //图片原始宽度
        let oImgH = e.detail.height; //图片原始高度
        let imgWidth = this.data.imgWidth; //图片设置的宽度
        let scale = imgWidth / oImgW; //比例计算    
        let imgHeight = oImgH * scale; //自适应高度
        let images = this.data.images;
        let imageObj = null;
        for (let i = 0; i < images.length; i++) {
          let img = images[i];
          if (img.id == imageId) {
            imageObj = img;
            break;
          }
        }
        imageObj.height = imgHeight;
        let loadingCount = this.data.loadingCount - 1;
        let col1 = this.data.col1;
        let col2 = this.data.col2;
        //判断当前图片添加到左列还是右列
        if (col1H <= col2H) {
          col1H += imgHeight;
          col1.push(imageObj);
        } else {
          col2H += imgHeight;
          col2.push(imageObj);
        }
        let data = {
          loadingCount: loadingCount,
          col1: col1,
          col2: col2
        };
        //当前这组图片已加载完毕，则清空图片临时加载区域的内容
        if (!loadingCount) {
          data.images = [];
        }
        this.setData(data);
      },
      loadImages: function () {
        var that = this
        // console.log("我要开始加载数据；了")
        wx.request({
          url: app.globalData.urls + 'note/myNote',
          data: {
            sessionKey: app.globalData.usrId
          },
          success: function (res) {
            console.log("我是结果", res.data)
            // }
            let totalImg = that.data.totalImg
            // console.log(res.data[0].note_pic)
            var imgs = []
            for (var i = 0; i < res.data.length; i++) {
              let tes = { pic: "", id: null, total_id: 0 }
              if (res.data[i].video)
                tes.pic = res.data[i].note_pic[0]
              else
                tes.pic = res.data[i].content[0][0]
              var id = totalImg.length
              tes.id = id
              // tes.total_id = that.data.imgId
              console.log(id)
              totalImg.push(res.data[i])
              // console.log(tes)
              imgs[i] = tes
            }
            console.log(imgs)
            that.setData({
              loadingCount: imgs.length,
              images: imgs,
              totalImg: totalImg
            })
          },
          fail: function (res) {
            console.log("我失败了", res)
          }
        })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
  ClickItem: function (res) {
    console.log(res)
    var that = this
    var data = that.data.totalImg[res.currentTarget.id]
    let note_type = 1
    if (data.video)
      note_type = 2
    wx.navigateTo({
      url: '/pages/showDynamic/AddDynamics?res=' + JSON.stringify(that.data.totalImg[res.currentTarget.id]) + '&' + 'note_type=' + note_type
    })
  }
})