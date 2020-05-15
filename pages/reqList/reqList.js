// pages/reqList/reqList.js
import constant from "../../utils/constant";
import {getMerchantCategory} from "../../utils/common"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    shopList:[],
    page:1,
    hasMore:true,
    size:10,
    loading:false,
    cateIndex:0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    getMerchantCategory(function (data){
      this.setData({
        cateList:data.data
      })
      if(data.data.length){

        this.getBusiness(data.data[0].code);
      }
    }.bind(this))
  },
  getBusiness(code) {
    if(!code){
      return;
    }
    const {page,size,hasMore,loading} = this.data;
    if(loading || !hasMore){
      return;
    }
    wx.showLoading({
      title: '加载中...'
    })
    this.setData({
      loading:true
    })
    const url = `${constant.apiUrl}/web/wechat/merchant?status=1&page=${page}&size=${size}&category=${code}`
    wx.request({
      url: url,
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
          shopList: [...this.data.shopList,...data.data],
          hasMore:data.data.length > 9,
          page:page+1,
          loading:false
        })

      },
    })
  },
  setCateIndex(e){
    const {cateList} = this.data;
    const {target:{dataset:{index}}} = e;
    this.setData({
      cateIndex:index,
      page:1,
      hasMore:true,
      loading:false,
      shopList:[]
    })

    this.getBusiness(cateList[index].code);

  },
  lower(){
    const {cateList,cateIndex} = this.data;
    this.getBusiness(cateList[cateIndex].code);

  },
  goReqDetail(e){
    const {currentTarget:{dataset:{id}}} = e;
    wx.navigateTo({
      url: '../reqDetail/reqDetail?id='+id,
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

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})