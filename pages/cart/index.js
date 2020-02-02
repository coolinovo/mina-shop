import {
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast
} from '../../utils/asyncWx'
import regeneratorRuntime from '../../lib/runtime/runtime'
// pages/cart/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    // 获取缓存中的收货地址信息
    const address = wx.getStorageSync('address')
    // 获取缓存中的购物车数据
    const cart = wx.getStorageSync('cart') || []
    // 计算全选
    // every 会遍历 会接收一个回调，全部返回true 则返回true，有一个false 则停止遍历
    // 空数组调用也返回 true
    // const allChecked = cart.length ? cart.every(v => v.checked) : false
    this.setData({
      address
    })
    this.setCart(cart)
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  // 收获按钮事件
  async handleChooseAddress() {
    try {
      // 获取收获地址
      // wx.chooseAddress({
      //   success: res => {

      //   }
      // })
      // wx.getSetting({
      //   success: (result) => {
      //     // 获取权限状态
      //     const scopeAddress = result.authSetting["scope.address"]
      //     console.log(result.authSetting)
      //     if (scopeAddress === true || scopeAddress === undefined) {
      //       console.log('if')
      //       wx.chooseAddress({
      //         success: res => {
      //           console.log(res)
      //         }
      //       })
      //     } else {
      //       console.log('else')
      //       // 用户曾经拒绝过授权，诱导用户打开授权页面
      //       wx.openSetting({
      //         success: res2 => {
      //           // 调用收货地址代码
      //           wx.chooseAddress({
      //             success: res => {
      //               console.log(res)
      //             }
      //           })
      //         }
      //       })
      //     }
      //   }
      // })
      // 获取 权限状态
      const res1 = await getSetting()
      const scopeAddress = res1.authSetting["scope.address"]
      // 判断状态
      if (scopeAddress === false) {
        // 诱导打开授权
        await openSetting()
      }
      // 调用获取收获地址 api
      const address = await chooseAddress()
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo
      // 把地址存入缓存
      wx.setStorageSync('address', address)
    } catch (err) {
      console.log(err)
    }
  },
  // 商品选中
  handleItemChange(e) {
    // 获取被修改的商品 id
    const goods_id = e.currentTarget.dataset.id
    // 获取购物车数组
    let {
      cart
    } = this.data
    // 找到被修改的商品
    let index = cart.findIndex(v => v.goods_id === goods_id)
    console.log(cart[index])
    // 选中状态取反
    cart[index].checked = !cart[index].checked
    this.setCart(cart)
  },
  // 设置购物车状态，重新计算数据
  setCart(cart) {
    let allChecked = true
    // 总价格 总数量
    let totalPrice = 0
    let totalNum = 0
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price
        totalNum += v.num
      } else {
        allChecked = false
      }
    })
    // 判断 cart 空
    allChecked = cart.length !== 0 ? allChecked : false
    // 把购物车重新设置data中和缓存中
    this.setData({
      cart,
      totalNum,
      totalPrice,
      allChecked
    })
    wx.setStorageSync('cart', cart)
  },
  // 全选
  handleItemAllCheck() {
    let {
      cart,
      allChecked
    } = this.data
    allChecked = !allChecked
    cart.forEach(v => v.checked = allChecked)
    this.setCart(cart)
  },
  // 商品数量编辑
  async handleItemNumEdit(e) {
    // 操作符 goods_id
    const {
      operation,
      id
    } = e.currentTarget.dataset
    // 获取购物车数组
    let {
      cart
    } = this.data
    // 找到需要修改的商品索引
    const index = cart.findIndex(v => v.goods_id === id)
    // 判断是否为 1
    if (cart[index].num === 1 && operation === -1) {
      // 弹窗
      const res = await showModal({
        content: '是否删除该商品？'
      })
      if (res.confirm) {
        cart.splice(index, 1)
        this.setCart(cart)
      }
    } else {
      // 修改数量
      cart[index].num += operation
      // 设置回缓存和data
      this.setCart(cart)
    }
  },
  // 结算功能
  async handlePay() {
    // 判断是否有收获地址
    const {
      address,
      totalNum
    } = this.data
    if (!address.userName) {
      await showToast({
        title: '你还没有选择收货地址'
      })
      return
    }
    // 判断用户有没有加入商品
    if (totalNum === 0) {
      await showToast({
        title: '你还没有选购商品'
      })
      return
    }
    // 支付
    wx.navigateTo({
      url: '/pages/pay/index'
    })
  }
})