// pages/myData/myData.js

const app = getApp();
import {
  batchUpload,
} from "../../utils/common";

import constant from "../../utils/constant";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userData:app.userData,
    files:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {openId} = app;
    let that = this;
    if(!openId){
      app.getOpenId(id => {
        console.log(id);
        
        that.getUserData(id);
      })
      return;
    }
    this.getUserData(openId);
    
  },

  getUserData(openId){
    const {userData} = app;
    if(!userData.openId){
      app.getUserData(openId,function(data){
        this.setData({
          userData:data
        })
      }.bind(this));
    }else{
      this.setData({
        userData
      })
    }
  },
  setName(e){
    this.data.userData["nickName"] = e.detail.value;
    this.setData({
      userData:this.data.userData
      })
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count:1,
      sizeType: [ 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.data.userData.avatar = res.tempFilePaths[0];
        that.setData({
          userData:that.data.userData,
          files:res.tempFilePaths
        });
      }
    })
  },
  upPic(){
    const {files,userData:{nickName}} = this.data;
    if(!nickName){
      wx.showToast({
        title: '名称不能为空',
      })
      return;
    }
    let that = this;
    if(!files.length){
      this.saveData();
      return;
    }
    wx.showLoading({
      title: '保存中',
      mask:true
    })
    let params = {
      uploadUrl: constant.apiUrl + "/web/image/batch", // 图片上传接口
      imgPaths: files,
      resultData: this.data.showImage
    };
    batchUpload(params, batchUpload, (res) => {
        let showImage = that.data.showImage
        showImage = res.imgPaths
        that.setData({
          ['userData.avatar']: showImage[0]
        })
        this.saveData();
      })
  },
  saveData() {
    const { userData } = this.data;
    wx.request({
      url: constant.apiUrl + "/web/wechat/user/login",
      complete: (res) => { },
      data: userData,
      fail: (res) => { },
      method: "POST",
      success: (result) => {
        wx.hideLoading({
        })
        if(result.data.status == 200){

          wx.showToast({
            title: '设置成功',
            icon: 'none'
          })
          wx.navigateBack({
            delta: 1
          })
        }

        // wx.switchTab({
        //   url: '../../index/index',
        // })
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