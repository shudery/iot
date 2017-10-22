var server = require('server');
var { get } = server.router;
var rpio = require('rpio');


rpio.open(16, rpio.INPUT, rpio.PULL_DOWN);
var n = 0;
var flag = 0;

function pollcb(pin) {
    if (flag == rpio.read(pin))
        return;

    flag = flag ? 0 : 1;
    var state = rpio.read(pin) ? 'pressed' : 'released';
    console.log(n + ':Button event on P%d (button currently %s)', pin, state);
    n++
}

rpio.poll(16, pollcb);

function blink(n) {
    rpio.open(n, rpio.OUTPUT)
    rpio.write(n, rpio.HIGH);
    setTimeout(function ledoff() {
        rpio.write(n, rpio.LOW);
        rpio.close(n);
    }, 500);
}

server({ port: 8080 }, [
    get('/1', ctx => {
        console.log('a request is coming... no.1 led blink');
        blink(11);
    }),
    get('/2', ctx => {
        console.log('a request is coming... no.2 led blink');
        blink(15);
    }),
]);

console.log('server starts on 8080 port');