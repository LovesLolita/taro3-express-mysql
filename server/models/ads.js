const express = require('express')
const router = express.Router()
const sqlQuery = require("../mysql")

router.get("/advertising", async (req, res) => {
  const strSql = `select * from ads`;
  try {
    const result = await sqlQuery(strSql);
    res.send({
      code: 1,
      message: '请求成功',
      result,
    })
  } catch (err) {
    res.send({
      code: -1,
      message: '失败'
    })
  }
})

module.exports = router