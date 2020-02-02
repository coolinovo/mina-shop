// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    // 被收藏数量
    collectNums: 0
  },
  onShow() {
    const userInfo = wx.getStorageSync('userInfo')
    const collect = wx.getStorageSync('collect') || []
    this.setData({
      userInfo,
      collectNums: collect.length
    })
  },
  //handleLogin
  handleLogin() {
    wx.navigateTo({
      url: '/pages/login/index'
    })
  }
})