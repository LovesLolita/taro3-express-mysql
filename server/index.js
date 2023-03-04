const express =  require('express') 

const app = express()

app.get('/', (req, res)=>{
  // req 请求对象
  // res 响应对象
  res.send('hello world')
})

const port = 3000
app.listen(port, ()=>{
  console.log(port);
})