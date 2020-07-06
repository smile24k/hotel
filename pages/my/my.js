// pages/my/my.js
const app = getApp();
import constant from "../../utils/constant";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    size:1,
    count:0,
    msgCount:0,
    userData:app.userData,
    showPublishFlag:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  getMessage(){
    const {page,size} = this.data;
    const {openId} = app;
    let url = `${constant.apiUrl}/web/wechat/notice?page=${page}&size=${size}&openId=${openId}&status=0`;
    wx.request({
      url,
      complete: (res) => {
      },
      fail: (res) => {},
      method: "GET",
      success: (result) => {
        if (result.data.status == 200) {
          this.setData({
            count:result.data.page.total
          })
        }
      },
    })
  },
  getPrivate(){
    const {page,size} = this.data;
    const {openId} = app;
    let url = `${constant.apiUrl}/web/wechat/message?page=${page}&size=${size}&openId=${openId}&status=0`;
    wx.request({
      url,
      complete: (res) => {
      },
      fail: (res) => {},
      method: "GET",
      success: (result) => {
        if (result.data.status == 200) {
          this.setData({
            msgCount:result.data.page.total
          })
        }
      },
    })
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
    const {openId} = app;
    let that = this;
    app.getAuth(res => {
      this.setData({
        showPublishFlag:res
      })
    })
    if(!openId){
      app.getOpenId(id => {
        this.getMessage();
        this.getPrivate();
        that.getUserData(id);
      })
      return;
    }
    this.getMessage();
    this.getPrivate();
    this.getUserData(openId);
  },
  getUserData(openId){
    app.getUserData(openId,function(data){
      this.setData({
        userData:data
      })
    }.bind(this));
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