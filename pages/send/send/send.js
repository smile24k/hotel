import {
  getArea,
  getCategory,
  preview
} from "../../../utils/common";
import constant from "../../../utils/constant";
Page({

  /**
   * 页面的初始数据
   */
  data: {
    orderList: [{
      name: "默认排序",
      id: 1
    }],

    orderIndex: 0,
    areaList: [],
    areaIndex: 0,
    cateList: [],
    cateIndex: 0,
    types: [{
        name: "全部",
        id: 1
      },
      {
        name: "求购",
        id: 2
      },
      {
        name: "出售",
        id: 3
      }
    ],
    typeIndex: 0,
    image: [
    ],
    page: 1,
    size: 10,
    hasMore: true,
    area: "",
    category: "",
    sendList: []
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
      sendList: [],
      page: 1,
      hasMore: true
    })
    this.getSendList();
  },
  bindMultiPickerColumnChange: function (e) {
    console.log('修改的列为', e, '，值为', e);

  },
  setTypeIndex(e) {
    const {
      target: {
        dataset: {
          index
        }
      }
    } = e;
    this.setData({
      typeIndex: index,
      sendList: [],
      page: 1,
      hasMore: true
    })
    this.getSendList();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    getArea(data => {
      let index = 0;
      
      this.setData({
        areaList: data.data,
        area: data.data[index].name,
        areaIndex:index
      })
      getCategory(data => {
        let k = 0;
        if(options.code){
          data.data.forEach((item,i) => {
            if(item.code == options.code){
              k = i;
            }
          })
         
        }
        this.setData({
          cateList: data.data,
          category: data.data[k].code,
          cateIndex:k
        })
        this.getSendList();
      });


    });

  },

  getSendList() {
    const {
      page,
      size,
      category,
      sendList,
      hasMore,
      areaList,
      areaIndex
    } = this.data;
    if (!hasMore) {
      return;
    }
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    let area = areaList[areaIndex].code;
    wx.request({
      url: `${constant.apiUrl}/web/wechat/publish?page=${page}&size=${size}&area=${area}&category=${category}`,
      // url: `${constant.apiUrl}/web/wechat/publish?page=${page}&size=${size}`,
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
            sendList: [...sendList, ...result.data.data],
            hasMore: result.data.data.length >= 10,
            page: page + 1
          })
        }
      },
    })
  },

  goSend() {
    wx.navigateTo({
      url: '../sendData/sendData',
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
  }
})
