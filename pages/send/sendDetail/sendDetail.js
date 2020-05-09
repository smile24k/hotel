// pages/send/sendDetail/sendDetail.js
const app = getApp();
import constant from "../../../utils/constant";
import {
  preview
} from "../../../utils/common";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sendDetail:{},
    zanLoading:false,
    description:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){

      this.getSendDetailById(options.id);
    }
  },

  getSendDetailById(id){
    const {openId} = app;

    if(!openId){
      app.getOpenId(openId => {
        this.getSendDetailById(id);
      })
      return;
    }
    wx.request({
      url: `${constant.apiUrl}/web/wechat/publish/${id}?lookOpenId=${openId}`,
      complete: (res) => {
        wx.hideLoading({
          complete: (res) => {},
        })
      },
      fail: (res) => {},
      method: "GET",
      success: (result) => {
        if (result.data.status == 200) {
          this.setData({
           sendDetail:result.data.data
          })
        }
      },
    })
  },
  zan(e){
    const {openId} = app;
    const {zanLoading,sendDetail} = this.data;
    if(zanLoading){
      return;
    }
    this.setData({
      zanLoading:true
    })
    const postData = {
      openId,
      relationId:sendDetail.id,
      type:1,//1点赞,0取消
      category:"publish"
    };
    wx.request({
      url: `${constant.apiUrl}/web/wechat/appreciate`,
      complete: (res) => {
        sendDetail.appreciate.flag = 1;

        
        this.setData({
          zanLoading:false,
          sendDetail:sendDetail
        })
      },
      data:postData,
      fail: (res) => {},
      method: "POST",
      success: (result) => {
        if (result.data.status == 200) {
          
        }
      },
    })
    
  },
  showImg(e) {
    const {
      target: {
        dataset: {
          index,
          images
        }
      }
    } = e;

    preview(images, index);
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

  }
})