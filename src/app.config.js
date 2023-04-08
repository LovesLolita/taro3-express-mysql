// eslint-disable-next-line no-undef
export default defineAppConfig({
  pages: [
    'pages/index/index',
    'pages/order/order',
    'pages/airportList/airportList',
  ],
  subPackages: [
    {
      root: "pages/flight",
      pages: [
        "list/list",
      ]
    },
  ],
  window: {
    backgroundTextStyle: 'light',
    navigationBarBackgroundColor: '#fff',
    navigationBarTitleText: '阿骁',
    navigationBarTextStyle: 'black'
  },
  tabBar: {
    color: '#7FB389',
    selectedColor: '#07c160',
    borderStyle: 'black',
    backgroundColor: '#fff',
    list: [
      {
        pagePath: 'pages/index/index',
        iconPath: 'assets/images/index-unselected.png',
        selectedIconPath: 'assets/images/index-selected.png',
        text: '首页',
      },
      {
        pagePath: 'pages/order/order',
        iconPath: 'assets/images/order-unselected.png',
        selectedIconPath: 'assets/images/order-selected.png',
        text: '我的订单',
      }
    ]
  },
  "permission": {
    "scope.userLocation": {
      "desc": "为了更好的服务体验，我们希望获取你的位置"
    }
  }
})
