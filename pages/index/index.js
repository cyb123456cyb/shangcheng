var app = getApp()
let col1H = 0;
let col2H = 0;
let col3H = 0;
let col4H = 0;
Page({  
  data: {
    wh:0,
    totalImg2:[],
    loadingCount2:0,
    images2:[],
    show_sel:false,
    totalImg:[],
    imgId:0,
    scrollH: 0,
    imgWidth: 0,
    loadingCount: 0,
    images: [],
    col1: [],
    col2: [],
    col3:[],
    col4:[],
    TabCur:0,
    navigatePage:null,
      //需要传递的值
      Tabs:['推荐','关注'],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500
  },
  
  ChangeTab:function(res){
    // console.log(res)
  },
  tabSelect:function(e){
    this.setData({
      TabCur: e.currentTarget.dataset.id,
      scrollLeft: (e.currentTarget.dataset.id - 1) * 60
    })
  },
test:function(res){
  // console.log("我点击了,结果是",res)
  this.ClickItem(res)
},

  showModel:function(res){
    this.setData({
      show_sel:true
    })
  },

  onLoad: function () {
    this.checkInfo()
    console.log("测试")
    // wx.showLoading({
    //   title: '正在加载',
    // })
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
        //加载首组图片

      }
    })

    
    // console.log("测试完成")
    // this.loadImages()
  },

  checkInfo: function () {
    var that = this
    wx.getSetting({
      success(res) {
        // console.log("res", res)
        if (res.authSetting['scope.userInfo']) {
          // console.log("已授权=====")
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称
          wx.getUserInfo({
            lang: "zh_CN",
            success(res) {
              // console.log("获取用户信息成功")
              app.globalData.name = res.userInfo.nickName,
                app.globalData.avatarUrl = res.userInfo.avatarUrl,
                app.globalData.city = res.userInfo.city,
                app.globalData.gender = res.userInfo.gender,
                that.login_en()
            },
            fail(res) {
              // console.log("获取用户信息失败", res)
            }
          })
        } else {
          wx.hideLoading()
          // console.log("未授权=====")
          // that.showSettingToast("请授权")
          wx.navigateTo({
            url: '/pages/getUserInfo/getUserInfo?pages='+'/pages/index/index'
          })
        }
      }
    })
  },
  login_en: function () {
    // console.log("我执行了登录函数")
    var that = this
    wx.login({
      success: function (res) {
        // console.log("我获取了code")
        that.logEn(res.code)
      },
      fail: function (res) {
        // console.log("我失败了", res)
      }
    })
  },
  logEn: function (code) {
    var that = this

    console.log(code)
    wx.request({
      url: 'http://localhost:12500/' + 'login',
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
        wx.hideLoading()
        // console.log("我是key", res.data.key)
        that.loadImages();
        that.loadImages2();
        // that.generateOrder()
        // that.getOrder()
      },
      fail: function (res) {
        // console.log(res)
      }
    })
  },
