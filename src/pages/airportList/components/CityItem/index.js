import { PureComponent } from "react";
import Taro from '@tarojs/taro'
// import { connect } from 'react-redux'
import { View, Text } from "@tarojs/components";

import './index.scss';

// @connect(({flightIndex}) => ({
//   ...flightIndex
// }))

const CityItem = (props) => {
  const onCityClick = (cityInfo) => {
    const { cityType } = this.props
    const {
      cityId,
      cityName,
      airportName,
    } = cityInfo
    this.props.dispatch({
      type: 'flightIndex/updateState',
      payload: cityType === "depart" ? {
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
}

export default CityItem