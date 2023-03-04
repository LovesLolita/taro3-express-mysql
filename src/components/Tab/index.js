import { View, Swiper } from "@tarojs/components";
import { useEffect, useState } from "react";

import "./index.scss";


const Tab = (props) => {

  const [currentId, setCurrentId ] = useState(0)
  const [innerStyle, setInnerStyle] = useState({
    width: `${100 / props.tabList?.length}%`,
    transform: `translateX(${currentId * 100}%)`,
  }) 
  useEffect(()=> {
    setInnerStyle({
      width: `${100 / props.tabList?.length}%`,
      transform: `translateX(${currentId * 100}%)`,
    })
  },[props, currentId])

  useEffect(() =>{
    if (props.initTab == undefined) {
      setCurrentId(props.tabList?.[0]?.["id"])
    } else {
      setCurrentId(props.initTab)
    }
  }, [props])



 const  handleClick = (id) => {
    setCurrentId(id)
    props.onTabClick?.(id);
  };
  const handleChange = (e) => {
    const id = e.detail.current;
    setCurrentId(id)
    props.onChange?.(e);
  };


  return (
    <View className={`tab-container ${props.className}`}>
      {/* tab选项卡 */}
      <View className='tab-bar'>
        {props.tabList?.map((item) => {
          return (
            <View
              className={`tab-item ${currentId === item.id ? "active" : ""}`}
              key={item.id}
              onClick={() => handleClick(item.id)}
            >
              {item.label}
            </View>
          );
        })}
        <View className='scroll-bar' style={innerStyle}></View>
      </View>
      {/* 选项卡内容 */}
      <Swiper
        current={currentId}
        className='tab-content'
        onChange={handleChange}
      >
        {props.children}
      </Swiper>
    </View>
  );
};
export default Tab
