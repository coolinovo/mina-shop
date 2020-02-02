import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast,
  requestPayment
} from '../../utils/asyncWx'
import regeneratorRuntime from '../../lib/runtime/runtime'
import {
  request
} from '../../request/index.js'
// pages/cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 获取缓存中的收货地址信息
    const address = wx.getStorageSync('address')
    // 获取缓存中的购物车数据
    let cart = wx.getStorageSync('cart') || []
    // 过滤后的购物车数组
    cart = cart.filter(v => v.checked)
    // 计算全选
    // every 会遍历 会接收一个回调，全部返回true 则返回true，有一个false 则停止遍历
    // 空数组调用也返回 true
    // const allChecked = cart.length ? cart.every(v => v.checked) : false
    this.setData({
      address
    })
    // 总价格 总数量
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price
      totalNum += v.num
    })
    // 把购物车重新设置data中和缓存中
    this.setData({
      cart,
      totalNum,
      totalPrice,
      address
    })
  },
  // 支付
  async handleOrderPay() {
    try {
      // 判断缓存中有没有 token
      const token = wx.getStorageSync('token')
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index'
        })
        return
      }
      // 创建订单
      // 请求体参数
      const order_price = this.data.totalPrice
      const consignee_addr = this.data.address.all
      const cart = this.data.cart
      let goods = []
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }))
      const orderParams = {
        order_price,
        consignee_addr,
        goods
      }
      // 发送请求
      const {
        order_number
      } = await request({
        url: '/my/orders/create',
        method: 'post',
        data: orderParams,
      })
      // 发起预支付接口
      const {
        pay
      } = await request({
        url: '/my/orders/req_unifiedorder',
        method: 'post',
        data: {
          order_number
        }
      })
      // 发起支付
      await requestPayment(pay)
      // 查询订单状态
      const res = await request({
        url: '/my/orders/chkOrder',
        method: 'post',
        data: {
          order_number
        }
      })
      await showToast({
        title: '支付成功'
      })
      // 删除缓存支付成功商品
      let newCart = wx.getStorageSync('cart')
      newCart = newCart.filter(v => !v.checked)
      wx.setStorageSync('cart', newCart);
      // 跳转到订单页面
      wx.navigateTo({
        url: '/pages/order/index.'
      })
    } catch (err) {
      await showToast({
        title: '支付失败'
      })
      console.l
    }
  }
})