onImageLoad: function (e) {
  // console.log("我执行了3")
    // console.log(e.currentTarget.id)
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
      // console.log("我是onImageLoad里的img.id",img.id)
      
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



  onImageLoad2: function (e) {
    // console.log("我执行了；4")
    // console.log(e.currentTarget.id)
    let imageId = e.currentTarget.id;
    let oImgW = e.detail.width; //图片原始宽度
    let oImgH = e.detail.height; //图片原始高度
    let imgWidth = this.data.imgWidth; //图片设置的宽度
    let scale = imgWidth / oImgW; //比例计算    
    let imgHeight = oImgH * scale; //自适应高度
    let images = this.data.images2;
    let imageObj = null;
    for (let i = 0; i < images.length; i++) {
      let img = images[i];
      if (img.id == imageId) {
        imageObj = img;
        break;
      }
    }
    imageObj.height = imgHeight;
    let loadingCount = this.data.loadingCount2 - 1;
    let col1 = this.data.col3;
    let col2 = this.data.col4;
    //判断当前图片添加到左列还是右列
    if (col3H <= col4H) {
      col3H += imgHeight;
      col1.push(imageObj);
    } else {
      col4H += imgHeight;
      col2.push(imageObj);
    }
    let data = {
      loadingCount2: loadingCount,
      col3: col1,
      col4: col2
    };
    //当前这组图片已加载完毕，则清空图片临时加载区域的内容
    if (!loadingCount) {
      data.images2 = [];
    }
    this.setData(data);
  },

  AddingClicked:function(e){
    // console.log(e)
  },
  loadImages: function () {
    var that = this
    // console.log("我要开始加载数据；了")
    wx.request({
      url: app.globalData.urls + 'note/recNote',
      data: {
        sessionKey: app.globalData.usrId
      },
      success: function (res) {
        // console.log("我是结果",res.data)
      // }
        let totalImg = that.data.totalImg
        // console.log(res.data[0].note_pic)
        var imgs = []
        let num = 0
        for (var i =0;i<res.data.length;i++){
          let tes ={pic:"",id:null,total_id:0}
          if (res.data[i].video)
          tes.pic = res.data[i].note_pic[0]
          else{
            if (res.data[i].content[0])
              tes.pic = res.data[i].content[0][0]
            else
            continue
          }
          var id = totalImg.length
          tes.id = id
          // tes.total_id = that.data.imgId
          // console.log('我是id',id)
          totalImg.push(res.data[i])
          // console.log(tes)
          imgs[num] = tes;
          num++;
        }
        // console.log(imgs)
        that.setData({
          loadingCount: imgs.length,
          images: imgs,
          totalImg:totalImg
        })
      },
      fail: function (res) {
        // console.log("我失败了",res)
      }
    })
  },
  loadImages2: function () {
    var that = this
    // console.log("我要开始加载数据；了")
    // console.log("我是FollowNote的key:", app.globalData.usrId)
    wx.request({
      url: app.globalData.urls + 'note/followNote',
      data: {
        sessionKey: app.globalData.usrId
      },
      success: function (res) {
        // console.log("我是结果2", res.data)
        // }
        let totalImg = that.data.totalImg2
        // console.log(res.data[0].note_pic)
        var imgs = []
        let num = 0
        for (var i = 0; i < res.data.length; i++) {
          let tes = { pic: "", id: null, total_id: 0 }
          if (res.data[i].video)
            tes.pic = res.data[i].note_pic[0]
          else {
            if (res.data[i].content[0])
              tes.pic = res.data[i].content[0][0]
            else
              continue
          }
            // tes.pic = res.data[i].content[0][0]
          var id = totalImg.length
          tes.id = id
          // tes.total_id = that.data.imgId
          // console.log(id)
          // console.log('我是id', id)
          totalImg.push(res.data[i])
          // console.log(tes)
          imgs[num] = tes
          num++;
        }
        // console.log(imgs)
        that.setData({
          loadingCount2: imgs.length,
          images2: imgs,
          totalImg2: totalImg
        })
      },
      fail: function (res) {
        // console.log(res)
      }
    })
  },
  ClickItem:function(res){
    // console.log(res)
    var that = this
    var data =  that.data.totalImg[res.currentTarget.id]
    let note_type = 1
    if(data.video)
      note_type=2
    wx.navigateTo({
      url: '/pages/showDynamic/AddDynamics?res=' + JSON.stringify(that.data.totalImg[res.currentTarget.id])+'&'+'note_type='+note_type
    })
  },
  ClickItem2: function (res) {
    // console.log(res)
    var that = this
    var data = that.data.totalImg2[res.currentTarget.id]
    let note_type = 1
    if (data.video)
      note_type = 2
    wx.navigateTo({
      url: '/pages/showDynamic/AddDynamics?res=' + JSON.stringify(that.data.totalImg2[res.currentTarget.id]) + '&' + 'note_type=' + note_type
    })
  }
})