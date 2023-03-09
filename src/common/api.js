import tools from '@/common/tools'

const API_PRE ="http://127.0.0.1:30000"

export const adsReq = (data) => tools.request({
  url: `${API_PRE}/ads/advertising`,
  params: data,
})

// 城市列表
export const airportCityListReq = (data) => tools.request({
  url: `${API_PRE}/city/airportList`,
  params: data,
})