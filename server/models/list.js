const express = require("express");
const router = express.Router();
const sqlQuery = require("../mysql");
const dayjs = require("dayjs");
const request = require("request");

/**
 * 得到一个两数之间的随机整数
 */
const randomPrice = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min)) + min; //不含最大值，含最小值
};

// 创建机场飞行mysql
// request(
//   "https://www.brown77.cn/city/airportList",
//   { json: true },
//   async (err, res, body) => {
//     const strSql1 = `
//     create table flight_list(
//       id int not null auto_increment,
//       cityName char(50) not null,
//       cityId int not null,
//       firstLetter char(50) not null,
//       airportName char(50) not null,
//       airCompanyName char(50) not null,
//       airIcon char(50) not null,
//       dptTime char(50) not null,
//       arrTime char(50) not null,
//       primary key (id)
//     ) engine=innodb;
//   `;
//     // 删除表
//     await sqlQuery(`drop table if exists flight_list`);
//     await sqlQuery(strSql1);
//     let hk = [
//       "东方航空",
//       "中国南方航空",
//       "海南航空",
//       "深圳航空",
//       "上海航空",
//       "厦门航空",
//       "四川航空",
//       "山东航空",
//       "春秋航空",
//       "英国航空",
//     ];
//     const timeArray = []
//           let hour = 1 // 早上6点开始
//           let minute = 0
//           for (let i = 0; i < 281; i++) {
//             let hourStr = hour < 10 ? '0' + hour : hour
//             let minuteStr = minute < 10 ? '0' + minute : minute
//             timeArray.push(`${hourStr}:${minuteStr}`)
//             minute += 30 // 每30分钟递增
//             if (minute >= 60) {
//               hour++
//               minute = 0
//             }
//           }
//           console.log(timeArray,321);
//           const timeArray1 = []
//           let hour1 =3 // 早上6点开始
//           let minute1 = 0
//           for (let i = 0; i < 281; i++) {
//             let hourStr = hour1 < 10 ? '0' + hour1 : hour1
//             let minuteStr = minute1 < 10 ? '0' + minute1 : minute1
//             timeArray1.push(`${hourStr}:${minuteStr}`)
//             minute1 += 30 // 每30分钟递增
//             if (minute1 >= 60) {
//               hour1++
//               minute1 = 0
//             }
//           }
//           console.log(timeArray1,1234);
//     for (let i = 0; i < body.result.length; i++) {
//       const { cityId, cityName, firstLetter, airportName } = body.result[i];
//       const airCompanyName = hk[Math.floor(Math.random() * 10)];
//       console.log(airCompanyName);
//       const strSql2 = `insert into flight_list(cityName, cityId, firstLetter, airportName, airCompanyName,airIcon,dptTime,arrTime) values ('${cityName}', ${cityId}, '${firstLetter}', '${airportName}','${airCompanyName}','${"https://images3.c-ctrip.com/ztrip/airline/CA.png"}','${timeArray[i]}','${timeArray1[i]}');`;
//       await sqlQuery(strSql2);
//     }
//   }
// );

router.get('/singleList', async (req, res) => {
  // req.query 请求参数
  const {
    dptAirportName,
    dptCityName,
    arrCityName,
    arrAirportName,
    dptDate,
  } = req.query
  const strSql = `select * from flight_list`;
  try {
    const result = await sqlQuery(strSql)
    // 模拟真实场景
    let hkFly = [
            "东方航空",
            "中国南方航空",
            "海南航空",
            "深圳航空",
            "上海航空",
            "厦门航空",
            "四川航空",
            "山东航空",
            "春秋航空",
            "英国航空",
          ];
   
    const resultList = result.map(item => ({
      ...item,
      dptAirportName,
      dptCityName,
      arrCityName,
      arrAirportName,
      dptTime: dptDate, // 模拟日期选择
      price: randomPrice(300, 1000),
      airCompanyName: hkFly[Math.floor(Math.random() * 10)],
      dptTimeStr: item.dptTime,
      arrTimeStr: item.arrTime,
    }))
    res.send({
      code: 1,
      message: "请求成功",
      result: resultList,
    })
  } catch(err) {
    res.send({
      code: -1,
      message: "请求失败"
    });
  }
})

module.exports = router;
