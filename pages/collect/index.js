// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        id: 0,
        value: '商品收藏',
        isActive: true
      },
      {
        id: 1,
        value: '品牌收藏',
        isActive: false
      },
      {
        id: 2,
        value: '店铺收藏',
        isActive: false
      },
      {
        id: 3,
        value: '浏览足迹',
        isActive: false
      }
    ],
    collect: []
  },
  // 获取缓存数据
  onShow() {
    const collect = wx.getStorageSync('collect') || []
    this.setData({
      collect
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
  }
})