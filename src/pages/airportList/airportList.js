import { useCallback, useEffect, useState } from "react";
import { View, ScrollView } from "@tarojs/components";
import { airportCityListReq } from "@/common/api";
import tools from "@/common/tools";
import { ERR_MES } from "@/common/constant";

import CityItem from "./components/CityItem";

import "./airportList.scss";

// export default class Main extends PureComponent {
//   constructor(props) {
//     super(props);
//     this.state = {
//       cityListObj: {}, // 处理之后的城市列表
//       letterList: [], // 字母列表
//       currentLetter: "", // 当前选中的字母
//     };
//   }
//   componentDidMount() {
//     this.getCityList();
//   }
//   getCityList = () => {
//     tools.showLoading();
//     const storageList = tools.getStorageSyncWithTime("flightCityList");
//     if (storageList?.length) {
//       const obj = this.formatList(storageList);
//       this.setState({
//         cityListObj: obj,
//         letterList: Object.keys(obj),
//       });
//       tools.hideLoading();
//       return;
//     }
//     airportCityListReq()
//       .then((res) => {
//         const { result } = res;
//         tools.setStorageSyncWithTime("flightCityList", result, 20);
//         const obj = this.formatList(result);
//         this.setState({
//           cityListObj: obj,
//           letterList: Object.keys(obj),
//         });
//       })
//       .catch(() => {
//         tools.showToast(ERR_MES);
//       })
//       .finally(() => {
//         tools.hideLoading();
//       });
//   };
//   formatList = (list) => {
//     // obj = {
//     //   A: [
//     //     {},
//     //     {}
//     //   ],
//     //   B: [

//     //   ]
//     // }
//     const obj = {};
//     if (list?.length) {
//       list.map((ele) => {
//         const { firstLetter } = ele;
//         // 判断obj中是否有以firstLetter为键的属性
//         if (!obj[firstLetter]) {
//           obj[firstLetter] = [];
//         }
//         obj[firstLetter].push(ele);
//       });
//     }
//     return obj;
//   };
//   onLetterClick = (letter) => {
//     this.setState({
//       currentLetter: letter,
//     });
//   };
//   render() {
//     const { cityListObj, letterList, currentLetter } = this.state;
//   }
// }

const Main = () => {
  /* 城市列表 */
  const [cityListObj, setCityListObj] = useState({});
  const [letterList, setLetterList] = useState([]); // 字母列表
  
  const getCityList = useCallback(() => {
    // tools.showLoading();
    const storageList = tools.getStorageSyncWithTime("flightCityList");
    if (storageList?.length) {
      const obj = formatList(storageList);
      setCityListObj(obj);
      setLetterList(Object.keys(obj));
      tools.hideLoading();
      return;
    }
    airportCityListReq()
      .then((res) => {
        const { result } = res;
        tools.setStorageSyncWithTime("flightCityList", result, 20);
        const obj = formatList(result);
        setCityListObj(obj);
        setLetterList(Object.keys(obj));
      })
      .catch(() => {
        tools.showToast(ERR_MES);
      })
      .finally(() => {
        tools.hideLoading();
      });
  }, []) 
  useEffect(() => {
    getCityList();
  }, [getCityList]);

  //格式处理 

const formatList = (list) => {
  const obj = {};
  if (list?.length) {
    list.map((ele) => {
      const { firstLetter } = ele;
      // 判断obj中是否有以firstLetter为键的属性
      if (!obj[firstLetter]) {
        obj[firstLetter] = [];
      }
      obj[firstLetter].push(ele);
    });
  }
  return obj;
};

 // 选中字母
const [currentLetter, setCurrentLetter] = useState('')
  const onLetterClick = (letter) => {
    setCurrentLetter(letter)
  };

  /* 城市列表 */

 
  return (
    <View className='airport-list-container'>
      <ScrollView
        scrollY
        scrollWithAnimation={tools.isAliPay ? false : true}
        style={{ height: "100vh" }}
        scrollIntoView={currentLetter}
      >
        {letterList?.map((item) => {
          const cityList = cityListObj[item];
          return <CityItem key={item} label={item} cityList={cityList} />;
        })}
      </ScrollView>
      <View className='letter-container'>
        {letterList?.map((item) => (
          <View
            key={item}
            className='letter-item'
            onClick={() => onLetterClick(item)}
          >
            {item}
          </View>
        ))}
      </View>
    </View>
  );
};
export default Main;
