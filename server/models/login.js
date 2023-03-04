const express = require("express");
const router = express.Router();
const sqlQuery = require("../mysql");

router.post("/login", async (req, res) => {
// req.body 
  try {
    const { userPhone, password, nickName } = req.body;
    const createTableSql = `
    create table if not exists user (
      id int auto_increment,
      userPhone char(11) not null,
      password char(10) not null,
      nickName char(50) not null,
      primary key (id)
    ) engine=innodb;
    `;
    await sqlQuery(createTableSql);
    // 查询是否有对应用户的手机号
    const sqlStr = `select userPhone from user where userPhone=${userPhone}`;
    const result = await sqlQuery(sqlStr);
    if (result.length) {
      // 有对应手机号，走登录流程
      const userInfo = `select nickName,password from user where userPhone=${userPhone}`;
      const userInfoRes = await sqlQuery(userInfo);
      if (userInfoRes.length && userInfoRes[0].password === password) {
        // 登录成功
        if (nickName !== userInfoRes[0]['nickName']) {
          const updateSql = `update user set nickName='${nickName}' where userPhone=${userPhone}`;
          await sqlQuery(updateSql)
        }
        res.send({
          code: 1,
          mes: '登录成功',
          result: {
            userPhone,
            nickName
          }
        })
      } else {
        res.send({
          code: 2,
          mes: '密码错误'
        })
      }
    } else {
      // 注册
      const insertSql = `insert into user(id, nickName, userPhone, password) values (null, '${nickName}', '${userPhone}', '${password}')`;
      await sqlQuery(insertSql)
      res.send({
        code: 1,
        mes: '注册并登录成功',
        result: {
          userPhone,
          nickName
        }
      })
    }
  } catch(err) {
    res.send({
      code: -1,
      mes: "请求失败",
      result: err
    })
  }
})

module.exports = router