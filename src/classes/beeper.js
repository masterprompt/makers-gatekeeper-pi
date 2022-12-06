const rpio = require('rpio');
const PiGpioOutput = require('./pi-gpio-output');

class Beeper extends PiGpioOutput {
    enabled = false;
	beepDuration = 80;
	beepDelay = 180;
    //pin = 18;

    constructor () {
		super(18);
		this.enabled = true;
		/*
        rpio.open(this.pin, rpio.OUTPUT);
        rpio.write(this.pin, rpio.LOW);

        //  Ensure we turn off buzzer if program stops
        process.on('SIGINT',() => rpio.write(this.pin, 0));
		*/
    }

	beep (retries = 0) {
		if (!retries || !this.enabled) {
			return;
		}
		//rpio.write(this.pin, 1);
		this.on();
		setTimeout(() => {
			//rpio.write(this.pin, 0);
			this.off();
			setTimeout(() => {
				this.beep(retries - 1);
			}, this.beepDelay);
		}, this.beepDuration);
	}
}

module.exports = Beeper;