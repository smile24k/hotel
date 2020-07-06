// pages/send/sendDetail/sendDetail.js
const app = getApp();
import constant from "../../../utils/constant";

import {
  preview,
  addPoints
} from "../../../utils/common";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    sendDetail:{},
    zanLoading:false,
    description:"",
    mask:false,
    content:"",
    orderId:"",
    sender:{},
    openId:""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.id){
      this.setData({
        orderId:options.id
      })

      this.getSendDetailById(options.id);
    }
  },
  setContent(e){
    this.setData({
      content:e.detail.value
    })
  },
  getSendDetailById(id){
    const {openId} = app;

    if(!openId){
      app.getOpenId(openId => {
        this.getSendDetailById(id);
      })
      return;
    }
    this.setData({
      openId
    })
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
    const {openId} = app;
    const obj = {
      openId,
      points:2,
      orderId:this.data.orderId
    }
    addPoints(obj);

  },
  showMask(){
    let user = app.userData || app.userInfo;
    if(!user.avatar){
      wx.showModal({
        complete: (res) => {},
        confirmText: '确定',
        showCancel:false,
        content: '请授权后进行评论',
        fail: (res) => {},
        success: (result) => {
          wx.navigateTo({
            url: '../../getUser/getUser'
          })
        },
        title: '提示',
      })
      return;
    }
    const {openId} = app;
    if(!user.openId){
      user.openId = openId;
    }
    this.setData({
      sender:user,
      mask:true
    })
  },
  closeModal(){
    this.setData({
      mask:false
    })
  },
  commit(){
    const {content,orderId,sender,sendDetail:{id}} = this.data;
    if(!content){
      this.setData({
        mask:false
      })
      return;
    }
    const postData = {
      category:"publish",
      content,
      relationId:id,
      sender
    }
    

    wx.request({
      url: `${constant.apiUrl}/web/wechat/comment`,
      complete: (res) => {
      },
      data:postData,
      fail: (res) => {},
      method: "POST",
      success: (result) => {
        if (result.data.status == 200) {
          wx.showToast({
            title: '评论成功',
            icon:'none'
          })
          this.getSendDetailById(orderId);
          this.setData({
            mask:false
          })
        }
      },
    })

  },
  delete(e){
    const {currentTarget:{dataset:{id}}} = e;
    const {orderId} = this.data;

    const postData = {
    }

    

    wx.request({
      url: `${constant.apiUrl}/web/wechat/comment/${id}`,
      complete: (res) => {
      },
      data:postData,
      fail: (res) => {},
      method: "DELETE",
      success: (result) => {
        if (result.data.status == 200) {
          wx.showToast({
            title: '删除成功',
            icon:'none'
          })
          this.getSendDetailById(orderId);
        }
      },
    })

  }
})