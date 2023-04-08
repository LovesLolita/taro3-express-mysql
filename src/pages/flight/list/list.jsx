import { PureComponent } from "react";
import {
  View,
  ScrollView,
  Text,
  Image,
  Picker,
  Block,
} from "@tarojs/components";
import Taro, { getCurrentInstance } from "@tarojs/taro";
import dayjs from "dayjs";
import { weekDay } from "@/common/utils";
import { MIN_DATE, MAX_DATE, ERR_MES } from "@/common/constant";
import Skeleton from 'taro-skeleton'
import { flightListReq } from "@/common/api";
import tools from "@/common/tools";
// import VirtualList from '@/components/VirtualList'


import 'taro-skeleton/dist/index.css'

import "./list.scss";

export default class List extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      dateList: this.formatDateList(),
      flightData: {}, // 航班参数
      flightList: [], // 航班列表
      flightCompanyList: [], // 航司列表
      curAirCompanyIndex: "", // 当前选中的下标
      scrollTop: "",
    };
    this.initFlightList = [];
  }
  componentDidMount() {
    const { params } = getCurrentInstance().router;
    const {
      dptCityId,
      dptCityName,
      arrCityId,
      arrCityName,
      dptDate,
      arrAirportName,
      dptAirportName,
    } = params
    this.setState({
      flightData: {
        dptCityId,
        dptCityName,
        arrCityId,
        arrCityName,
        dptDate,
        arrAirportName,
        dptAirportName,
      }
    }, this.getList)
    Taro.setNavigationBarTitle({
      title: `${dptCityName} - ${arrCityName}`
    })
  }
  getList = () => {
    const { flightData } = this.state
    tools.showLoading();
    this.setState({
      scrollTop: "",
    })
    flightListReq({
      ...flightData
    })
      .then(res => {
        const companyArr = res.result?.map(item => item.airCompanyName)
        this.setState({
          flightList: res.result,
          flightCompanyList: [...new Set(companyArr)],
          scrollTop: 0,
        })
        this.initFlightList = res.result
      })
      .catch(() => {
        tools.showToast(ERR_MES)
      })
      .finally(() => {
        tools.hideLoading()
      })
  }
  formatDateList = () => {
    let minStr = dayjs(MIN_DATE).valueOf();
    const maxStr = dayjs(MAX_DATE).valueOf();
    const dayStr = 1000 * 60 * 60 * 24; // 一天
    let res = [];
    for (; minStr <= maxStr; minStr += dayStr) {
      res.push({
        dateStr: dayjs(minStr).format("YYYY-MM-DD"),
        day: dayjs(minStr).format("M-DD"),
        week: weekDay(minStr),
      });
    }
    return res;
  };
  onAirCompanyChange = (e) => {
    const { value } = e.detail;
    const { flightCompanyList } = this.state
    this.setState({
      curAirCompanyIndex: value,
      scrollTop: "",
    }, () => {
      const res = this.initFlightList.filter(item => item.airCompanyName === flightCompanyList[value])
      this.setState({
        flightList: res,
        scrollTop: 0,
      })
    })
  }
  chooseDate = (date) => {
    this.setState({
      flightData: {
        ...this.state.flightData,
        dptDate: date,
      }
    }, this.getList)
  }
  /**
   * 跳转详情页
   * @{param}	 
   */
  onFlightClick = (curFlight) => {
    tools.navigateTo({
      url: '/pages/flight/detail/detail',
      data: {
        ...curFlight
      }
    })
  }
  handleRender = (flight, index) => {
    const {
      dptAirportName,
      dptTimeStr,
      arrTimeStr,
      arrAirportName,
      airIcon,
      airCompanyName,
      price,
    } = flight;
    return (
      <Block key={flight.id}>
        {
          index === 3 && (
            <View className='notice'>
              <Image className='notice-logo' src='https://images3.c-ctrip.com/ztrip/xiaochengxu/shangzhang_zx.png'></Image>
              <Text className='notice-text'>价格可能会上涨，建议尽快预定</Text>
            </View>  
          )
        }
        <View
          className='list-item'
          onClick={() => this.onFlightClick(flight)}
        >
          <View className='item-price'>
            <View className='flight-row'>
              <View className='depart'>
                <Text className='flight-time'>{dptTimeStr}</Text>
                <Text className='airport-name'>
                  {dptAirportName}
                </Text>
              </View>
              <View className='separator'>
                <View className='spt-arr'></View>
              </View>
              <View className='arrival'>
                <Text className='flight-time'>{arrTimeStr}</Text>
                <Text className='airport-name'>
                  {arrAirportName}
                </Text>
              </View>
            </View>
            <Text className='flight-price color-red'>
                          ¥ {price}
            </Text>
          </View>
          <View className='air-info'>
            <Image className='logo' src={airIcon} />
            <Text className='company-name'>{airCompanyName}</Text>
          </View>
        </View>
      </Block>
    )
    
  }
  render() {
    const {
      dateList,
      flightData,
      flightList,
      flightCompanyList,
      curAirCompanyIndex,
      scrollTop
    } = this.state;
    const { dptDate } = flightData
    return (
      <View className='list-container'>
        <View className='calendar-list'>
          <ScrollView
            className='calendar-scroll-list'
            scrollX
            scrollWithAnimation
            scrollIntoView={`date-${dptDate}`}
          >
            {dateList.map((date) => {
              return (
                <View
                  key={date.dateStr}
                  className={`item ${
                    date.dateStr === dptDate ? "cur" : ""
                  }`}
                  id={`date-${date.dateStr}`}
                  onClick={() => this.chooseDate(date.dateStr)}
                >
                  <View className='date'>{date.day}</View>
                  <View className='week'>{date.week}</View>
                </View>
              );
            })}
          </ScrollView>
        </View>
        {flightList.length ? (
          <View
            id='flight-list'
          >
            {/* 性能优化篇：虚拟列表 */}
            {/* <VirtualList className="flight-scroll-list" list={flightList} onRender={this.handleRender}></VirtualList> */}
            <ScrollView
              className='flight-scroll-list'
              scrollY
              scrollTop={scrollTop}
            >
              {flightList?.map((flight, index) => {
                const {
                  dptAirportName,
                  dptTimeStr,
                  arrTimeStr,
                  arrAirportName,
                  airIcon,
                  airCompanyName,
                  price,
                } = flight;
                return (
                  <Block key={flight.id}>
                    {
                      index === 3 && (
                        <View className='notice'>
                          <Image className='notice-logo' src='https://i.postimg.cc/dhGPDTjq/2.png'></Image>
                          <Text className='notice-text'>价格可能会上涨，建议尽快预定</Text>
                        </View>  
                      )
                    }
                    <View
                      className='list-item'
                      onClick={() => this.onFlightClick(flight)}
                    >
                      <View className='item-price'>
                        <View className='flight-row'>
                          <View className='depart'>
                            <Text className='flight-time'>{dptTimeStr}</Text>
                            <Text className='airport-name'>
                              {dptAirportName}
                            </Text>
                          </View>
                          <View className='separator'>
                            <View className='spt-arr'></View>
                          </View>
                          <View className='arrival'>
                            <Text className='flight-time'>{arrTimeStr}</Text>
                            <Text className='airport-name'>
                              {arrAirportName}
                            </Text>
                          </View>
                        </View>
                        <Text className='flight-price color-red'>
                          ¥ {price}
                        </Text>
                      </View>
                      <View className='air-info'>
                        <Image className='logo' src={airIcon} />
                        <Text className='company-name'>{airCompanyName}</Text>
                      </View>
                    </View>
                  </Block>
                );
              })}
            </ScrollView>
          </View>
        ) : (
          <View className='skeleton-box'>
            {Array(7)
              .fill(0)
              .map((item, index) => {
                return <Skeleton key={index} row={3} action rowHeight={34} />;
              })}
          </View>
        )}
        <View className={`flilter-btn ${flightList?.length ? "" : "hidden"}`}>
          <Picker
            range={flightCompanyList}
            value={curAirCompanyIndex}
            onChange={this.onAirCompanyChange}
          >
            筛选
          </Picker>
        </View>
      </View>
    )
  }
}