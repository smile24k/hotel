import constant from "../../utils/constant";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    category:[
    ],
    indicatorDots: true,
    vertical: false,
    autoplay: false,
    interval: 2000,
    duration: 500,
    bannerList:[]
  },

  getCates(){
    wx.request({
      url: constant.apiUrl + '/web/dictionary/publish',
      complete: (res) => {},
      fail: (res) => {},
      method: "GET",
      success: (result) => {
        const {data} = result;
        this.setData({
          category:data.data
        })
        
      },
    })
  },
  getBanner(){
    wx.request({
      url: constant.apiUrl + '/web/wechat/banner',
      complete: (res) => {},
      fail: (res) => {},
      method: "GET",
      success: (result) => {
        const {data} = result;
        this.setData({
          bannerList:data.data
        })
        
      },
    })
  },
  clickCate(e){
    const {
      target: {
        dataset: {
          item
        }
      }
    } = e;
    
    wx.navigateTo({
      url: '../send/send/send?code='+item.code,
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

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCates();
    this.getBanner();
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
  onShareAppMessage(){
    
  }
})
