import { useState } from "react";
import { View,SwiperItem, Swiper, Image } from "@tarojs/components";
import Tab from "@/components/Tab";
import NoExploit from '@/components/NoExploit'

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
    
  }

  /* ad  */

  // eslint-disable-next-line no-unused-vars
  const [adList, setAdList] = useState([])
  /* /ad */

  return (
    <View className='flight-container'>
      <View className='flight-top'>
        <Tab  tabList={FLIGHT_TABS} onTabClick={handleTabClick} className='flight-index-tab'>
        <SwiperItem>
        <View className='item station'>
          1234
        </View>
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
