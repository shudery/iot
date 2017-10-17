var rpio = require('rpio');
rpio.open(11, rpio.OUTPUT);

function blink() {
	  rpio.write(11, rpio.HIGH);
	  setTimeout(function ledoff() {
		      rpio.write(11, rpio.LOW);
		    }, 500);
}

setInterval(blink, 1000);
console.log("start server!")
