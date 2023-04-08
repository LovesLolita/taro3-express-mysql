import { useCallback, useEffect, useState } from "react";
import {
  View,
  SwiperItem,
  Swiper,
  Image,
  Text,
  Button,
} from "@tarojs/components";
import { connect } from "react-redux";
import Taro from "@tarojs/taro";
import dayjs from "dayjs";
import Tab from "@/components/Tab";
import NoExploit from "@/components/NoExploit";
import { adsReq } from "@/common/api";
import { sleep } from '@/common/utils'
import CalendarView from "@/pages/flight/index/Calendar/Calendar";
import tools from "@/common/tools";

import "./index.scss";

const mapStateToProps = (state) => {
  return {
    flightIndex: state.flightIndex,
  };
};

const FLIGHT_TABS = [
  {
    label: "单程",
    id: 0,
  },
  {
    label: "多程",
    id: 1,
  },
  {
    label: "往返",
    id: 2,
  },
];

const FlightIndex = (props) => {
  // 点击 tab页
  const handleTabClick = (id) => {
    id;
  };

  /* 城市选择 */
  const [isExchange, setIsExchange] = useState(false)
  // 切换城市
  const chooseFlightCity = (type) => {
    props.dispatch({
      type: "flightIndex/updateState",
      payload: {
        cityType: type,
      },
    });
    // 跳转
    Taro.navigateTo({
      url: "/pages/airportList/airportList",
    });
  };

  // 城市反转
  const exchangeCity = async() => {
    const {
      dptCityName,
      dptCityId,
      arrCityId,
      arrCityName,
      dptAirportName,
      arrAirportName,
    } = props.flightIndex;
    const exchangeObj = {
      dptCityName: arrCityName,
      dptCityId: arrCityId,
      arrCityName: dptCityName,
      arrCityId: dptCityId,
      dptAirportName: arrAirportName,
      arrAirportName: dptAirportName,
    };
    setIsExchange(true)
    props.dispatch({
      type: "flightIndex/updateState",
      payload: exchangeObj,
    });
    await sleep(500);
    setIsExchange(false)
    props.dispatch({
      type: "flightIndex/updateState",
      payload: exchangeObj,
    });
  }

  // 城市选择搜寻
  const onLinkToList = () => {
    const {
      arrCityName,
      arrCityId,
      arrAirportName,
      dptCityId,
      dptCityName,
      dptAirportName,
      dptDate,
    } = props.flightIndex;
    tools.navigateTo({
      url: '/pages/flight/list/list',
      data: {
        arrCityName,
        arrCityId,
        arrAirportName,
        dptCityId,
        dptCityName,
        dptAirportName,
        dptDate,
      }
    })
  }


  /* 城市选择end */

  /* 日历 */
  const [isVisible, setIsVisible] = useState(false);
  const openSwitchCalendar = () => {
    setIsVisible(true);
  };
  const switchCalendar = (flag) => {
    setIsVisible(flag);
  };
  /* /日历 */

  /* 逆地址解析 */
  //  微信小程序需要申请接口权限开通

  useEffect(() => {
    getLocationInfo
    // tools.showToast("位置获取失败~");
  }, []);

  // 获取经纬度
  const getLocationInfo = async () => {
    try {
      const  { latitude, longitude } = await Taro.getLocation({
        type: "gcj02",
      });
      getCity({ latitude, longitude });
    } catch (err) {
      console.log(err);
      tools.showToast("位置获取失败~");
    }
  };
  // 获取初始城市
  const getCity = ({ latitude, longitude }) => {
    Taro.request({
      url: `https://apis.map.qq.com/ws/geocoder/v1/?key=${"HSDBZ-3PB3H-GFEDV-WHVIB-LPQOZ-H3B4Y"}&location=${latitude},${longitude}`,
    })
      .then((res) => {
        const { data } = res;
        const cityInfo = data?.result?.ad_info || {};
        props.dispatch({
          type: "flightIndex/updateState",
          payload: {
            dptCityId: cityInfo.city_code || 2,
            dptCityName: cityInfo.city || "上海",
          },
        });
      })
      .catch(() => {
        tools.showToast("位置获取失败~");
      });
  };

  /* 逆地址解析end */

  /* ad  */

  const [adList, setAdList] = useState([]);

  // 获取ad 图
  const getAds = useCallback(() => {
    adsReq().then((res) => {
      const { result } = res;
      setAdList(result || []);
    });
  }, []);
  useEffect(() => {
    getAds();
  }, [getAds]);
  /* /ad */

  return (
    <>
      <View className='flight-container'>
        <View className='flight-top'>
          <Tab
            tabList={FLIGHT_TABS}
            onTabClick={handleTabClick}
            className='flight-index-tab'
          >
            <SwiperItem>
              <View className='item station'>
                <View
                  className={`cell from ${isExchange ? "slide" : ""}`}
                  onClick={() => chooseFlightCity("depart")}
                >
                  {props.flightIndex.dptCityName}
                </View>
                <Text
                  onClick={exchangeCity}
                  className={`icon-zhihuan iconfont ${isExchange ? "active" : ""}`}
                ></Text>
                <View
                  className={`cell to ${isExchange ? "slide" : ""}`}
                  onClick={() => chooseFlightCity("arrive")}
                >
                  {props.flightIndex.arrCityName}
                </View>
              </View>
              <View className='item date' onClick={openSwitchCalendar}>
                {dayjs(props.flightIndex.dptDate).format("M月D日")}
              </View>
              <Button className='search-btn' onClick={onLinkToList}>
                搜一下吧～
              </Button>
            </SwiperItem>
            {/*  往返  */}
            <SwiperItem>
              <NoExploit className='no-data' />
            </SwiperItem>
            {/*  多程  */}
            <SwiperItem>
              <NoExploit className='no-data' />
            </SwiperItem>
          </Tab>
        </View>
        <View className='alipay-swiper' style={{ margin: "15px" }}>
          <Swiper className='advs-banner-bd' autoplay circular interval={3000}>
            {adList.map((item) => {
              return (
                <SwiperItem key={item.id} className='item'>
                  <Image className='img' src={item.imgUrl}></Image>
                </SwiperItem>
              );
            })}
          </Swiper>
        </View>
      </View>
      <CalendarView isVisible={isVisible} switchCalendar={switchCalendar} />
    </>
  );
};

export default connect(mapStateToProps)(FlightIndex);
