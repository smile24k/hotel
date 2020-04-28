import constant from "./constant";
export function getArea(cb){
  
  wx.request({
    url: constant.apiUrl + "/web/dictionary/area",
    complete: (res) => {
      
    },
    fail: (res) => {
      wx.showToast({
        title: '查询区域失败',
        icon:'none'
      })
    },
    method: "GET",
    success: (result) => {
      if(cb && typeof cb == "function"){
        cb(result.data);
      }
    },
  })
}

export function getCategory(cb){
  
  wx.request({
    url: constant.apiUrl + '/web/dictionary/publish',
    complete: (res) => {},
    fail: (res) => {},
    method: "GET",
    success: (result) => {
      const {data} = result;

      if(cb && typeof cb === 'function'){
        cb(data)
      }
      
    },
  })
}
export function getAddCategory(cb){
  
  wx.request({
    url: constant.apiUrl + '/web/dictionary/publish_add',
    complete: (res) => {},
    fail: (res) => {},
    method: "GET",
    success: (result) => {
      const {data} = result;

      if(cb && typeof cb === 'function'){
        cb(data)
      }
      
    },
  })
}



export function preview(images,index){
  wx.previewImage({
    urls: images,
    complete: (res) => {},
    current: images[index],
    fail: (res) => {},
    success: (res) => {},
  })
}


export function batchUpload(params, callBack, successFn){
  if (!params.uploadUrl) {
    console.log('请传入上传地址')
    return
  }
  if (!(params.imgPaths instanceof Array)) {
    console.log('请传入array类型')
    return
  } // 校验传入是否为数组
  let maxLength = params.imgPaths.length // 传入数组长度
  let i = params.subscript ? params.subscript : 0 // 当前上传图片下标
  let successNum = params.successNum ? params.successNum : 0 // 上传成功数
  let failNum = params.failNum ? params.failNum : 0 // 上传失败数
  let resultData = params.resultData ? params.resultData : [] //  上传返回的imgUrl
  let endData = {} // 成功回调暴露出去的结果
  wx.uploadFile({
    url: params.uploadUrl,
    filePath: params.imgPaths[i],
    name: 'file',
    headers: {
      "Content-Type": "multipart/form-data"
    },
    formData: {
      // 其它参数
    },
    success(res) { // 返回code为指定结果表示上传成功反之上传失败
      if (res.statusCode == 200) {
        let data = JSON.parse(res.data);
        console.error(data)
        successNum++
        // resultData.push({ url: data.data[0], loading: false, error: false })
        resultData.push(data.data[0])
      } else {
        failNum++
      }
    },
    fail(res) {
      failNum++
    },
    complete() {
      i++
      if (i == maxLength) { // 上传完毕调用成功回调暴露指定数据出去
        endData = {
          imgPaths: resultData,
          successNum: successNum,
          failNum: failNum,
        }
        successFn(endData)
      } else { // 执行下一张上传
        params.subscript = i
        params.successNum = successNum
        params.failNum = failNum
        params.resultData = resultData
        // console.log(_that,'_that')
        callBack(params, callBack, successFn)
      }
    }
  })
}