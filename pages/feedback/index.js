// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tabs: [{
        id: 0,
        value: '体验问题',
        isActive: true
      },
      {
        id: 1,
        value: '商品、商家投诉',
        isActive: false
      }
    ],
    // 图片路径
    chooseImgs: [],
    // 文本域内容
    textVal: '',
    UpLoadImg: []
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
  },
  handleChooseImg() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: (result) => {
        console.log(result)
        this.setData({
          // 把图片数组拼接
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        })
      }
    })
  },
  handleRemoveImg(e) {
    const {
      index
    } = e.currentTarget.dataset
    console.log(index)
    // 获取data图片数组
    let {
      chooseImgs
    } = this.data
    // 删除
    chooseImgs.splice(index, 1)
    this.setData({
      chooseImgs
    })
  },
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },
  handleFormSubmit() {
    // 获取文本
    const {
      textVal,
      chooseImgs
    } = this.data
    if (!textVal.trim()) {
      // 不合法
      wx.showToast({
        title: '输入内容不合法',
        icon: 'none',
        mask: true
      })
      return
    }
    wx.showLoading({
      title: '正在上传中',
      mask: true
    })
    // 判断有没有图片
    if (chooseImgs.length !== 0) {
      // 上传图片
      // 不支持多个文件，要遍历数组一个个上
      chooseImgs.forEach((v, i) => {
        wx.uploadFile({
          url: '#',
          filePath: v,
          name: 'flie',
          formData: {},
          success: (result) => {
            let url = JSON.parse(result.data).url
            this.UpLoadImg.push(url)
            if (i === chooseImgs.length - 1) {
              wx.hideLoading()
              this.setData({
                textVal: '',
                chooseImgs: []
              })
              // 返回
              wx.navigateBack({
                delta: 1
              })
            }
          }
        })
      })
    } else {
      wx.hideLoading()
      wx.navigateBack({
        delta: 1
      })
    }


  }
})