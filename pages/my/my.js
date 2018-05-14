// pages/my/my.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    messages: [
      {
        groupName: "联系客服",
        icon: "/images/kefu.png",
        rightImage: "/images/tip.png"
      },
      {
        groupName: "关于我们",
        icon: "/images/about_us.png",
        rightImage: "/images/tip.png"
      }
      ]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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
  previewImage:function(){
  
    wx.previewImage({
      urls: ['http://bmob-cdn-18395.b0.upaiyun.com/2018/04/27/f650a23e4093d48980560618f3993b12.png']
      // 需要预览的图片http链接  使用split把字符串转数组。不然会报错  
    })  
   
  },
  //添加卡号
  addCard: function (e) {
    wx.navigateTo({
      url: '../cardType/cardType',
      //url: '../addcard/bank/bank?cardTypeIndex='+res.tapIndex,
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  }
})