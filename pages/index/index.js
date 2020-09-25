const app = getApp();
import constant from "../../utils/constant";
import {
  preview
} from "../../utils/common";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category: [],
    indicatorDots: true,
    vertical: false,
    autoplay: true,
    interval: 2000,
    duration: 500,
    bannerList: [],
    news: [],
    shopList:[],
    works:[],
    showPublishFlag:false
  },

  getCates() {
    wx.request({
      url: constant.apiUrl + '/web/dictionary/publish',
      complete: (res) => {},
      fail: (res) => {},
      method: "GET",
      success: (result) => {
        const {
          data
        } = result;
        this.setData({
          category: data.data
        })

      },
    })
  },
  getBanner() {
    wx.request({
      url: constant.apiUrl + '/web/wechat/banner',
      complete: (res) => {},
      fail: (res) => {},
      method: "GET",
      success: (result) => {
        const {
          data
        } = result;
        this.setData({
          bannerList: data.data
        })

      },
    })
  },
  goReqList(){
    wx.navigateTo({
      url: '../reqList/reqList',
    })
  },
  getNews() {
    wx.showLoading({
      title: '加载中...'
    })
    wx.request({
      url: constant.apiUrl + '/web/wechat/news',
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
          news: data.data
        })

      },
    })
  },
  getBusiness() {
    wx.request({
      url: constant.apiUrl + '/web/wechat/merchant?page=1&size=10&status=1',
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
          shopList: data.data
        })

      },
    })
  },
  getWorks() {
    wx.request({
      url: constant.apiUrl + '/web/wechat/works?page=1&size=1&category=instrument',
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
          works: data.data
        })

      },
    })
  },
  goWeb(e) {
    console.log(e);
    
    const {
      currentTarget: {
        dataset: {
          url
        }
      }
    } = e;
    wx.navigateTo({
      url: '../webView/view?url=' + url,
    })
  },
  goWorkList(){
    wx.navigateTo({
      url: '../workList/workList',
    })
  },
  goBook(){
    wx.navigateTo({
      url: '../book/book',
    })
  },
  goReqDetail(e){
    const {currentTarget:{dataset:{id}}} = e;
    wx.navigateTo({
      url: '../reqDetail/reqDetail?id='+id,
    })
  },
  clickCate(e) {
    const {
      target: {
        dataset: {
          item
        }
      }
    } = e;

    wx.navigateTo({
      url: '../send/send/send?code=' + item.code,
    })
  },
  changeIndicatorDots() {
    this.setData({
      indicatorDots: !this.data.indicatorDots
    })
  },

  changeAutoplay() {
    this.setData({
      autoplay: !this.data.autoplay
    })
  },

  intervalChange(e) {
    this.setData({
      interval: e.detail.value
    })
  },

  durationChange(e) {
    this.setData({
      duration: e.detail.value
    })
  },
  addShop(){
    wx.navigateTo({
      url: '../addShop/addShop',
    })
  },
  showImg(e) {
    
    const {
      target: {
        dataset: {
          index
        }
      }
    } = e;
    preview(this.data.bannerList, index);
  },
  goWeb(){
    wx.navigateTo({
      url: '../webView/copyLink/copyLink',
    })
  },
  goPublish(){
    wx.navigateTo({
      url: '../send/sendData/sendData',
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCates();
    this.getWorks();
    this.getBanner();
    this.getNews();
    
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
    
    // this.getAuth();
    app.getAuth(res => {
      this.setData({
        showPublishFlag:res
      })
    })
    this.getBusiness();
  },
  onShareAppMessage() {

  }
})
