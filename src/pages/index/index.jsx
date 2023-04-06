import { useState, useEffect } from "react";
import { View } from "@tarojs/components";
import "./index.scss";
import FlightIndex from "../flight";
import NoExploit from "../../components/NoExploit";





const DEFAULT_TAB_LIST = [
  { title: "机票", tab: "flight", index: 0 },
  { title: "火车票", tab: "train", index: 1 },
  { title: "酒店", tab: "hotel", index: 2 },
  { title: "汽车票", tab: "bus", index: 3 },
];

const Index = () => {
  /* tab */
  // Tab 数据
  const [tabIndex, setTabIndex] = useState(0);
  const [innerStyle, setInnerStyle] = useState({
    width: `${100 / DEFAULT_TAB_LIST.length}%`,
    transform: `translateX(${tabIndex * 100}%)`,
  });
  // 偏移量
  useEffect(() => {
    setInnerStyle({
      width: `${100 / DEFAULT_TAB_LIST.length}%`,
      transform: `translateX(${tabIndex * 100}%)`,
    });
  }, [tabIndex]);

  // 切换tab
  const switchTab = (index) => {
    setTabIndex(index);
  };
  /* tab */

  return (
    <View className='index-container'>
      <View className='top'>
        <View className='index-tab'>
          {DEFAULT_TAB_LIST.map((item) => (
            <View
              key={item.tab}
              className={`index_tab_item ${item.tab} ${
                tabIndex === item.index ? "current" : ""
              }`}
              onClick={() => switchTab(item.index)}
            >
              {item.title}
            </View>
          ))}
        </View>
        <View className='scrollbar' style={innerStyle}></View>
      </View>
      {DEFAULT_TAB_LIST[tabIndex]["tab"] === "flight" ? (
        <FlightIndex />
      ) : (
        <>
          <NoExploit />
        </>
      )}
    </View>
  );
};
export default Index;
