const app = getApp();
import {
  getArea,
  getGoodsCategory,
  preview
} from "../../utils/common";
import constant from "../../utils/constant";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
    areaList: [],
    areaIndex: 0,
    hasMore:true,
    loading:false,
    size:20,
    page:1,
    works:[],
    qrFlag:false
    
  },

  bindMultiPickerChange: function (e) {
    const {
      detail: {
        value
      },
      target: {
        dataset: {
          type
        }
      }
    } = e;
    const {
      areaList,
      cateList
    } = this.data;
    switch (type) {
      case "area":
        this.setData({
          areaIndex: value,
          area: areaList[value].name
        });
        break;
      case "cate":
        this.setData({
          cateIndex: value,
          category: cateList[value].code
        });
        break;
      case "order":
        this.setData({
          orderIndex: value
        });
        break;
      default:
        break;
    }
    this.setData({
      works: [],
      page: 1,
      hasMore: true
    })
    this.getWorks();
  },
  getWorks() {
    const {hasMore,loading,size,page,areaList,areaIndex} = this.data;
    if(!hasMore || loading){
      return;
    }
    this.setData({
      loading:true
    })
    wx.showLoading({
      title: '加载中...',
    })
    let url = constant.apiUrl + '/web/wechat/works?page='+page+'&size='+size;
    if(areaList[areaIndex].code){
      url += "&category="+areaList[areaIndex].code;
    }
    wx.request({
      url,
      complete: (res) => {
        wx.hideLoading({
          complete: (res) => {},
        })
      },
      fail: (res) => {
        wx.hideLoading();
      },
      method: "GET",
      success: (result) => {
        const {
          data
        } = result;
        this.setData({
          works: this.data.works.concat(data.data),
          loading:false,
          hasMore:data.data.length > 19,
          page:++this.data.page
        })

        wx.hideLoading();

      },
    })
  },
  bindscrolltolower(){

    this.getWorks();
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e, '，值为', e);

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
    getGoodsCategory(data => {
      let index = 0;
      
      this.setData({
        areaList: data.data,
        area: data.data[index].name,
        areaIndex:index
      })
      if(data.data.length){
        this.getWorks();
      }

    });

  },
  onShow(){
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
  
})
