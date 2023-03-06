import { useEffect, useState } from "react";
import { View,SwiperItem, Swiper, Image, Text, Button } from "@tarojs/components";
import Tab from "@/components/Tab";
import NoExploit from '@/components/NoExploit'
import { adsReq } from '@/common/api'
import dayjs from 'dayjs'

import "./index.scss";


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

const FlightIndex = () => {

  // 点击 tab页
  const handleTabClick = (id) => {
    id
  }
  
  /* ad  */

  const [adList, setAdList] = useState([])

  // 获取ad 图
  const getAds = () => {
    adsReq().then((res) => {
      const { result } = res
      setAdList(result || [])
    })
  }
  useEffect(() =>{
    getAds()
  }, [])
  /* /ad */

  return (
    <View className='flight-container'>
      <View className='flight-top'>
        <Tab  tabList={FLIGHT_TABS} onTabClick={handleTabClick} className='flight-index-tab'>
        <SwiperItem>
        <View className='item station'>
                <View
                  className={`cell from ${false ? "slide" : ""}`}
                  onClick={() => {}}
                >
                  上海
                </View>
                <Text
                  onClick={()=>{}}
                  className={`icon-zhihuan iconfont ${
                    true ? "active" : ""
                  }`}
                ></Text>
                <View
                  className={`cell to ${false ? "slide" : ""}`}
                  onClick={() => {}}
                >
                  上海
                </View>
              </View>
              <View className='item date' onClick={()=>{}}>
                {dayjs(new Date()).format("M月D日")}
              </View>
              <Button className='search-btn' onClick={()=>{}}>
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
      <View className='alipay-swiper' style={{margin: '15px'}}>
          <Swiper className='advs-banner-bd' autoplay circular interval={3000}>
            {
              adList.map(item => {
                return (
                  <SwiperItem key={item.id} className='item'>
                    <Image className='img' src={item.imgUrl}></Image>
                  </SwiperItem>
                )
              })
            }
          </Swiper>
        </View>
    </View>
  );
};

export default FlightIndex;
