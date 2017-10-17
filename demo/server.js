var server = require('server');
var { get } = server.router;
var rpio = require('rpio');

const LISTENT_PIN = 8;
const WARNLED_PIN = 12;
var isWarnLEDStateOn = false;
var isWarnLEDFuncOn = true;
rpio.open(LISTENT_PIN, rpio.INPUT, rpio.PULL_DOWN);
rpio.poll(LISTENT_PIN, pin => {
	console.log(Date.now() + ':the state of pin ' + pin + ' is '+ rpio.read(pin))
    isWarnLEDFuncOn && twinkLED(WARNLED_PIN, 1);
},rpio.POLL_HIGH);

function twinkLED(pin, sec) {
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

    console.log(Date.now() + ' now the warn LED state: ' + isWarnLEDStateOn)
}

function onLED(pin) {
    isWarnLEDStateOn = true;
    rpio.open(pin, rpio.OUTPUT);
    rpio.write(pin, rpio.HIGH);
    console.log(Date.now() + ' now the warn LED state: ' + isWarnLEDStateOn)
}

function offLED(pin) {
    isWarnLEDStateOn = false;
    rpio.open(pin, rpio.OUTPUT);
    rpio.write(pin, rpio.LOW);
    rpio.close(pin);
    console.log(Date.now() + ' now the warn LED state: ' + isWarnLEDStateOn)
}

function changeLED(pin) {
    isWarnLEDStateOn ? offLED(pin) : onLED(pin);
}

server({ port: 8080 }, [
    get('/offWarnLED', ctx => {
        console.log(Date.now() + ' offWarnLED request is coming..');
        offLED(WARNLED_PIN);
    }),
    get('/onWarnLED', ctx => {
        console.log(Date.now() + ' onWarnLED request is coming..');
        onLED(WARNLED_PIN);
    }),
    get('/twinkWarnLED', ctx => {
        console.log(Date.now() + ' twinkWarnLED request is coming..');
        twinkLED(WARNLED_PIN, 1);
    }),
    get('/changeWarnLED', ctx => {
        console.log(Date.now() + ' changeWarnLED request is coming..');
        changeLED(WARNLED_PIN);
    }),
    get('/onWarnFunc', ctx => {
    	isWarnLEDFuncOn = true;
        console.log(Date.now() + ' Warn Functoin is open now..');
    }),
    get('/offWarnFunc', ctx => {
    	isWarnLEDFuncOn = false
        console.log(Date.now() + ' Warn Functoin is close now....');
    }),
]);

console.log('server starts on 8080 port');