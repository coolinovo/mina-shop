// pages/search/index.js
import {
  request
} from '../../request/index'
import regeneratorRuntime from '../../lib/runtime/runtime'

Page({
  data: {
    // 保存请求回来的数据
    goods: [],
    // 取消是否显示
    isFocus: false,
    // 输入框的值
    inValue: ''
  },
  // 防抖
  TimeId: -1,
  // 输入框绑定事件
  handleInput(e) {
    const {
      value
    } = e.detail
    // 验证值的合法性
    if (!value.trim()) {
      this.setData({
        goods: [],
        isFocus: false
      })
      return
    }
    this.setData({
      isFocus:true
    })
    clearTimeout(this.TimeId)
    this.TimeId = setTimeout(() => {
      // 发送请求获取数据
      this.qsearch(value)
    }, 1000)
  },
  // 发送请求
  async qsearch(query) {
    const res = await request({
      url: '/goods/qsearch',
      data: {
        query
      }
    })
    console.log(res)
    this.setData({
      goods: res
    })
  },
  // 取消
  // handleCancel() {
  //   this.setData({
  //     inValue: '',
  //     goods: [],
  //     isFocus: false
  //   })
  // }
})