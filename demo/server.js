/**
 * IOT编程：活动感应器
 * 1：监听传感器输出，人体活动时告警灯闪烁，并上传消息
 * 2：设备远程控制：告警灯状态，告警功能是否开启
**/
var server = require('server');
var { get } = server.router;
var http = require('http');
var rpio = require('rpio');

//监听引脚
const LISTENT_PIN = 8;
//告警灯引脚
const WARNLED_PIN = 12;
//设备服务端口
const SERVER_PORT = 8080;
//消息上传地址
const CONSOLE_URL = 'http://192.168.31.170:8066';
//告警灯状态是否点亮
var isWarnLEDStateOn = false;
//告警功能是否开启
var isWarnLEDFuncOn = true;

//监听传感器输出引脚
rpio.open(LISTENT_PIN, rpio.INPUT, rpio.PULL_DOWN);
rpio.poll(LISTENT_PIN, pin => {
	log(':the state of pin ' + pin + ' is '+ rpio.read(pin))
	//只有在告警功能打开时才会闪烁
    isWarnLEDFuncOn && twinkLED(WARNLED_PIN, 1);
    //将监听信息发送至控制平台
    CONSOLE_URL && http.get(CONSOLE_URL,(response)=>{
    	log('send a message to server:' + CONSOLE_URL);
    	log('and response of this server: ',response);
    })

//监听上斜波
},rpio.POLL_HIGH);

//提供服务
server({ port: SERVER_PORT }, [
	//告警灯状态可控
    get('/offWarnLED', ctx => {
        log(' offWarnLED request is coming..');
        offLED(WARNLED_PIN);
    }),
    get('/onWarnLED', ctx => {
        log(' onWarnLED request is coming..');
        onLED(WARNLED_PIN);
    }),
    get('/twinkWarnLED', ctx => {
        log(' twinkWarnLED request is coming..');
        twinkLED(WARNLED_PIN, 1);
    }),
    get('/changeWarnLED', ctx => {
        log(' changeWarnLED request is coming..');
        changeLED(WARNLED_PIN);
    }),

    //是否开启告警灯功能
    get('/onWarnFunc', ctx => {
    	isWarnLEDFuncOn = true;
        log(' Warn Functoin is open now..');
    }),
    get('/offWarnFunc', ctx => {
    	isWarnLEDFuncOn = false
        log(' Warn Functoin is close now....');
    }),
]);

log('server starts on 8080 port');

//闪烁LED，关闭状态下的LED也能闪烁
function twinkLED(pin, sec) {
	//默认闪烁1s
    var sec = sec ? sec : 1;
    if (isWarnLEDStateOn) {
        rpio.write(pin, rpio.LOW);
        rpio.sleep(sec);
        rpio.write(pin, rpio.HIGH);
    } else {
        rpio.open(pin, rpio.OUTPUT);
        rpio.write(pin, rpio.HIGH);
        rpio.sleep(sec);
        rpio.write(pin, rpio.LOW);
        rpio.close(pin);
    }

    log(' now the warn LED state: ' + isWarnLEDStateOn)
}

//打开LED
function onLED(pin) {
    isWarnLEDStateOn = true;
    rpio.open(pin, rpio.OUTPUT);
    rpio.write(pin, rpio.HIGH);
    log(' now the warn LED state: ' + isWarnLEDStateOn)
}

//关闭LED
function offLED(pin) {
    isWarnLEDStateOn = false;
    rpio.open(pin, rpio.OUTPUT);
    rpio.write(pin, rpio.LOW);
    rpio.close(pin);
    log(' now the warn LED state: ' + isWarnLEDStateOn)
}

//改变LED的开关状态
function changeLED(pin) {
    isWarnLEDStateOn ? offLED(pin) : onLED(pin);
}

function log(str){
	console.log('[' + Date.now() + ']' + str);
}