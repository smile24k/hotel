// pages/message/sendMsg/sendMsg.js
const app = getApp();
import constant from "../../../utils/constant";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name:"",
    openId:"",
    id:"",
    content:""

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(options.name){
      this.setData({
        name:decodeURI(options.name),
        openId:options.openId,
        id:options.id
      })
    }
  },
  setContent(e){
    this.setData({
      content:e.detail.value
    })
  },
  saveData(){
    const {content,openId,id} = this.data;
    if(!content){
      wx.showToast({
        title: '请输入内容',
        icon:'none'
      })
      return;
    }
    let sender = app.userData || app.userInfo;
    sender['openId'] = app.openId;
    const postData = {
      content,
      receiver:{openId},
      sender
    }
    

    wx.request({
      url: `${constant.apiUrl}/web/wechat/message`,
      complete: (res) => {
      },
      data:postData,
      fail: (res) => {},
      method: "POST",
      success: (result) => {
        if (result.data.status == 200) {
          wx.showToast({
            title: '发送成功',
            icon:'none'
          })

          setTimeout(() => {
            wx.navigateBack({
              delta: 1
            })
          }, 1000);
        }else{
          wx.showToast({
            title: result.data.msg
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