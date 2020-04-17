// pages/getUser/getUser.js
import constant from "../../utils/constant";
let app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:{}
  },

  onGotUserInfo: function (e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)
    
    app.userInfo = e.detail.userInfo;
    
    this.setData({
      userInfo:e.detail.userInfo
    })
    if(e.detail.errMsg){

      this.saveUser();
    }
  },

  
  saveUser(){
    const {userInfo} = this.data;
    const {openId} = app;
    const postData = {
      ...userInfo,
      avatar:userInfo.avatarUrl,
      openId
    };
    wx.request({
      url: constant.apiUrl + "/web/wechat/user/login",
      complete: (res) => {},
      data: postData,
      fail: (res) => {},
      method: "POST",
      success: (result) => {
        if(result.data.status == 200){

          wx.switchTab({
            url: '../send/sendData/sendData',
          })
        }else{
          wx.showToast({
            title: result.data.msg || '保存失败',
            icon:'none'
          })
        }
      },
    })
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

  }
})