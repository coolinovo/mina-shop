// 同时发送请求的次数
let ajaxTimes = 0
export const request = (params) => {
  // 判断 url 中是否有 /my/  带上 header token
  let header = {...params.header}
  if (params.url.includes('/my/')) {
    // 拼接 header 带上 token
    header['Authorization'] = wx.getStorageSync('token');
  }
  ajaxTimes++
  // 加载动画
  wx.showLoading({
    title: '加载中',
    mask: true
  })
  // 定义公共 url
  const baseUrl = 'https://api.zbztb.cn/api/public/v1'
  return new Promise((resolve, reject) => {
    wx.request({
      ...params,
      header,
      url: baseUrl + params.url,
      success: res => {
        resolve(res.data.message)
      },
      fail: err => {
        reject(err)
      },
      complete: () => {
        ajaxTimes--
        if (ajaxTimes === 0) {
          // 关闭等待图标
          wx.hideLoading()
        }
      }
    })
  })
}