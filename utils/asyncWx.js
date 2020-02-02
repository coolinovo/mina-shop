// promise 形式的 getSetting
export const getSetting = () => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// promise 形式的 chooseAddress
export const chooseAddress = () => {
  return new Promise((resolve, reject) => {
    wx.chooseAddress({
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// promise 形式的 chooseAddress
export const openSetting = () => {
  return new Promise((resolve, reject) => {
    wx.openSetting({
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// promise 模态框
export const showModal = ({
  content
}) => {
  return new Promise((resolve, reject) => {
    // 弹窗提示
    wx.showModal({
      title: '提示',
      content,
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        resolve(result)
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

// promise 提示框
// promise 模态框
export const showToast = (
  content
) => {
  return new Promise((resolve, reject) => {
    // 弹窗提示
    wx.showToast({
      // title,
      // icon,
      // mask,
      ...content,
      duration: 1500
    })
  })
}

// login
export const login = () => {
  return new Promise((resolve, reject) => {
    // 弹窗提示
    wx.login({
      timeout: 10000,
      success: (result) => {
        resolve(result)
      },
      fail: err => reject(err)
    })
  })
}

// pay
export const requestPayment = (pay) => {
  return new Promise((resolve,reject) => {
    wx.requestPayment({
      ...pay,
      success: (result)=>{
        resolve(result)
      },
      fail: (err)=>{
        reject(err)
      }
    })
  })
}