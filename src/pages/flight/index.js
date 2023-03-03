import { View,SwiperItem } from "@tarojs/components";
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

  const handleTabClick = (id) => {
    console.log(id);
  }

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
    </View>
  );
};

export default FlightIndex;
