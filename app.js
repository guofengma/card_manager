//app.js
//var aldstat = require("./utils/ald-stat.js");//阿拉丁统计
//log.aldwx.com
var user = require("utils/user.js");
const Bmob = require('utils/bmob.js')
Bmob.initialize("8951d695245d0897ac98bc19fa944f83", "39cedc89e3fadf588e85f5d65ba44b69");
export { Bmob };
App({
  onLaunch: function () {
    // 展示本地存储能力
    //var logs = wx.getStorageSync('logs') || []
    //logs.unshift(Date.now())
    //wx.setStorageSync('logs', logs)

    user.getUserInfo();
  
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo
              console.log(res.userInfo);
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  globalData: {
    aiAppId:'1106782523',//ai.qq.com appId
    aiAppKey:'h2K2V1rl1sTchHLo',
    bmobAppId:'8951d695245d0897ac98bc19fa944f83',//bmob 
    bmobAppRestApiKey:'39cedc89e3fadf588e85f5d65ba44b69',
    cardType: ['银行卡', '身份证',  '各种会员卡','行驶证', '驾驶证', '名片', '营业执照'],
    routers: [
      {
        name: '银行卡',
        url: '../addcard/bank/bank?cardTypeIndex=0',
        icon: '../../images/cardlogo/bank_logo.png'
      },
      {
        name: '身份证',
        url: '../addcard/idcard/idcard?cardTypeIndex=1',
        icon: '../../images/cardlogo/id_card_logo.png'
      },
      {
        name: '名片',
        url: '../addcard/visitingCard/visitingCard?cardTypeIndex=5',
        icon: '../../images/cardlogo/mingpian_logo.png'
      },
      {
        name: '各种会员卡',
        url: '../addcard/vipCard/vipCard?cardTypeIndex=2',
        icon: '../../images/cardlogo/more_card_logo.png'
      },
      {
        name: '行驶证',
        url: '../addcard/car/car?cardTypeIndex=3&type=0',
        icon: '../../images/cardlogo/car_card_logo.png'
      },
      {
        name: '驾驶证',
        url: '../addcard/car/car?cardTypeIndex=4&type=1',
        icon: '../../images/cardlogo/move_card_logo.png'
      },
      
      {
        name: '营业执照',
        url: '../addcard/yyzz/yyzz?cardTypeIndex=6',
        // url: '../cardDetail/cardDetail?cardTypeIndex=0&imageUrl=http://bmob-cdn-18395.b0.upaiyun.com/2018/04/24/c048c36040565be38068e2f7fabdb585.png&objectId=8d8b055293',
        icon: '../../images/cardlogo/yyzz_logo.png'
      },
      {
        name: '传图识字',
        url: '/pages/index/index',
        icon: '../../images/cardlogo/wenzi_logo.png',
        app_id:'wx6bc5db901b3ccfde',
      },
      {
        name: '美图壁纸',
        url: '/pages/index/index',
        icon: '../../images/bizhi_logo.png',
        app_id: 'wxc35fd1193f81e100',
      },
      {
        name: '斗图表情包',
        url: '/pages/index/index',
        icon: '../../images/doutu_logo.png',
        app_id: 'wxd1940318aaeb6958',
      },
      {
        name: '更多敬请期待',
        // url: '../addcard/bankcopy/bank?cardTypeIndex=0'
        url:'',
        icon: '../../images/cardlogo/more_logo.png'
      }
      
    ],
    userInfo: null

  }
})