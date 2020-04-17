let app = getApp();
import {
  getArea,
  getCategory
} from "../../../utils/common";
import constant from "../../../utils/constant";
Page({
  data: {
    files: [],
    showTopTips: false,
    countryIndex: 0,
    category:"",
    cateList:[],
    accounts: [],
    accountIndex: 0,
    cateIndex:0,

    isAgree: false,
    formData: {},
    rules: [{
      name: 'mobile',
      rules: [{
        required: true,
        message: 'mobile必填'
      }, {
        mobile: true,
        message: 'mobile格式不对'
      }],
    }],
  },
  onShow() {
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.userInfo = res.userInfo;


              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        } else {
          wx.redirectTo({
            url: '../../getUser/getUser'
          })
        }
      }
    })


  },
  formInputChange(e) {
    const {
      field
    } = e.currentTarget.dataset
    this.setData({
      [`formData.${field}`]: e.detail.value
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
  bindAgreeChange: function (e) {
    this.setData({
      isAgree: !!e.detail.value.length
    });
  },
  submitForm() {
    let user = app.userData;
    const {accounts,accountIndex,cateList,cateIndex,files} = this.data;
    this.setData({
      ['formData.user']: user,
      ['formData.area']: accounts[accountIndex].code,
      ['formData.areaText']: accounts[accountIndex].name,
      ['formData.category']: cateList[cateIndex].code,
      ['formData.categoryText']: cateList[cateIndex].name,
      ['formData.images']:files
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
        this.saveData();
      }
    })
  },
  saveData(){
    const {formData} = this.data;
    wx.request({
      url: constant.apiUrl + "/web/wechat/publish",
      complete: (res) => {},
      data: formData,
      fail: (res) => {},
      method: "POST",
      success: (result) => {
        wx.showToast({
          title: '发布成功',
          icon:'none'
        })
        wx.switchTab({
          url: '../../index/index',
        })
      },
    })
  },
  onLoad() {
    this.setData({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this)
    })

    getArea(data => {
      this.setData({
        accounts: data.data
      })
    });
    getCategory(data => {
      this.setData({
        cateList: data.data,
        category: data.data[0].code
      })
    });
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      count:1,
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  selectFile(files) {
    console.log('files', files)
    // 返回false可以阻止某次文件上传
  },

  uplaodFile(files) {
    
    let tempFilePaths = files.tempFilePaths;
    console.log('upload files', files)
    let that = this;
    return new Promise((resolve, reject) => {
      wx.uploadFile({
        url: constant.apiUrl + "/web/image/batch", //仅为示例，非真实的接口地址
        filePath: tempFilePaths[index],
        header: {
          "Content-Type": "multipart/form-data"
        },
        name: 'file',
        success(res) {
          const data = res.data;
          resolve({urls:JSON.parse(data).data});
        },
        fail(err){
          console.log(err);
          
        }
      })
    })

    // 文件上传的函数，返回一个promise
    
  },
  uploadError(e) {
    console.log('upload error', e.detail)
  },
  uploadSuccess(e) {
    
  }
});
