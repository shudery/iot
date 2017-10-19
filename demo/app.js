var express = require('express');
var http = require('http');
var app = express();

var eventBus = {
    //TODO
}

var iotRouterUrl = '';
var serRouterMap = {
    
}

app.get('/uploadDate',()=>{

    //存数据库
    DB.store();
    //触发订阅事件，通知APP，渲染UI
    eventBus.trigger()
});

//应用端直接请求网关服务即可
app.get('/onWarnLED',()=>{
    http.get(iotRouterUrl + '/onWarnLED',(res)=>{

    });

});

//接收设备的告警信息
app.get('/',(req, res)=>{
    console.log(new Date() +':somebody have a action now.');
    res.send('The warn msg send success.');
    //存储信息
    
    //发布消息到APP

})

app.listen(8066,()=>{
    console.log('start server.')
})
