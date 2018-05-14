// pages/addcard/visitingCard/visitingCard.js
var Base64 = require("../../../utils/base64.js");
const util = require('../../../utils/util.js');
var MD5 = require('../../../utils/md5.js');
var Bmob = require("../../../utils/bmob.js");
var user = require("../../../utils/user.js");
const qiniuUploader = require("../../../utils/qiniuUploader.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //相册或者拍照获取路径
    chooseImageSrc: '',
    //卡类型
    cardTypeIndex: '',
    imageUrl: '',
    //是否展示图片
    showView: false,
    //读取数据
    bank: '',
    ocrJson: '',
    objectId: '',//主键id
    bankNo: ''//卡号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("卡类型:" + getApp().globalData.cardType[options.cardTypeIndex]);
    this.setData({
      cardTypeIndex: options.cardTypeIndex,
      chooseImageSrc: options.imageUrl,
    })
    wx.setNavigationBarTitle({
      title: '添加' + getApp().globalData.cardType[options.cardTypeIndex],
      success: function (e) {
        console.log(e);
      }, fail: function (e) {
        console.log(e);
      }
    })

    var openId = wx.getStorageSync('openId')
    if (openId == '') {
      user.getUserInfo()
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.addPicture()
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

  addPicture: function () {
    var _this = this;
    wx: wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        console.log(res.tempFilePaths + "  \n" + res.tempFiles[0]);
        var tempFilePaths = res.tempFilePaths;
        var filePath = res.tempFilePaths[0];
        //var Path = Base64.CusBASE64.encoder(tempFilePaths);


        _this.setData({
          chooseImageSrc: tempFilePaths,
          showView: true
        })

        var openid = wx.getStorageSync('openid')
        var name = openid + "_" +util.common.getTimestamp() + ".jpg";
        var file = new Bmob.File(name, tempFilePaths);
        wx.showLoading({
          title: '解析中...',
        })
        //qiniu upload start -------
        // 交给七牛上传
        qiniuUploader.upload(filePath, (res) => {
          // 每个文件上传成功后,处理相关的事情
          // 其中 info 是文件上传成功后，服务端返回的json，形式如
          // {
          //    "hash": "Fh8xVqod2MQ1mocfI4S4KpRL6D98",
          //    "key": "gogopher.jpg"
          //  }
          // 参考http://developer.qiniu.com/docs/v6/api/overview/up/response/simple-response.html
          var imageUrl = res.imageURL;
          console.log(imageUrl);
          _this.setData({
            imageUrl: imageUrl,
          });

          wx.request({
            url: "https://weixin.shopin.net/wechatshop/getBase64ImgUrl.html?imgURL=" + imageUrl,
            method: 'GET',
            success: function (res) {
              wx.showLoading({
                title: "解析中...",
              })
              //console.log(res.data);
              //let base64 = wx.arrayBufferToBase64(res.data);
              _this.getBankInfoByAi(res.data);
            }, error: function (res) {
              wx.hideLoading();
            }, complete: function (res) {
              if (res.errMsg == 'request:fail timeout') {
                wx.hideLoading()
              }
            }
          });

        }, (error) => {
          console.log('error: ' + error);
        }, {
            region: 'ECN',
            domain: 'http://p8c57y31f.bkt.clouddn.com', // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
            key: name, // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
            // 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
            //uptoken: '[yourTokenString]', // 由其他程序生成七牛 uptoken
            uptokenURL: 'https://weixin.shopin.net/wechatshop/getQiniuToken.html', // 从指定 url 通过 HTTP GET 获取 uptoken，返回的格式必须是 json 且包含 uptoken 字段，例如： {"uptoken": "[yourTokenString]"}
            //uptokenFunc: function () { return '[yourTokenString]'; }
          }, (res) => {
            console.log('上传进度', res.progress)
            //console.log('已经上传的数据长度', res.totalBytesSent)
            //console.log('预期需要上传的数据总长度', res.totalBytesExpectedToSend)
          });


        //qiniu upload end -------
        // file.save().then(function (res) {
        //   var imageUrl = res.url();
        //   console.log(res.url());
        //   //上传图片成功
        //   _this.setData({
        //     imageUrl: res.url(),
        //   })
        //   // var picturePath = tempFilePaths[0];
        //   // console.log(picturePath);
        //   // var reader = new FileReader()
        //   // var arrayBuffer = reader.result;
        //   // var base64 = wx.arrayBufferToBase64(arrayBuffer);
        //   // console.log(base64);
        //   // _this.getBankInfoByAi(base64);
        //   try {
        //     var res = wx.getSystemInfoSync()
        //     console.log(res.platform)
        //     if (res.platform == 'devtools') {//模拟器
        //       imageUrl = tempFilePaths[0];
        //     }
        //   } catch (e) {
        //     // Do something when catch error
        //   }
        //   wx.request({
        //     url: imageUrl,
        //     method: 'GET',
        //     responseType: 'arraybuffer',
        //     success: function (res) {
        //       let base64 = wx.arrayBufferToBase64(res.data);
        //       _this.getBankInfoByAi(base64);
        //     }, error: function (res) {
        //       wx.hideLoading();
        //     }, complete: function (res) {

        //     }
        //   });

        // }, function (error) {
        //   console.log("base64:" + error);
        //   wx.hideLoading();
        //   wx.showToast({
        //     title: error,
        //     icon: 'none'
        //   })
        // })






        //_this.getBankInfoByAi(Path);
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  //获取卡信息
  getBankInfoByAi: function (base64) {
    var _this = this;
    wx.showLoading({
      title: '解析中...',
    })
    var appId = getApp().globalData.aiAppId;
    var appKey = getApp().globalData.aiAppKey;
    var timestamp = util.common.getTimestamp();
    var noncestr = util.common.createNonceStr();
    var params = {
      app_id: appId,
      time_stamp: timestamp,
      nonce_str: noncestr,
      image: base64
    }


    var sortParam = util.common.sortAscii(params) + "app_key=" + appKey;
    //console.log("sortParam:   "+sortParam);
    var signstr = MD5.md5(sortParam);
    //console.log("signStr: "+ signstr)
    wx.request({
      url: 'https://api.ai.qq.com/fcgi-bin/ocr/ocr_bcocr',
      data: {
        app_id: appId,
        time_stamp: timestamp,
        nonce_str: noncestr,
        sign: signstr,
        image: base64
      },
      method: 'POST',
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
        console.log(res.data);
        var resultJson = res.data;
        var ret = res.data.ret;
        if (ret == 0) {
          var item_list = res.data.data.item_list;
          console.log(item_list)
          _this.setData({
            bank: item_list,
            cardNo: item_list[0].itemstring,
            ocrJson: resultJson,
          })
          _this.addCardInfo();
        } else {
          _this.setData({
            bank: '',
            ocrJson: '',
          })
          if (ret < 0 || ret == 16449) {
            wx.showToast({
              title: ret + ' 识别失败，请上传正确的名片',
              icon: 'none',
              duration: 2000
            })
          } else {
            var msg = res.data.msg;
            wx.showToast({
              title: msg,
              icon: 'none',
              duration: 2000
            })
          }
        }

      }, fail: function (res) {
        wx.hideLoading();
        wx.showToast({
          title: res.msg,
          icon: 'none'
        })
        console.log("fail " + res);
      }, complete: function (res) {

      }
    })
  },
  //添加卡信息
  addCardInfo: function () {
    var _this = this;
    wx.showLoading({
      title: '解析中...',
    })
    //创建类和实例
    var CardInfo = Bmob.Object.extend("card");
    var card = new CardInfo();
    try {
      var openid = wx.getStorageSync('openid')
      console.log(openid);
      if (openid != '') {
        card.set("openId", openid);
        // Do something with return value
      } else {

      }
    } catch (e) {
      // Do something when catch error
    }

    card.set("cardUrl", _this.data.imageUrl);
    try {
      var banks = _this.data.bank;
      card.set("ocrInfo", JSON.stringify(banks));
      card.set("cardTypeIndex",2);//名片
      card.set("flag", 1);
      var showInfo = [];
      for (var item in banks) {
        showInfo.push({ "item": banks[item].item, "itemstring": banks[item].itemstring });
      }
      console.log(JSON.stringify(showInfo));
      card.set("showInfo", JSON.stringify(showInfo));
      // card.set("cardType", _this.data.bank[1].itemstring);
      // card.set("cardName", _this.data.bank[2].itemstring);
      // card.set("cardInfo", _this.data.bank[3].itemstring);

      // card.set("validityDate", _this.data.bank[4].itemstring);

    } catch (e) {
      console.log(e);
    }
    //添加数据，第一个入口参数为null
    card.save(null, {
      success: function (result) {
        // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
        console.log("银行卡创建成功, objectId:" + result.id);
        _this.setData({
          objectId: result.id
        })
        wx.hideLoading();
      },
      error: function (result, error) {
        // 添加失败
        wx.hideLoading();
        console.log(result + " " + error.message);
        var msg = error.message;
        if (error.code == 401) {
          msg = '您已经添加过该名片'
        }
        wx.showToast({
          title: msg,
          icon: 'none',
          duration: 2000
        })
      }
    });
  },
  //一键转发
  onShareAppMessage: function (res) {
    if (res.from === 'button') {
      // 来自页面内转发按钮
      console.log("123" + res.target)
    }
    var _this = this;
    var path = 'pages/cardDetail/cardDetail?cardTypeIndex=' + _this.data.cardTypeIndex + '&imageUrl=' + _this.data.imageUrl + '&objectId=' + _this.data.objectId + "&cardNo=" + _this.data.cardNo + "&share=true";
    return {
      title: '许多卡，一键扫描管理你的卡片',
      path: path,
      success: function (res) {
        // 转发成功
        console.log(path);
      },
      fail: function (res) {
        // 转发失败
      }
    }
  },
  //拨打电话
  callPhone: function (res) {
    var name = res.target.dataset.name;
    if (name == '手机' || name == '电话') {
      wx.makePhoneCall({
        phoneNumber: res.target.dataset.value
      })
    }

  }

})