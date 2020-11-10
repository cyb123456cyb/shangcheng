// pages/components/dynamics.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    imgPath:{
      type:String,
      value:'https://image.weilanwl.com/img/4x3-1.jpg'
    },
    Name:{
      type:String,
      value:'testName'
    },
    Image:{
      type:String,
      value:"None"
    },
    Counting:{
      type:Number,
      value:0
    },
    id:{
      type:Number,
      value:0
    },
    Height:{
      type:Number,
      value:100
    },
    title:{
      type:String,
      value:"学习改变命运"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {
    InnerImage: ""
  },

  /**
   * 组件的方法列表
   */
  methods: {
    onClicked:function(e){
    },
    NavigateTo:function(re){
      var myEventDetail = {}
      var myEventOption = {}
      this.triggerEvent('myevent', myEventDetail, myEventOption)
      var myEventDetail = { "test": "123" }
      var myEventOption = {}
      this.triggerEvent('popViewDismissEvent', myEventDetail, myEventOption)
    }
  }
})
