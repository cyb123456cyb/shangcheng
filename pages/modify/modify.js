let time = require('../../utils/util.js');
var app = getApp();
// var date = new Date();
Page({
  data: {
    name: "",//姓名
    profess: "",  //宝宝专业姓名
    city: "", //所在城市
    skilledIn: "", //特长
    vacant: "打豆豆",  //空闲时间
    Possessions: 0, //房车数量
    sex: 0,//性别
    birth: 0,//生日
    grad: 0, //学历
    position: 0,//户籍所在地
    marry: 0,//婚姻状况
    salaries: 0,//年薪
    allPosess: 0,//所有资产
    religion: 0,//宗教信仰
    phoneNum: "",//电话号码
    StatusBar: app.globalData.StatusBar,
    CustomBar: app.globalData.CustomBar,
    index: null,
    index2: null,
    index3: null,
    index4: null,
    index5: null,
    index6: null,
    index7: null,
  
    picker: ['男', '女'],
  
    multiIndex: [0, 0, 0],
    time: '12:01',
    date: '2018-12-25',
    region: ['广东省', '广州市', '海珠区'],
    imgList: [],
    modalName: null,
    textareaAValue: '',
    textareaBValue: ''
  },

  watchPhoneNum: function (e) {
    this.setData({
      phoneNum: e.detail.value
    })
  },
  watchName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },



  watchCity: function (e) {
    this.setData({
      city: e.detail.value
    })
  },

  watchAdvan: function (e) {
    this.setData({
      advantage: e.detail.value
    })
  },

  watchSparetime: function (e) {
    this.setData({
      vacant: e.detail.value
    })
  },
  watchHouse: function (e) {
    this.setData({
      house: e.detail.value
    })
  },
  watchCars: function (e) {
    this.setData({
      car: e.detail.value
    })
  },
  UpdateInfo: function () {

    var that = this;
    console.log("输出时间:" + that.data.date)
    wx.request({
      url:app.globalData.urls+'editInfo',
      method: 'get', 
      data: {
        sessionKey:app.globalData.usrId,
        baby_name: that.data.profess,
        baby_sex: that.data.index,
        baby_birth:that.data.date,
        phone:that.data.phoneNum
      },
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        //回调处理
        console.log('getOpenID-OK!');
        console.log(res.data);
        wx.showToast({
          title: '个人信息修改成功！',
        })
        wx.navigateBack({
          delta:1
        })
      },
      fail: function (error) {
        console.log(error);
      }
    })
    var that = this;
    
  },
  onLoad: function (e) {
    var that = this;
    wx.request({
      url: 'https://www.creativejie.com/findMessage',//注意改成自己的服务器请求地址哦！
      method: 'get', // OPTIONS, GET, HEAD, POST, PUT, DELETE, TRACE, CONNECT
      data: {
        condition: app.globalData.userID
      },
      header: {
        'content-type': 'application/json',
      },
      success: function (res) {
        //回调处理
        console.log(res)
        that.setData({
          name: res.data['uname'],
          weight: res.data['weight'],
          height: res.data['height'],
          profess: res.data['major'],
          sparetime: res.data['sparetime'],
          jobs: res.data['profession'],
          car: res.data['car'],
          house: res.data['house'],
          phoneNum: res.data['phonenumber'],
          skilledIn: res.data['advantage'],
          index: res.data['sex'],
          index2: res.data['educate'],
          index3: res.data['residence'],
          index4: res.data['marry'],
          index5: res.data['wage'],
          index6: res.data['religious'],
          index7: res.data['assets'],
        })
      },
      fail: function (error) {
        console.log(error);
      }
    })
  },
  PickerChange(e) {
    console.log(e);
    this.setData({
      index: e.detail.value
    })
  },
  PickerChange2(e) {
    console.log(e);
    this.setData({
      index2: e.detail.value
    })
  },
  PickerChange3(e) {
    console.log(e);
    this.setData({
      index3: e.detail.value
    })
  },
  PickerChange4(e) {
    console.log(e);
    this.setData({
      index4: e.detail.value
    })
  },
  PickerChange5(e) {
    console.log(e);
    this.setData({
      index5: e.detail.value
    })
  },
  PickerChange6(e) {
    console.log(e);
    this.setData({
      index6: e.detail.value
    })
  },
  PickerChange7(e) {
    console.log(e);
    this.setData({
      index7: e.detail.value
    })
  },

  MultiChange(e) {
    this.setData({
      multiIndex: e.detail.value
    })
  },
  MultiColumnChange(e) {
    let data = {
      multiArray: this.data.multiArray,
      multiIndex: this.data.multiIndex
    };
    data.multiIndex[e.detail.column] = e.detail.value;
    switch (e.detail.column) {
      case 0:
        switch (data.multiIndex[0]) {
          case 0:
            data.multiArray[1] = ['扁性动物', '线形动物', '环节动物', '软体动物', '节肢动物'];
            data.multiArray[2] = ['猪肉绦虫', '吸血虫'];
            break;
          case 1:
            data.multiArray[1] = ['鱼', '两栖动物', '爬行动物'];
            data.multiArray[2] = ['鲫鱼', '带鱼'];
            break;
        }
        data.multiIndex[1] = 0;
        data.multiIndex[2] = 0;
        break;
      case 1:
        switch (data.multiIndex[0]) {
          case 0:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['猪肉绦虫', '吸血虫'];
                break;
              case 1:
                data.multiArray[2] = ['蛔虫'];
                break;
              case 2:
                data.multiArray[2] = ['蚂蚁', '蚂蟥'];
                break;
              case 3:
                data.multiArray[2] = ['河蚌', '蜗牛', '蛞蝓'];
                break;
              case 4:
                data.multiArray[2] = ['昆虫', '甲壳动物', '蛛形动物', '多足动物'];
                break;
            }
            break;
          case 1:
            switch (data.multiIndex[1]) {
              case 0:
                data.multiArray[2] = ['鲫鱼', '带鱼'];
                break;
              case 1:
                data.multiArray[2] = ['青蛙', '娃娃鱼'];
                break;
              case 2:
                data.multiArray[2] = ['蜥蜴', '龟', '壁虎'];
                break;
            }
            break;
        }
        data.multiIndex[2] = 0;
        break;
    }
    this.setData(data);
  },
  TimeChange(e) {
    this.setData({
      time: e.detail.value
    })
  },
  DateChange(e) {
    console.log(e.detail.value)
    let date = new Date(Date.parse(e.detail.value))
    console.log(date.getFullYear() + '-'+(date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate()))
    let res = date.getFullYear() + '-' + (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-' + (date.getDate() < 10 ? '0' + date.getDate() : date.getDate())
    this.setData({
      date: res
    })
  },
  RegionChange: function (e) {
    this.setData({
      region: e.detail.value
    })
  },
  ViewImage(e) {
    wx.previewImage({
      urls: this.data.imgList,
      current: e.currentTarget.dataset.url
    });
    console.log(this.data.imgList)
  },
  
  formSubmit: function (e) {
    this.UpdateInfo();
    console.log(e)
  },
  textareaAInput(e) {
    this.setData({
      textareaAValue: e.detail.value
    })
  },
  textareaBInput(e) {
    this.setData({
      textareaBValue: e.detail.value
    })
  }
})