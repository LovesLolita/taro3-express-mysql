/* eslint-disable */
import { useCallback, useEffect, useState } from "react";
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
import Skeleton from "taro-skeleton";
import { flightListReq } from "@/common/api";
import tools from "@/common/tools";
// import VirtualList from '@/components/VirtualList'

import "taro-skeleton/dist/index.css";

import "./list.scss";

const List = () => {
  /* 切换标题 */
  useEffect(() => {
    const { params } = getCurrentInstance().router;
    const {
      dptCityId,
      dptCityName,
      arrCityId,
      arrCityName,
      dptDate,
      arrAirportName,
      dptAirportName,
    } = params;
    console.log(params);

    // 修改小程序标题
    Taro.setNavigationBarTitle({
      title: `${dptCityName} - ${arrCityName}`,
    });

    // 储存query信息
    setFlightData(() => {
      return {
        dptCityId,
        dptCityName,
        arrCityId,
        arrCityName,
        dptDate,
        arrAirportName,
        dptAirportName,
      };
    });
  }, []);
  /* 切换标题end */

  /* 航班列表 */
  const [flightData, setFlightData] = useState({}); // 航班参数
  const [scrollTop, setScrollTop] = useState("");
  const [flightList, setFlightList] = useState([]); // 航班列表
  const [flightCompanyList, setFlightCompanyList] = useState([]); // 航司列表
  const [initFlightList, setInitFlightList] = useState([]);
  const [dateList, setDateList] = useState([]);
  useEffect(() => {
    setDateList(formatDateList());
  }, []);

  // 获取航班列表
  const getList = () => {
    tools.showLoading();
    setScrollTop({
      scrollTop: "",
    });
    flightListReq({
      ...flightData,
    })
      .then((res) => {
        console.log(res);
        const companyArr = res.result?.map((item) => {
          return item.airCompanyName;
        });
        setFlightList(res.result);
        setFlightCompanyList([...new Set(companyArr)]);
        setScrollTop(0);
        setInitFlightList(res.result);
      })
      .catch(() => {
        tools.showToast(ERR_MES);
      })
      .finally(() => {
        tools.hideLoading();
      });
  };

  // 拿到quey值后请求航空数据
  useEffect(() => {
    // 没有值不请求
    if(Object.keys(flightData).length !== 0){
      getList()
    }
  }, [flightData])

  // 处理列表时间数据
  const formatDateList = () => {
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
  /* 航班列表end */

  /* 切换时间选择 */
  const [curAirCompanyIndex, setCurAirCompanyIndex] = useState(""); // 当前选中的下标

  const onAirCompanyChange = (e) => {
    const { value } = e.detail;
    setCurAirCompanyIndex(value);
    setScrollTop("");
    const res = initFlightList.filter(
      (item) => item.airCompanyName === flightCompanyList[value]
    );
    setFlightList(res);
    setScrollTop(0);
  };
  // 切换时间
  const chooseDate = (date) => {
    setFlightData({
      ...flightData,
      dptDate: date,
    });
    // getList();
  };
  /* 切换时间选择end */

  /**
   * 跳转详情页
   * @{param}
   */
  const onFlightClick = (curFlight) => {
    // tools.navigateTo({
    //   url: "/pages/flight/detail/detail",
    //   data: {
    //     ...curFlight,
    //   },
    // });
  };
  /* 跳转详情页end */

  /*  */
  const handleRender = (flight, index) => {
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
        {index === 3 && (
          <View className='notice'>
            <Image
              className='notice-logo'
              src='https://images3.c-ctrip.com/ztrip/xiaochengxu/shangzhang_zx.png'
            ></Image>
            <Text className='notice-text'>价格可能会上涨，建议尽快预定</Text>
          </View>
        )}
        <View className='list-item' onClick={() => this.onFlightClick(flight)}>
          <View className='item-price'>
            <View className='flight-row'>
              <View className='depart'>
                <Text className='flight-time'>{dptTimeStr}</Text>
                <Text className='airport-name'>{dptAirportName}</Text>
              </View>
              <View className='separator'>
                <View className='spt-arr'></View>
              </View>
              <View className='arrival'>
                <Text className='flight-time'>{arrTimeStr}</Text>
                <Text className='airport-name'>{arrAirportName}</Text>
              </View>
            </View>
            <Text className='flight-price color-red'>¥ {price}</Text>
          </View>
          <View className='air-info'>
            <Image className='logo' src={airIcon} />
            <Text className='company-name'>{airCompanyName}</Text>
          </View>
        </View>
      </Block>
    );
  };
  /*  */

  return (
    <View className='list-container'>
      <View className='calendar-list'>
        <ScrollView
          className='calendar-scroll-list'
          scrollX
          scrollWithAnimation
          scrollIntoView={`date-${flightData.dptDate}`}
        >
          {dateList.map((date) => {
            return (
              <View
                key={date.dateStr}
                className={`item ${
                  date.dateStr === flightData.dptDate ? "cur" : ""
                }`}
                id={`date-${date.dateStr}`}
                onClick={() => chooseDate(date.dateStr)}
              >
                <View className='date'>{date.day}</View>
                <View className='week'>{date.week}</View>
              </View>
            );
          })}
        </ScrollView>
      </View>
      {flightList.length ? (
        <View id='flight-list'>
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
                  {index === 3 && (
                    <View className='notice'>
                      <Image
                        className='notice-logo'
                        src='https://i.postimg.cc/dhGPDTjq/2.png'
                      ></Image>
                      <Text className='notice-text'>
                        价格可能会上涨，建议尽快预定
                      </Text>
                    </View>
                  )}
                  <View
                    className='list-item'
                    onClick={() => onFlightClick(flight)}
                  >
                    <View className='item-price'>
                      <View className='flight-row'>
                        <View className='depart'>
                          <Text className='flight-time'>{dptTimeStr}</Text>
                          <Text className='airport-name'>{dptAirportName}</Text>
                        </View>
                        <View className='separator'>
                          <View className='spt-arr'></View>
                        </View>
                        <View className='arrival'>
                          <Text className='flight-time'>{arrTimeStr}</Text>
                          <Text className='airport-name'>{arrAirportName}</Text>
                        </View>
                      </View>
                      <Text className='flight-price color-red'>¥ {price}</Text>
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
          onChange={onAirCompanyChange}
        >
          筛选
        </Picker>
      </View>
    </View>
  );
};
export default List;
