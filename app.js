//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
      }
    })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

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
    cardType: ['银行卡', '身份证', '行驶证', '驾驶证', '名片', '营业执照'],
    routers: [
      {
        name: '银行卡',
        url: '../addcard/bank/bank?cardTypeIndex=0',
        icon: '../../images/cardlogo/bank_logo.png'
      },
      {
        name: '身份证',
        url: '../addcard/bank/bank?cardTypeIndex=1',
        icon: '../../images/cardlogo/id_card_logo.png'
      },
      {
        name: '行驶证',
        url: '../addcard/bank/bank?cardTypeIndex=2',
        icon: '../../images/cardlogo/car_card_logo.png'
      },
      {
        name: '驾驶证',
        url: '../addcard/bank/bank?cardTypeIndex=3',
        icon: '../../images/cardlogo/move_card_logo.png'
      },
      {
        name: '名片',
        url: '../addcard/bank/bank?cardTypeIndex=4',
        icon: '../../images/cardlogo/mingpian_logo.png'
      },
      {
        name: '营业执照',
        url: '../addcard/bank/bank?cardTypeIndex=5',
        icon: '../../images/cardlogo/yyzz_logo.png'
      },
      {
        name: '更多敬请期待',
        url: '',
        icon: '../../images/cardlogo/more_logo.png'
      }
      
    ],
    userInfo: null

  }
})