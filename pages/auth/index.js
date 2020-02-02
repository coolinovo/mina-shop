// pages/auth/index.js
import {
  request
} from '../../request/index.js'
import regeneratorRuntime from '../../lib/runtime/runtime.js'
import {
  login
} from '../../utils/asyncWx'

Page({
  async handleGetUserInfo(e) {
    try {
      // 获取用户信息
      const {
        encryptedData,
        rawData,
        iv,
        signature
      } = e.detail
      // 获取小程序登录成功 code
      console.log(e.detail)
      const {
        code
      } = await login()
      console.log(code)
      const loginParams = {
        encryptedData,
        rawData,
        iv,
        signature
      }
      // 发送请求获取 token
      const {token} = await request({
        url: '/users/wxlogin',
        data: loginParams,
        method: 'post'
      })
      // console.log(res)
      // 把 token 存储到缓存同时跳转上一个页面
      wx.setStorageSync('token', token)
      wx.navigateBack({
        delta: 1
      })
    } catch (err) {
      console.log(err)
    }
  }
})