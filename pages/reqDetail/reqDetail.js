// pages/reqDetail/reqDetail.js
const app = getApp();
import constant from "../../utils/constant";
import {preview} from "../../utils/common";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    detail:{},
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    showPublishFlag:false
  },
  getDetail(id) {
    wx.request({
      url: constant.apiUrl + '/web/wechat/merchant/'+id,
      complete: (res) => {},
      fail: (res) => {},
      method: "GET",
      success: (result) => {
        const {
          data
        } = result;
        this.setData({
          detail: data.data
        })

      },
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      this.getDetail(options.id);
    }
  },
  preview(e){
    let index = e.target.dataset.index;
    console.log(index);
    
    preview(this.data.detail.images,index);
  },
  phone(){
    wx.makePhoneCall({
      phoneNumber: this.data.detail.mobile
    })
  },
  submitForm(){
    wx.redirectTo({
      url: '../addShop/addShop',
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
    app.getAuth(res => {
      this.setData({
        showPublishFlag:res
      })
    })
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

  }
})