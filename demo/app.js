var express = require('express');
var http = require('http');
var app = express();
var expressWs = require('express-ws')(app);  
var n = 0;
// var iotRouterUrl = 'http://192.168.43.118:8080';
var iotRouterUrl = 'http://192.168.31.232:8080';

var websocket;

//设置跨域访问  
app.all('*', function(req, res, next) {  
    res.header("Access-Control-Allow-Origin", "*");  
    res.header("Access-Control-Allow-Headers", "X-Requested-With");  
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");  
    res.header("X-Powered-By",' 3.2.1')  
    res.header("Content-Type", "application/json;charset=utf-8");  
    next();  
});  

app.ws('/ws',(ws,res)=>{
    log('[app->server]strat ws connection.');
    ws.on('message',msg=>{
        log('[app->server]'+msg)
        ws.send('conneted');
    })
    websocket = ws;
});

//应用端直接请求网关服务即可
app.get('/changeWarnLED',(req,res)=>{
    log('[app->server]changeWarnLED')
    http.get(iotRouterUrl + '/changeWarnLED',(resp)=>{
        res.send('[server->app]ok!')
    }).on('error',e=>{
        log(e);
    });

});

//接收设备的告警信息
app.get('/warnSignal',(req, res)=>{
    log('[rpio->server]somebody have a action now.');
    res.send('[server->rpio]The warn msg send success.');
    //存储信息
    var store = {
        timeLabel : Date.now(),
        msgType : 'warnSignal',
    }

    //发布消息到APP
    // try{
    //     websocket.send('[server->app]warn Signal.')

    // }catch(e){
    //     log('please start app function of websocket.')
    // }
})

app.listen(8066,()=>{
    log('start server at 8066.')
})

function log(str) {
    console.log('[' + Date.now() + ']' + str);
}