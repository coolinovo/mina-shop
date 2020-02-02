// 导入异步请求封装的方法
import {
  request
} from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 轮播图数组
    swiperList: [],
    // 导航数组
    cateList: [],
    // 楼层数据
    floorList: []
  },

  /**
   * 生命周期函数--监听页面加载
   *  页面加载时发送异步请求
   */
  onLoad: function(options) {
    // 获取轮播图数据
    // promise 优化回调地狱
    // wx.request({
    //   url: 'https://api.zbztb.cn/api/public/v1/home/swiperdata',
    //   success: async res => {
    //     // console.log(res)
    //     this.setData({
    //       swiperList: res.data.message
    //     })
    //   }
    // })
    this.getSwiperList()
    this.getCateList()
    this.getFloorList()
  },
  // 获取轮播图数据
  getSwiperList() {
    request({
        url: '/home/swiperdata'
      })
      .then(res => {
        this.setData({
          swiperList: res
        })
      })
  },
  // 获取分类导航数据
  getCateList() {
    request({
      url: '/home/catitems'
    })
      .then(res => {
        this.setData({
          cateList: res
        })
      })
  },
  // 获取楼层数据
  getFloorList() {
    request({
      url: '/home/floordata'
    })
      .then(res => {
        this.setData({
          floorList: res
        })
      })
  }
})