// pages/addcard/bank/bank.js
var Base64=require("../../../utils/base64.js");
const util = require('../../../utils/util.js');
var MD5 = require('../../../utils/md5.js');

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //相册或者拍照获取路径
    chooseImageSrc:'',
    //是否展示图片
    showView:false,
    bankNo:'123123',
    bankName:'招商银行',
    bankInfo:'招商银行信用卡',
    bankType:'贷记卡',
    validatetime:'05/2018'
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.cardTypeIndex);
    console.log("卡类型:" + getApp().globalData.cardType[options.cardTypeIndex]);
    wx.setNavigationBarTitle({
      title: '添加' + getApp().globalData.cardType[options.cardTypeIndex],
      success: function(e){
        console.log(e);
      },fail:function(e){
        console.log(e);
      }
    }
    )
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

  addPicture:function(){
    var _this = this; 
    wx:wx.chooseImage({
      count: 1,
      sourceType: ['album','camera'],
      success: function(res) {
        var tempFilePaths = res.tempFilePaths[0];
        console.log(tempFilePaths);
        //var Path = Base64.CusBASE64.encoder(tempFilePaths);
        wx.request({
          url: tempFilePaths,
          method: 'GET',
          responseType: 'arraybuffer',
          success: function (res) {
            console.log(res+"  1123");
            let base64 = wx.arrayBufferToBase64(res.data);
            _this.getBankInfoByAi(base64);
            //console.log('data:image/jpg;base64,' + base64);
            //$this.data.userImageBase64 = 'data:image/jpg;base64,' + base64;;
          }
        });

        _this.setData({
          chooseImageSrc:tempFilePaths,
          showView:true
        })
        //_this.getBankInfoByAi(Path);
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  getBankInfoByAi:function(base64){
    wx.showLoading({
      title: '加载中...',
    })
    var appId = getApp().globalData.aiAppId;
    var appKey = getApp().globalData.aiAppKey;
    var timestamp = util.common.getTimestamp();
    var noncestr = util.common.createNonceStr();
    var params = {
      app_id:appId,
      time_stamp:timestamp,
      nonce_str:noncestr,
      image:base64
    }


    var sortParam = util.common.sortAscii(params) + "app_key=" + appKey;
    console.log("sortParam:   "+sortParam);
    var signstr = MD5.md5(sortParam);
    console.log("signStr: "+ signstr)
    wx.request({
      url: 'https://api.ai.qq.com/fcgi-bin/ocr/ocr_creditcardocr',
      data:{
        app_id:appId,
        time_stamp: timestamp,
        nonce_str: noncestr,
        sign: signstr,
        image:base64
      },
      method:"POST",
      success:function(res){
        wx.hideLoading();
        console.log(res.data);
        var ret = res.data.ret;
        if(ret ==0){
          var data = res.data.data;
        }else{
          var msg = res.data.msg;
          wx.showToast({
            title: msg,
            icon:'none',
            duration:2000
          })
        }
        
      },fail:function(res){
        wx.hideLoading();
        console.log("fail "+res);
      },complete:function(res){
        
      }
    })
  }

})