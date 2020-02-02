// pages/order/index.js
import {
  request
} from '../../request/index'
import regeneratorRuntime from '../../lib/runtime/runtime'
Page({
  data: {
    orders: [],
    tabs: [{
        id: 0,
        value: '全部',
        isActive: true
      },
      {
        id: 1,
        value: '待付款',
        isActive: false
      },
      {
        id: 2,
        value: '待发货',
        isActive: false
      },
      {
        id: 3,
        value: '退款/退货',
        isActive: false
      }
    ],
  },
  onShow() {
    const token = wx.getStorageSync('token')
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      })
      return
    }
    // 获取当前小程序页面栈
    let pages = getCurrentPages()
    let currentPage = pages[pages.length - 1]
    // 获取 type 参数
    const {
      type
    } = currentPage.options
    // 激活选中页面
    this.changeTitleByIndex(type - 1)
    this.getOrders(currentPage)
  },
  // 获取订单列表
  async getOrders(type) {
    const res = await request({
      url: '/my/orders/all',
      data: {
        type
      }
    })
    this.setData({
      orders: res.orders.map(v=>({...v, create_time_cn:new Date(v.create_time*1000).toLocaleString()}))
    })
  },
  // 根据标题索引激活
  changeTitleByIndex(index) {
    // 修改源数组
    let {
      tabs
    } = this.data
    tabs.forEach((v, i) => i === index ? v.isActive = true : v.isActive = false)
    // 赋值到 data 中
    this.setData({
      tabs
    })
  },
  // 标题点击事件，子组件传递的
  handleTabsItemChange(e) {
    // console.log(e)
    // 获取被点击的标题索引
    console.log(e)
    const {
      index
    } = e.detail
    this.changeTitleByIndex(index)
    // 重新发送请求
    this.getOrders(index + 1)
  }
})