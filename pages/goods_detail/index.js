import {
  request
} from '../../request/index'
import regeneratorRuntime from '../../lib/runtime/runtime'
import {
  showToast
} from '../../utils/asyncWx'
// pages/goods_detail/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsObj: {},
    // 收藏？
    isCollect: false
  },
  // 商品对象
  GoodsInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    let pages = getCurrentPages()
    let currentPage = pages[pages.length - 1]
    let options = currentPage.options
    const {
      goods_id
    } = options
    console.log(options)
    this.getGoodsDetail(goods_id)

  },
  // 获取商品详情数据
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({
      url: '/goods/detail',
      data: {
        goods_id,
      }
    })
    console.log(goodsObj)
    this.GoodsInfo = goodsObj

    // 获取缓存中的商品收藏数组
    let collect = wx.getStorageSync('collect') || []
    // 判断当前商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodsInfo.goods_id)
    // console.log(goodsObj)
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        // iphone 不识别 webp
        // 找到后台修改
        // 前端临时修改 确保后台存在 jpg
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics
      },
      isCollect
    })
  },
  // 预览轮播图
  handlePreviewImage(e) {
    // 构造预览图片数组
    const urls = this.GoodsInfo.pics.map(v => v.pics_mid)
    const current = e.currentTarget.dataset.url
    wx.previewImage({
      current,
      urls,
    })
  },
  // 加入购物车
  handleCartAdd() {
    // 获取缓存中购物车数组
    let cart = wx.getStorageSync('cart') || []
    // 判断商品对象是否存在于购物车数组
    let index = cart.findIndex(v => v.goods_id === this.GoodsInfo.goods_id)
    if (index === -1) {
      // 不存在，第一次添加
      this.GoodsInfo.num = 1
      this.GoodsInfo.checked = true
      cart.push(this.GoodsInfo)
    } else {
      // 存在 num++
      cart[index].num++
    }
    // 把购物车重新加入回缓存
    wx.setStorageSync('cart', cart)
    // 弹窗提示
    wx.showToast({
      title: '加入购物车成功',
      icon: 'success',
      // true 防止用户疯狂点击
      mask: true
    })
  },
  // 点击收藏
  handleCollect() {
    let isCollect = false
    // 获取缓存收藏数组
    let collect = wx.getStorageSync('collect') || []
    // 判断商品是否被选中
    let index = collect.findIndex(v => v.goods_id === this.GoodsInfo.goods_id)
    console.log(2)
    // index !== -1 表示收藏了
    if (index !== -1) {
      collect.splice(index, 1)
      isCollect = false
      wx.showToast({
        title: '取消成功',
        icon: 'success',
        mask: true
      })
    } else {
      collect.push(this.GoodsInfo)
      isCollect = true
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      })
    }
    // 把数组存入缓存
    wx.setStorageSync('collect', collect)
    // 修改data属性
    this.setData({
      isCollect
    })
  }
})