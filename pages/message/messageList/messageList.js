// pages/message/messageList/messageList.js
const app = getApp();
import constant from "../../../utils/constant";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    page:1,
    size:20,
    messageList:[],
    loading:false,
    hasMore:true,
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    const {openId} = app;

    if(!openId){
      app.getOpenId(id => {
        this.getMessage();
      })
      return;
    }
    this.getMessage();
  },

  getMessage(){
    const {page,size,messageList,loading,hasMore} = this.data;
    if(loading || !hasMore){
      return;
    }
    wx.showLoading({
      title: '加载中...'
    })
    this.setData({
      loading:true
    })
    const {openId} = app;
    let url = `${constant.apiUrl}/web/wechat/notice?page=${page}&size=${size}&openId=${openId}&status=0`;
    wx.request({
      url,
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
            messageList:[...messageList,...result.data.data],
            hasMore:result.data.data.length > 19,
            page:page+1,
            loading:false
          })
          
    this.read();
        }
      },
    })
  },
  goDetail(e){
    const {currentTarget:{dataset:{id}}} = e;
    wx.navigateTo({
      url: '../../send/sendDetail/sendDetail?id='+id,
    })
  },
  lower(){
    this.getMessage();

  },

  read(){
    const {openId} = app;
    let url = `${constant.apiUrl}/web/wechat/notice/${openId}`;
    wx.request({
      url,
      complete: (res) => {
      },
      fail: (res) => {},
      method: "POST",
      data:{},
      success: (result) => {
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