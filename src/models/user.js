import Taro from '@tarojs/taro'
import tools from '@/common/tools'

const init = () => {
  const userInfo = tools.getStorageSyncWithTime('userInfo')
  return {
    isLogin: !!userInfo?.userPhone, // 是否登录
    userPhone: userInfo?.userPhone,
    nickName: userInfo?.nickName
  }
}
export default {
  namespace: 'user',
  state: {
    ...init()
  },
  reducers: {
    updateState(state, action) {
      return {
        ...state,
        ...action.payload,
      }
    },
    loginOut() {
      return {
        ...init()
      }
    }
  }
}