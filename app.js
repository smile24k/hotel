//app.js
import constant from "./utils/constant";
App({
  onLaunch: function () {
    // 展示本地存储能力
    var openId = wx.getStorageSync('openId') || "";
    if(!openId){
      // 登录
      wx.login({
        success: res => {
          // 发送 res.code 到后台换取 openId, sessionKey, unionId
          const data = {};
          wx.request({
            url: constant.apiUrl + "/web/wechat/api/jscode2session/"+res.code,
            complete: (res) => {},
            data: data,
            fail: (res) => {
              wx.showToast({
                title: '获取用户信息失败',
                icon:'none'
              })
            },
            method: "POST",
            success: (result) => {
              const {data:{openid,session_key}} = result.data;
              
              if(openid){
                wx.setStorageSync('openId', openid);
                this.openId = openid;
              }
              if(session_key){
                wx.setStorageSync('sessionKey', session_key);
              }
            },
          })
        }
      })
    }else{
      this.openId = openId;
      this.getUserData(openId);
    }
    // 获取用户信息
    this.getSetting();
    
  },

  getSetting(cb1,cb2){
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.userInfo = res.userInfo;
              
              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
              cb1 && typeof cb1 === 'function' && cb1(res.userInfo);
            }
          })
        }else{
          cb2 && typeof cb2 === 'function' && cb2(true);
        }
      }
    })
  },

  getUserData(openId){
    wx.request({
      url: constant.apiUrl + "/web/wechat/user/auth/"+openId,
      complete: (res) => {},
      data: {},
      fail: (res) => {},
      method: "POST",
      success: (result) => {
        this.userData = result.data.data;
      },
    })
  },
  globalData: {
    userInfo: null
  },
  openId:"",
  userInfo:{},
  userData:{}
})