// pages/addcard/bank/bank.js
const util = require('../../../utils/util.js');
var MD5 = require('../../../utils/md5.js');
var Bmob = require("../../../utils/bmob.js");
var user = require("../../../utils/user.js");
var COS = require("../../../utils/cos-wx-sdk-v5.js")
var config = require("../../../utils/tencent-cloud-config.js")
//const qiniuUploader = require("../../../utils/qiniuUploader.js");
//var uploadFn = require("../../../utils/upload.js");

var cos = new COS({
  getAuthorization: function (params, callback) {//获取签名 必填参数
    // 方法二（适用于前端调试）
    var authorization = COS.getAuthorization({
      SecretId: config.SecretId,
      SecretKey: config.SecretKey,
      Method: params.Method,
      Key: params.Key
    });
    callback(authorization);
  }
});


Page({

  /**
   * 页面的初始数据
   */
  data: {
    //相册或者拍照获取路径
    chooseImageSrc:'',
    //卡类型
    cardTypeIndex:'',
    imageUrl:'',
    //是否展示图片
    showView:false,
    //读取数据
    bank:'',
    ocrJson:'',
    objectId:'',//主键id
    bankNo:''//卡号
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log("卡类型:" + getApp().globalData.cardType[options.cardTypeIndex]);
    this.setData({
      cardTypeIndex: options.cardTypeIndex,
      chooseImageSrc:options.imageUrl,
    })
    wx.setNavigationBarTitle({
      title: '添加' + getApp().globalData.cardType[options.cardTypeIndex],
      success: function(e){
        console.log(e);
      },fail:function(e){
        console.log(e);
      }
    }
    )

    var openId = wx.getStorageSync('openId')
    if(openId == ''){
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

  addPicture:function(){
    var _this = this; 
    wx:wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album','camera'],
      success: function(res) {
        console.log(res.tempFilePaths + "  \n" + res.tempFiles[0]);
        var tempFilePaths = res.tempFilePaths;
        var filePath = res.tempFilePaths[0];

        _this.setData({
          chooseImageSrc: tempFilePaths,
          showView: true
        })
        var starttime = new Date().getTime();
        var openid = wx.getStorageSync('openid')
        var name = openid+"_"+util.common.getTimestamp()+".jpg";
        //var file = new Bmob.File(name, tempFilePaths);
        wx.showLoading({
          title: '解析中,请稍后...',
        })

        cos.postObject({
          Bucket: config.Bucket,
          Region: config.Region,
          Key: name,
          FilePath: filePath,
          onProgress: function (info) {
            console.log(JSON.stringify(info));
          },
          
        }, function (err, data) {
          console.log(err || data);
          if (err && err.error) {
            wx.showModal({ title: '返回错误', content: '请求失败：' + err.error.Message + '；状态码：' + err.statusCode, showCancel: false });
          } else if (err) {
            wx.showModal({ title: '请求出错', content: '请求出错：' + err + '；状态码：' + err.statusCode, showCancel: false });
          } else {
            console.log("上传图片花费：" + (new Date().getTime() - starttime))
            starttime = new Date().getTime()
            var imageUrl = "https://cardmanager-1252859906.cos.ap-chengdu.myqcloud.com/" + name;
            console.log(imageUrl);
            _this.setData({
              imageUrl: imageUrl,
            });
            wx.request({
              url: imageUrl,
              method: 'GET',
              responseType: 'arraybuffer',
              success: function (res) {
                console.log("获取base64：" + (new Date().getTime() - starttime))
                let base64 = wx.arrayBufferToBase64(res.data);
                _this.getBankInfoByAi(base64);
              }, error: function (res) {
                wx.hideLoading();
              }, complete: function (res) {

              }
            });
          }
        });

        // wx.uploadFile({
        //   url: "https://weixin.shopin.net/wechatshop/wx_upload",
        //   filePath: filePath,
        //   name: 'file',
        //   formData: {
        //     'openId': openid
        //   },
        //   success: function (uploadRes) {
        //     var data = uploadRes.data
        //     var upload_res = JSON.parse(data)
        //     var imageUrl = upload_res.imgUrl;
        //     console.log(imageUrl);
        //     _this.setData({
        //       imageUrl: imageUrl,
        //     });
        //     var base64 = upload_res.base64;

        //     console.log("获取base64:" + (new Date().getTime() - starttime))
        //     starttime = new Date().getTime()
        //     _this.getBankInfoByAi(base64);
        //   },
        //   fail: function (e) {
        //     console.log('e', e)
        //   }
        // })

      

        //qiniu upload start -------
        //交给七牛上传
        // qiniuUploader.upload(filePath, (res) => {
        //   var imageUrl = res.imageURL;
        //   console.log(imageUrl);
        //   _this.setData({
        //     imageUrl: imageUrl,
        //   });
        //   console.log("上传图片花费：" + (new Date().getTime() - starttime))
        //   starttime = new Date().getTime()
        //     wx.request({
        //       url: "https://weixin.shopin.net/wechatshop/getBase64ImgUrl.html?imgURL="+imageUrl,
        //     method: 'GET',
        //     success: function (res) {
        //       console.log("获取base64:" + (new Date().getTime() - starttime))
        //       starttime = new Date().getTime()
        //       _this.getBankInfoByAi(res.data);
        //     },error:function(res){
        //       wx.hideLoading();
        //     },complete:function(res){
        //       if (res.errMsg == 'request:fail timeout'){
        //         wx.hideLoading()
        //       }
        //       console.log(res.errMsg+"  complete "+res.statusCode)
        //     }
        //   });

        // //     wx.request({
        // //       url: "https://cardmanager-1252859906.cos.ap-chengdu.myqcloud.com/WechatIMG256.jpeg?sign=q-sign-algorithm%3Dsha1%26q-ak%3DAKID2Zlq75YVXGFmotiNiiJdoCWcfPgm9J15%26q-sign-time%3D1526177213%3B1526179013%26q-key-time%3D1526177213%3B1526179013%26q-header-list%3D%26q-url-param-list%3D%26q-signature%3D92142f3264722dfdb167f6f5568e81db43badd70&token=f886bf62f62bcb1377e6a62173abe66af026f71e10001&clientIP=210.12.233.2&clientUA=9ce972c1-b3b8-44b4-b199-d692f7124c60",
        // //     method: 'GET',
        // //     responseType: 'arraybuffer',
        // //     success: function (res) {
        // //       wx.showLoading({
        // //         title: "123" + res.data,
        // //       })
        // //       let base64 = wx.arrayBufferToBase64(res.data);
        // //       _this.getBankInfoByAi(base64);
        // //     },error:function(res){
        // //       wx.hideLoading();
        // //     },complete:function(res){

        // //     }
        // //   });

        // }, (error) => {
        //   console.log('error: ' + error);
        // }, {
        //     region: 'ECN',
        //     domain: 'http://p8c57y31f.bkt.clouddn.com', // // bucket 域名，下载资源时用到。如果设置，会在 success callback 的 res 参数加上可以直接使用的 ImageURL 字段。否则需要自己拼接
        //     key: name, // [非必须]自定义文件 key。如果不设置，默认为使用微信小程序 API 的临时文件名
        //     // 以下方法三选一即可，优先级为：uptoken > uptokenURL > uptokenFunc
        //     //uptoken: '[yourTokenString]', // 由其他程序生成七牛 uptoken
        //     uptokenURL: 'https://weixin.shopin.net/wechatshop/getQiniuToken.html', // 从指定 url 通过 HTTP GET 获取 uptoken，返回的格式必须是 json 且包含 uptoken 字段，例如： {"uptoken": "[yourTokenString]"}
        //     //uptokenFunc: function () { return '[yourTokenString]'; }
        //   }, (res) => {
        //     console.log('上传进度', res.progress)
        //   });
      

        //qiniu upload end -------
        // file.save().then(function (res) {
         
        //   var imageUrl = res.url();
        //   console.log(imageUrl);
        //   //上传图片成功
        //   _this.setData({
        //     imageUrl: imageUrl,
        //   })
        //   try {
        //     var res = wx.getSystemInfoSync()
        //     console.log(res.platform)
        //     if (res.platform == 'devtools') {//模拟器
        //       imageUrl = tempFilePaths[0];
        //     }
        //   } catch (e) {
        //     // Do something when catch error
        //   }
        //   console.log(imageUrl + "   " + tempFilePaths);
          

      


        //   wx.request({
        //     url: imageUrl,
        //     method: 'GET',
        //     responseType: 'arraybuffer',
        //     success: function (res) {
        //       wx.showLoading({
        //         title: "123" + res.data,
        //       })
        //       let base64 = wx.arrayBufferToBase64(res.data);
        //       _this.getBankInfoByAi(base64);
        //     },error:function(res){
        //       wx.hideLoading();
        //     },complete:function(res){
              
        //     }
        //   });

        // }, function (error) {
        //   console.log("base64:"+error);
        //   wx.hideLoading();
        //   wx.showToast({
        //     title: error,
        //     icon:'none'
        //   })
        // })


        
    

        
        //_this.getBankInfoByAi(Path);
      },
      fail: function(res) {},
      complete: function(res) {},
    })
  },

  //获取卡信息
  getBankInfoByAi:function(base64){
    var starttime = new Date().getTime();
    var _this = this; 
    wx.showLoading({
      title: '解析中...',
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
    //console.log("sortParam:   "+sortParam);
    var signstr = MD5.md5(sortParam);
    //console.log("signStr: "+ signstr)
    wx.request({
      url: 'https://api.ai.qq.com/fcgi-bin/ocr/ocr_creditcardocr',
      data:{
        app_id:appId,
        time_stamp: timestamp,
        nonce_str: noncestr,
        sign: signstr,
        image: base64
      },
      method:'POST',
      header: { 'content-type':'application/x-www-form-urlencoded'},
      success:function(res){
        console.log("识别：" + (new Date().getTime() - starttime))
        starttime = new Date().getTime()
        console.log(res.data);
        var resultJson = res.data;
        var ret = res.data.ret;
        if(ret ==0){
          var item_list = res.data.data.item_list;
          console.log(item_list)
          _this.setData({
            bank: item_list,
            cardNo:item_list[0].itemstring,
            ocrJson: resultJson,
          })
          _this.addCardInfo();
        }else{
          _this.setData({
            bank: '',
            ocrJson: '',
          })
          var msg = res.data.msg;
          wx.showToast({
            title: ret+'识别失败，请上传正确的卡',
            icon: 'none',
            duration: 2500
          })
        }
        
      },fail:function(res){
        wx.hideLoading();
        wx.showToast({
          title: res.msg,
          icon:'none'
        })
        console.log("fail "+res);
      },complete:function(res){
        
      }
    })
  },
  //添加卡信息
  addCardInfo: function (){
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
      if (openid !='') {
        card.set("openId", openid);
        // Do something with return value
      }else{
        user.getUserInfo();
      }
    } catch (e) {
      // Do something when catch error
    }
   
    card.set("cardUrl", _this.data.imageUrl);
    try {
      var banks = _this.data.bank;
      card.set("ocrInfo", JSON.stringify(banks));
      card.set("cardTypeIndex",1);
      card.set("flag", 1);

      var showInfo = [];
      for (var item in banks) {
        showInfo.push({ "item": banks[item].item, "itemstring": banks[item].itemstring });
      }

      card.set("cardNo", _this.data.bank[0].itemstring);
      card.set("cardType", _this.data.bank[1].itemstring);
      card.set("cardName", _this.data.bank[2].itemstring);
      card.set("cardInfo", _this.data.bank[3].itemstring);
      card.set("showInfo", JSON.stringify(showInfo));
      card.set("validityDate", _this.data.bank[4].itemstring);
      
    }catch(e){

    }
    //添加数据，第一个入口参数为null
    card.save(null, {
      success: function (result) {
        // 添加成功，返回成功之后的objectId（注意：返回的属性名字是id，不是objectId），你还可以在Bmob的Web管理后台看到对应的数据
        console.log("银行卡创建成功, objectId:" + result.id);
        _this.setData({
          objectId:result.id
        })
        wx.hideLoading();
      },
      error: function (result, error) {
        console.log(result+ " "+error);
        var msg = '';
        if(error.code == 401){
          msg = '您已经添加过该银行卡'
        }
        // 添加失败
        wx.hideLoading();
        wx.showToast({
          title:  msg,
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
      console.log("123"+res.target)
    }
    var _this = this;
    var path = 'pages/cardDetail/cardDetail?cardTypeIndex=' + _this.data.cardTypeIndex + '&imageUrl=' + _this.data.imageUrl + '&objectId=' + _this.data.objectId + "&cardNo=" + _this.data.cardNo+"&share=true";
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
  bindChooseImg:function(e){
    console.log("1111111");
    this.bindChooseImg()
  },
  bindConfirm:function(e){
    this.bindConfirm();
  }

})