// pages/addShop/addShop.js
const app =getApp();
import {
  getArea,
  getMerchantCategory,
  batchUpload,
} from "../../utils/common";
import constant from "../../utils/constant";
function initTime(){
  return [
    "00:00",
    "02:00",
    "03:00",
    "04:00",
    "05:00",
    "06:00",
    "07:00",
    "08:00",
    "09:00",
    "10:00",
    "11:00",
    "12:00",
    "13:00",
    "14:00",
    "15:00",
    "16:00",
    "17:00",
    "18:00",
    "19:00",
    "20:00",
    "21:00",
    "22:00",
    "23:00"
  ]
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    files: [],
    show: false,
    currIndex: 0,
    
    showImage: [],
    accounts: [],
    accountIndex: 0,
    cateIndex:0,
    category: "",
    cateList: [],
    multiArray: [initTime(), initTime()],
    multiIndex: [5, 20],
    formData: {

    },
    rules: [{
      name: 'name',
      rules: {
        required: true,
        message: '请填写名称'
      },
    }, {
      name: 'mobile',
      rules: [{
        required: true,
        message: '请填写手机号'
      }],
    }]
  },
  formInputChange(e) {
    const {
      field
    } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
    })
  },
  bindMultiPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      multiIndex: e.detail.value
    })
  },
  submitForm() {
    let user = app.userData || app.userInfo;
    let openId = app.openId;
    const { accounts, accountIndex, cateList, cateIndex, multiIndex,multiArray } = this.data;
    if(!user.avatar){
      wx.showModal({
        complete: (res) => {},
        confirmText: '确定',
        showCancel:false,
        content: '请授权后进行发布',
        fail: (res) => {},
        success: (result) => {
          wx.navigateTo({
            url: '../getUser/getUser'
          })
        },
        title: '提示',
      })
      return;
    }
    this.setData({
      ['formData.user']: user,
      ['formData.area']: accounts[accountIndex].code,
      ['formData.areaText']: accounts[accountIndex].name,
      ['formData.category']: cateList[cateIndex].code,
      ['formData.categoryText']: cateList[cateIndex].name,
      ['formData.openId']: openId,
      ['formData.businessTime']: multiArray[0][multiIndex[0]] + '-' + multiArray[1][multiIndex[1]],

      
    })
    this.selectComponent('#form').validate((valid, errors) => {
      console.log('valid', valid, errors)
      if (!valid) {
        const firstError = Object.keys(errors)
        if (firstError.length) {
          this.setData({
            error: errors[firstError[0]].message
          })

        }
      } else {
        this.upPic();
      }
    })
  },
  upPic(){
    const {files} = this.data;
    let that = this;
    if(!files.length){
      this.saveData();
      return;
    }
    wx.showLoading({
      title: '保存中',
      mask:true
    })
    debugger;
    let params = {
      uploadUrl: constant.apiUrl + "/web/image/batch", // 图片上传接口
      imgPaths: files,
      resultData: this.data.showImage
    };
    batchUpload(params, batchUpload, (res) => {
        let showImage = that.data.showImage
        showImage = res.imgPaths
        that.setData({
          ['formData.images']: showImage
        })
        this.saveData();
      })
  },
  saveData() {
    const { formData } = this.data;
    wx.request({
      url: constant.apiUrl + "/web/wechat/merchant",
      complete: (res) => { },
      data: formData,
      fail: (res) => { },
      method: "POST",
      success: (result) => {
        wx.hideLoading({
        })
        wx.showToast({
          title: '提交成功',
          icon: 'none'
        })
        wx.switchTab({
          url: '../index/index',
        })
      },
    })
  },
  chooseImage: function (e) {
    var that = this;
    if (that.data.files.length == 10) {
      return;
    }
    wx.chooseImage({
      count: 10 - this.data.files.length,
      sizeType: ['compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  showImg(e) {
    this.setData({
      show: true,
      currIndex: e.target.dataset.index
    })
    // preview(this.data.files,e.target.dataset.index)
  },
  change(e) {
    console.log('current index has changed', e.detail)
  },
  delete(e) {
    console.log('delete', e.detail)
    const {
      detail: {
        index
      }
    } = e;
    const {
      files
    } = this.data;
    files.splice(index, 1);
    this.setData({
      files
    })
  },
  hide() {
    this.setData({
      show: false
    })
  },
  bindAccountChange: function (e) {
    console.log('picker account 发生选择改变，携带值为', e.detail.value);

    this.setData({
      accountIndex: e.detail.value
    })
  },
  bindCateChange: function (e) {

    this.setData({
      cateIndex: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 获取用户信息
    let user = app.userData || app.userInfo;
    app.getSetting(() => {},(flag)=>{
      if(flag && !user.avatar){

        wx.navigateTo({
          url: '../getUser/getUser'
        })
      }
    })
    getArea(data => {
      this.setData({
        accounts: data.data
      })
    });
    getMerchantCategory(data => {
      this.setData({
        cateList: data.data,
        category: data.data[0].code
      })
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    


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
