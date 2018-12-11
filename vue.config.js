var express = require('express')
var axios = require('axios')
var app = express()
var apiRoutes = express.Router()

module.exports = {
     //添加一个before方法
     before(){
        apiRoutes.get('/api/search',(req,res)=>{
          const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp';
          axios.get(url, {
            headers: {
              referer: 'https://y.qq.com',
              host: 'y.qq.com'
            },
            params: req.query  //这是请求的query
          }).then((response) => {
            //response是api地址返回的，数据在data里。
            res.json(response.data)
          }).catch((e) => {
            console.log(e);
          })
        });
         app.use('/api', apiRoutes);
      }
}
