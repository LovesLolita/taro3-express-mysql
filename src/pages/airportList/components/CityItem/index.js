import { memo, useEffect } from "react";
import Taro from '@tarojs/taro'
import { connect } from 'react-redux'
import { View, Text } from "@tarojs/components";

import './index.scss';

    // 将 store 中的 state 映射到组件的 props 中
const mapStateToProps = (state) => {
  return {
    flightIndex: state.flightIndex
  };
}


const CityItem = memo((props) => {

  useEffect(()=>{
    console.log(props);
  }, [props])

  const onCityClick = (cityInfo) => {
    const {
      cityId,
      cityName,
      airportName,
    } = cityInfo
    props.dispatch({
      type: 'flightIndex/updateState',
      payload: props.cityType === "depart" ? {
        dptCityId: cityId,
        dptAirportName: airportName,
        dptCityName: cityName
      } : {
        arrCityId: cityId,
        arrAirportName: airportName,
        arrCityName: cityName,
      }
    })
    Taro.navigateBack()
  }
  // render
  return (
    <View className='list-item' id={props.label}>
      <Text className='label'>{props.label}</Text>
      {
        props.cityList?.map(item => {
          return <View key={item.id} className='name' onClick={() => onCityClick(item)}>
            {`${item.cityName}（${item.airportName}）`}
          </View>
        })
      }
    </View>
  )
})


export default connect(mapStateToProps)(CityItem);