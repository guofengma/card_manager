// pages/cardDetail.js
var Bmob = require("../../utils/bmob.js");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    objectId:'',
    cardNo:'',
    cardTypeIndex:'',
    imageUrl:'',
    bank:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var _this = this;
    console.log(options.objectId);
    _this.setData({
      objectId:options.objectId,
      cardTypeIndex: options.cardTypeIndex,
      imageUrl: options.imageUrl,
      cardNo:options.cardNo
    })
    _this.getCardInfoById(options.objectId, options.cardNo);
      
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
    var _this = this;
    return {
      title: '许多卡',
      path: 'pages/cardDetail/cardDetail?cardTypeIndex=' + _this.data.cardTypeIndex + '&imageUrl=' + _this.data.imageUrl + '&objectId=' + _this.data.objectId +"&cardNo="+_this.data.cardNo,
      success: function (res) {
        // 转发成功
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //通过id获取卡信息
  getCardInfoById:function(objectId,cardNo){
    wx.showLoading({
      title: '加载中...',
    })
    var _this = this;
    var card = Bmob.Object.extend("card");
    var query = new Bmob.Query(card);
    if(objectId != ''){
      query.get(objectId, {
        success: function (result) {
          wx.hideLoading();
          console.log(result.get("showInfo"));
          var bank = JSON.parse(result.get("showInfo"));
          _this.setData({
            bank: bank
          })
        }, error: function (result, error) {
          console.log(error.msg)
          wx.hideLoading()
          wx.showToast({
            title: '卡信息不存在',
          })
        }
      })
    }else{
      query.equalTo("cardNo",cardNo);
      query.find({
        success:function(results){
          wx.hideLoading();
          console.log(results[0].get("ocrInfo"));
          var bank = JSON.parse(results[0].get("ocrInfo"));
          _this.setData({
            bank: bank
          })
        }, error: function (result, error) {
          console.log(error.msg)
          wx.hideLoading()
          wx.showToast({
            title: '卡信息不存在',
          })
        }
      });
    }
    
  },
  //打开图片
  openBankImage:function(res){
    var _this = this;
    var urls = [_this.data.imageUrl];
    wx.previewImage({
      current: '', // 当前显示图片的http链接
      urls: urls// 需要预览的图片http链接列表
    })
  },

})