// pages/user/index.js
var app = getApp()
Page({
  data: {
    status:[],
    scrollH: 0,
    imgWidth: 0,
    loadingCount: 0,
    images: [],
    col1: [],
    col2: [],
    TabCur: 0,
    scrollLeft: 0,
    starCount: 0,
    forksCount: 0,
    visitTotal: 0,
    Tabs:[],
  },
  tabSelect(e) {
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
  about:function(res){
    wx.navigateTo({
      url: '/pages/about/about',
    })
  },
  NavigateToDD:function(){
    wx.navigateTo({
      url: '/pages/dingdan/dingdan',
    })
  },
  onLoad: function (options) {
    let that = this;
    wx.getSystemInfo({
      success: (res) => {
        let ww = res.windowWidth;
        let wh = res.windowHeight;
        let imgWidth = ww * 0.48;
        let scrollH = wh;
        that.setData({
          scrollH: scrollH,
          imgWidth: imgWidth
        });}})
    wx.showLoading({
      title: '数据加载中',
      mask: true,
    })
    let i = 0;
    numDH();
    function numDH() {
      if (i < 20) {
        setTimeout(function() {
          that.setData({
            visitTotal: i,
            forksCount: i,
            visitTotal: i,
            Tabs:['我的动态','我的订单']
          })
          i++
          numDH();
        }, 20)
      } else {
        that.setData({
          starCount: that.coutNum(999),
          forksCount: that.coutNum(8888),
          visitTotal: that.coutNum(77777)
        })
      }
    }
    this.loadImages()
    wx.hideLoading()
  },
  naviToInfo:function(){
    wx.navigateTo({
      url: '/pages/modify/modify',
    })
  },
  coutNum(e) {   
    if (e > 1000 && e < 10000) {
      e = (e / 1000).toFixed(1) + 'k'
    }
    if (e > 10000) {
      e = (e / 10000).toFixed(1) + 'W'
    }
    return e
  },
  CopyLink(e) {
    
  },
  showModal(e) {
    this.setData({
      modalName: e.currentTarget.dataset.target
    })
  },
  hideModal(e) {
    this.setData({
      modalName: null
    })
  },
  // getMyDynamic:function(){
  //   wx.request({
  //     url: app.globalData.urls+'note/myNote',
  //     data:{
  //       sessionKey:app.globalData.usrId
  //     },
  //     success:function(res){
  //       console.log(res)
  //     }
  //   })
  // },

  showQrcode() {
    
  },

  onImageLoad: function (e) {
    console.log("我输出了")
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
      if (img.id === imageId) {
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

    console.log("我输出了")
    var that = this
    var images = []
    var status = []
    var re = null

    wx.request({
      url:app.globalData.urls+"note/myNote",
      data:{
        sessionKey:app.globalData.usrId
      },
      success:function(res){
        console.log("成功返回数据 : ",res.data)
      //   for (var i = 0; i <res.data.length;i++){
      //     if(res.data[i].video==null){
      //     images[i]
      //     let   img = res.data[i].note_pic[0]
      //       let id = baseId+i
      //     status[i] = 0
      //     console.log("我输出了")
      //     }
      //     else{
      //     images[i].img = res.data[i].video
      //     status[i] = 1
      //     }}
      //   let baseId = "img-" + (+new Date());
      //   for (let i = 0; i < images.length; i++) {
      //     images[i
      //     ].id = baseId + "-" + i;
      //   }
      //     that.setData({
      //       images:images,
      //       status:status
      //     })
      //   re = res
      // },
      // fail:function(res){
      //   console.log(res)
      // }
      }
    })

    // this.setData({
    //   loadingCount: images.length,
    //   images: images
    // });
    }
});