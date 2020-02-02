// pages/category/index.js
import {
  request
} from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 左侧菜单数据
    leftMenu: [],
    // 右侧商品数据
    rightContent: [],
    // 被点击的索引
    currentIndex: 0,
    // 右侧滚动条顶部距离
    scrollTop: 0
  },
  // 接口返回数据
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /* 
      判断本地有没有旧数据
        {time:Date.now(), data:[...]}
        没有 直接发送新请求
        有 并且旧数据没有过期 直接使用本地数据
    */
    // 获取本地数据
    const Cates = wx.getStorageSync('cates')
    // 判断
    if (!Cates) {
      // 不存在，请求新数据
      this.getCate()
    } else {
      // 存在，判断过期
      if (Date.now() - Cates.time > 1000 * 100) {
        // 重新发送请求
        this.getCate()
      } else {
        // 使用旧的
        this.Cates = Cates.data
        // 构造左侧数据
        let leftMenu = this.Cates.map(v => v.cat_name)
        // 构造右侧数据
        let rightContent = this.Cates[0].children
        this.setData({
          leftMenu,
          rightContent
        })
      }
    }
  },
  // 获取分类数据
  async getCate() {
    // request({
    //     url: '/categories'
    //   })
    //   .then(res => {
    //     // console.log(res)
    //     this.Cates = res.data.message
    //     // 把数据存到本地
    //     wx.setStorageSync('cates', {
    //       time: Date.now(),
    //       data: this.Cates
    //     })
    //     // 构造左侧数据
    //     let leftMenu = this.Cates.map(v => v.cat_name)
    //     // 构造右侧数据
    //     let rightContent = this.Cates[0].children
    //     this.setData({
    //       leftMenu,
    //       rightContent
    //     })
    //   })
    // es7 异步
    const res = await request({
      url: '/categories'
    })
    // this.Cates = res.data.message
    console.log(res)
    this.Cates = res
    // 把数据存到本地
    wx.setStorageSync('cates', {
      time: Date.now(),
      data: this.Cates
    })
    // 构造左侧数据
    let leftMenu = this.Cates.map(v => v.cat_name)
    // 构造右侧数据
    let rightContent = this.Cates[0].children
    this.setData({
      leftMenu,
      rightContent
    })
  },
  // 左侧菜单点击事件
  handleItemTap(e) {
    // 获取被点击的标题索引
    // 给 data 中的 currentIndex 赋值
    // 根据索引渲染内容
    const {
      index
    } = e.currentTarget.dataset
    // 构造右侧数据
    let rightContent = this.Cates[index].children
    this.setData({
      currentIndex: index,
      rightContent,
      // 重新设置右侧滚动条
      scrollTop: 0
    })
  }
})