import {
  request
} from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'
// pages/goods_list/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        id: 0,
        value: '综合',
        isActive: true
      },
      {
        id: 1,
        value: '销量',
        isActive: false
      },
      {
        id: 2,
        value: '价格',
        isActive: false
      }
    ],
    goodsList: []
  },
  // 接口数据
  QueryParams: {
    query: '',
    cid: '',
    pagenum: 1,
    pagesize: 10
  },
  // 总页数
  totalPages: 1,

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log(options)
    this.QueryParams.cid = options.cid||''
    this.QueryParams.query = options.query||''
    this.getGoodsList()
    // wx.showLoading({
    //   title: '加载中'
    // })
    // setTimeout(() => {
    //   wx.hideLoading()
    // }, 1000)
  },
  // 获取商品列表数据
  async getGoodsList() {
    const res = await request({
      url: '/goods/search',
      data: this.QueryParams
    })
    console.log(res)
    // 获取总条数
    const total = res.total
    // 计算总页数
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize)
    console.log(this.totalPages)
    this.setData({
      // 拼接数组
      goodsList: [...this.data.goodsList, ...res.goods]
    })
    // 关闭下拉刷新的窗口
    wx.stopPullDownRefresh()
  },
  // 标题点击事件，子组件传递的
  handleTabsItemChange(e) {
    // console.log(e)
    // 获取被点击的标题索引
    console.log(e)
    const {
      index
    } = e.detail
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
  // 页面上滑 滚动条触底
  onReachBottom() {
    // 判断有没有下一页数据
    if (this.QueryParams.pagenum >= this.totalPages) {
      // 没有
      // console.log('null')
      wx.showToast({
        title: '没有更多的数据了'
      })
    } else {
      // 有
      this.QueryParams.pagenum++
      this.getGoodsList()
    }
  },
  // 下拉刷新
  onPullDownRefresh() {
    // console.log('111')
    this.setData({
      // 重置数组
      goodsList: []
    })
    // 重置页码
    this.QueryParams.pagenum = 1
    // 重新请求
    this.getGoodsList()
  }
})