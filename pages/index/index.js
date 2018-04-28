//index.js
//获取应用实例
const app = getApp()
const Bmob = require('../../utils/bmob.js')
Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    datas:[],
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
    var _this = this;
    _this.getCardsByOpenId();



  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

  //根据openId查询卡号
  getCardsByOpenId:function(e){
    var _this = this;
    wx.showLoading({
      title: '加载中...',
    })
    var Card = Bmob.Object.extend("card")
    var query = new Bmob.Query(Card);
    var openId = wx.getStorageSync('openid');
    query.equalTo("openId",openId);
    query.descending("updatedAt");
    query.find({
      success:function(results){
        wx.hideLoading()
        console.log(results)
        _this.setData({
          datas:results
        })
        _this.finishRefresh();
      },error:function(error){
        wx.hideLoading()
        wx.showToast({
          title: error.message+" code="+error.code,
        })
        _this.finishRefresh();
      }
    });
  },

  //添加卡号
  addCard: function(e){
      wx.navigateTo({
        url: '../cardType/cardType',
        //url: '../addcard/bank/bank?cardTypeIndex='+res.tapIndex,
        success: function (res) { },
        fail: function (res) { },
        complete: function (res) { },
      })
    /*wx.showActionSheet({
      itemList: getApp().globalData.cardType,
      success:function(res){
       wx.navigateTo({
         url:'../cardType/cardType',
         //url: '../addcard/bank/bank?cardTypeIndex='+res.tapIndex,
         success: function(res) {},
         fail: function(res) {},
         complete: function(res) {},
       })
      },
      fail:function(res){
        console.log(res.errMsg);
      }
    })*/
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  },
  //下拉刷新
  onPullDownRefresh: function () {
    wx.showNavigationBarLoading() //在标题栏中显示加载
    var _this = this;
    _this.getCardsByOpenId();
  },
  //停止刷新
  finishRefresh:function(){
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh() //停止下拉刷新
  }
})
