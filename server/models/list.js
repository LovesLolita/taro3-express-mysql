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
//     for (let i = 0; i < body.result.length; i++) {
//       const { cityId, cityName, firstLetter, airportName } = body.result[i];
//       const airCompanyName = hk[Math.floor(Math.random() * 10)];
//       console.log(airCompanyName);
//       const strSql2 = `insert into flight_list(cityName, cityId, firstLetter, airportName, airCompanyName,airIcon) values ('${cityName}', ${cityId}, '${firstLetter}', '${airportName}','${airCompanyName}','${"https://images3.c-ctrip.com/ztrip/airline/CA.png"}');`;
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
    const resultList = result.map(item => ({
      ...item,
      dptAirportName,
      dptCityName,
      arrCityName,
      arrAirportName,
      dptTime: dptDate, // 模拟日期选择
      price: randomPrice(300, 1000),
      dptTimeStr: dayjs(item.dptTime).format("HH:mm"),
      arrTimeStr: dayjs(item.arrTime).format("HH:mm"),
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
