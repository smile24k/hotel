let app = getApp();
import {
  getArea,
  getAddCategory,
  batchUpload,
  preview
} from "../../../utils/common";
import constant from "../../../utils/constant";
Page({
  data: {
    files: [],
    showImage: [],
    showTopTips: false,
    countryIndex: 0,
    category: "",
    cateList: [],
    accounts: [],
    accountIndex: 0,
    cateIndex: 0,

    isAgree: false,
    formData: {},
    show:false,
    currIndex:0,
    rules: [{
      name: 'mobile',
      rules: [{
        required: true,
        message: '手机号必填'
      }],
    }],
    showPublishFlag:false
  },
  onShow() {
    app.getAuth(res => {
      this.setData({
        showPublishFlag:res
      })
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
  submitForm() {
    
    let user = app.userData || app.userInfo;
    if(!user.avatar){
      wx.showModal({
        complete: (res) => {},
        confirmText: '确定',
        showCancel:false,
        content: '请授权后进行发布',
        fail: (res) => {},
        success: (result) => {
          wx.navigateTo({
            url: '../../getUser/getUser'
          })
        },
        title: '提示',
      })
      return;
    }
    const { accounts, accountIndex, cateList, cateIndex, isAgree } = this.data;
    this.setData({
      ['formData.user']: user,
      ['formData.area']: accounts[accountIndex].code,
      ['formData.areaText']: accounts[accountIndex].name,
      ['formData.category']: cateList[cateIndex].code,
      ['formData.categoryText']: cateList[cateIndex].name
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
        if(!isAgree){
          this.setData({
            error:"请确认相关条款"
          })
          return;
        }
        this.upPic();
      }
    })
  },
  saveData() {
    const { formData } = this.data;
    wx.request({
      url: constant.apiUrl + "/web/wechat/publish",
      complete: (res) => { },
      data: formData,
      fail: (res) => { },
      method: "POST",
      success: (result) => {
        wx.hideLoading({
        })
        wx.showToast({
          title: '发布成功',
          icon: 'none'
        })

        wx.redirectTo({
          url: '../send/send?code=' + formData.category,
        })

        // wx.switchTab({
        //   url: '../../index/index',
        // })
      },
    })
  },
  subscrib(){
    wx.requestSubscribeMessage({
      tmplIds: ['ZHo6XbfKfaS0CM0qsMs5R7wSYFOkCYSUmCLhVe-az0w'],
      success (res) {
       }
    })
  },
  onLoad() {
    let user = app.userData || app.userInfo;
    app.getSetting(() => {},(flag)=>{
      if(flag && !user.avatar){

        wx.navigateTo({
          url: '../../getUser/getUser'
        })
      }
    })
    this.setData({
      selectFile: this.selectFile.bind(this),
      uplaodFile: this.uplaodFile.bind(this)
    })

    getArea(data => {
      this.setData({
        accounts: data.data
      })
    });
    getAddCategory(data => {
      this.setData({
        cateList: data.data,
        category: data.data[0].code
      })
    });
    
  },
  chooseImage: function (e) {
    var that = this;
    if(that.data.files.length == 9){
      return;
    }
    wx.chooseImage({
      count:9 - this.data.files.length,
      sizeType: [ 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  showImg(e){
    this.setData({
      show:true,
      currIndex:e.target.dataset.index
    })
    // preview(this.data.files,e.target.dataset.index)
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  },
  selectFile(files) {
    // 返回false可以阻止某次文件上传
    this.setData({
      files: this.data.files
    });
  },

  uplaodFile(files) {

    let that = this;
    const tempFilePaths = files.tempFilePaths
    let file = tempFilePaths[0];
    let params = {
      uploadUrl: constant.apiUrl + "/web/image/batch", // 图片上传接口
      imgPaths: tempFilePaths,
      resultData: this.data.showImage
    }

    return new Promise((resolve, reject) => {

      // batchUpload(params, batchUpload, (res) => {
      //   let showImage = that.data.showImage
      //   showImage = res.imgPaths
      //   console.error("shagnchuanchenggong")
      //   that.setData({
      //     showImage
      //   })
      //   resolve({ urls: this.data.files })
      // })
      resolve({urls:this.data.files})

    })
    // return new Promise((resolve, reject) => {
    //   wx.uploadFile({
    //     url: constant.apiUrl + "/web/image/batch", //仅为示例，非真实的接口地址
    //     filePath: tempFilePaths[index],
    //     header: {
    //       "Content-Type": "multipart/form-data"
    //     },
    //     name: 'file',
    //     success(res) {
    //       const data = res.data;
    //       resolve({urls:JSON.parse(data).data});
    //     },
    //     fail(err){
    //       console.log(err);

    //     }
    //   })
    // })

    // 文件上传的函数，返回一个promise

  },
  uploadError(e) {
    console.log('upload error', e.detail)
  },
  uploadSuccess(e) {

  },
  deleteImg(e) {
    const { detail: { index } } = e;
    const { showImage } = this.data;
    showImage.splice(index, 1);

    this.setData({
      showImage
    })
  },
  change(e) {
    console.log('current index has changed', e.detail)
},
delete(e) {
    console.log('delete', e.detail)
    const {detail:{index}} = e;
    const {files} = this.data;
    files.splice(index,1);
    this.setData({
      files
    })
},
hide() {
  this.setData({
    show: false
})
},
  onShareAppMessage(){
    
  }
});
