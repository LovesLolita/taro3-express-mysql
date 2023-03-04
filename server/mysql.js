const mysql = require('mysql2')
const log4js = require("log4js")
const logger = log4js.getLogger("mysqlErr")
const express = require("express")
const app = express()

log4js.configure({
  appenders: {
    access: {
      type: 'file',
      filename: 'mysql-err.log',
    }
  },
  categories: { default: { appenders: ["access"], level: "error" } }
})

app.use(log4js.connectLogger(log4js.getLogger("access"), {
  level: 'auto'
}))

const options = {
  host: "127.0.0.1",// 主机名
  port: '3306',
  user: 'root', // 数据库用户名
  password: 'root',
  database: "meituanyf"// 数据库名称
}
let db;
const handeError = (err) => {
  logger.error("mysql connect error:", err)
  if (err) {
    // 断开重连
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      connect();
    } else {
      console.log(err.stack || err)
    }
  }
} 

const connect = () => {
  db = mysql.createConnection(options)
  db.connect(handeError)
  db.on('error', handeError)
}

connect();

const sqlQuery = (strSql) => {
  return new Promise((resolve, reject) => {
    // 执行sql语句
    db.query(strSql, (err, res, fields) => {
      if (err) {
        reject(err)
        return
      }
      resolve(res)
    })
  })
}

module.exports = sqlQuery
