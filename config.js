var config={
  // 'url':'http://49.235.47.39/',
  'url': 'https://localhost:12500/',
    
  test:function(){
    var res_ret 
      wx.getUserInfo({
        success:function(res){
          var userInfo = res.userInfo
          var nickName = userInfo.nickName
          var avatarUrl = userInfo.avatarUrl
          var gender = userInfo.gender //性别 0：未知、1：男、2：女
          var province = userInfo.province
          var city = userInfo.city
          var country = userInfo.country
          res_ret = res
        }
      })
    return res_ret 
  },
  
}
module.exports = config