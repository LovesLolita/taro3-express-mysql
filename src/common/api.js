import tools from '@/common/tools'

const API_PRE ="http://127.0.0.1:30000"

export const adsReq = (data) => tools.request({
  url: `${API_PRE}/ads/advertising`,
  params: data,
})