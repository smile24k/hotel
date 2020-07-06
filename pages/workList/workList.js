// pages/workList/workList.js
import constant from "../../utils/constant";
import {
  preview
} from "../../utils/common";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    works:[],
    page:1,
    size:20,
    hasMore:true,
    loading:false,
    link:"https://www.musicstoreintexas.com/",
    qrFlag:false
  },
  getWorks() {
    const {hasMore,loading,size,page} = this.data;
    if(!hasMore || loading){
      return;
    }
    this.setData({
      loading:true
    })
    wx.request({
      url: constant.apiUrl + '/web/wechat/works?page='+page+'&size='+size,
      complete: (res) => {
        wx.hideLoading({
          complete: (res) => {},
        })
      },
      fail: (res) => {},
      method: "GET",
      success: (result) => {
        const {
          data
        } = result;
        this.setData({
          works: this.data.works.concat(data.data),
          loading:false,
          hasMore:data.data.length > 19,
          page:++this.page
        })

      },
    })
  },
  copyText:function(e){
    var self=this;
    wx.setClipboardData({
    data: self.data.link,
    success: function(res) {
      
    }
  });
  },
  showImg(e) {
    
    const {
      target: {
        dataset: {
          index
        }
      }
    } = e;
    let images = this.data.works.map(item => item.image);
    preview(images, index);
  },
  showBanner(){
    wx.previewImage({
      urls: ["https://m.nimar.cn/file/image/banner.png"],
      current:"https://m.nimar.cn/file/image/banner.png"
    })
  },
  showQr(){
    this.setData({
      qrFlag:true
    })
  },
  closeQr(){
    this.setData({
      qrFlag:false
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getWorks();
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