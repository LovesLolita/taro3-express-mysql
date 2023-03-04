const express = require('express')

const app = express()
const models = require('./models')

// 当请求体content-type 时application/json时
app.use(express.json())
// 当请求体content-type 时application/x-www-form-urlencoded时
app.use(express.urlencoded({
  extended: false,
}))

models(app)
const port = 3000
app.listen(port, () => {
  console.log(`listening on ${port}`)
})