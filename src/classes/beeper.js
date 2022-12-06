const PiGpioOutput = require('./pi-gpio-output');
const config = require('config');
const { get } = require('lodash');

class Beeper extends PiGpioOutput {
	beepDuration = 80;
	beepDelay = 180;

    constructor () {
		super({ pin: get(config, 'beeperPin'), enabled: true });
		this.beepDuration = get(config, 'beepDuration', 80);
		this.beepDelay = get(config, 'beepDelay', 180);
    }

	beep (retries = 0) {
		if (!retries) {
			return;
		}
		this.on();
		setTimeout(() => {
			this.off();
			setTimeout(() => {
				this.beep(retries - 1);
			}, this.beepDelay);
		}, this.beepDuration);
	}
}

module.exports = Beeper;