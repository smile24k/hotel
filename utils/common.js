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



export function preview(images,index){
  wx.previewImage({
    urls: images,
    complete: (res) => {},
    current: images[index],
    fail: (res) => {},
    success: (res) => {},
  })
}
