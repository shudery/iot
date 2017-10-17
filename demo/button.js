var rpio = require('rpio')
rpio.open(15, rpio.INPUT, rpio.PULL_DOWN);
var n = 0; 
var flag = 0;
function pollcb(pin)
{
	        /*
		 *          * Interrupts aren't supported by the underlying hardware, so events
		 *                   * may be missed during the 1ms poll window.  The best we can do is to
		 *                            * print the current state after a event is detected.
		 *                                     */
	if(flag == rpio.read(pin)){
	return;	
}
	flag = flag?0:1;
	var state = rpio.read(pin) ? 'pressed' : 'released';
	        console.log(n+':Button event on P%d (button currently %s)', pin, state);
		n++;
}
 
rpio.poll(15, pollcb);
