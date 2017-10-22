var rpio = require('rpio');
rpio.open(15, rpio.OUTPUT);

function blink() {
	  rpio.write(15, rpio.HIGH);
	  setTimeout(function ledoff() {
		      rpio.write(15, rpio.LOW);
		    }, 500);
}

setInterval(blink, 1000);
