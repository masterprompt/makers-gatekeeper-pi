const rpio = require('rpio');

let BUZZERCount = 1;
const beepDuration = 80;
const beepDelay = 180;

class Beeper {
    
    pin = 18;

    constructor () {
        rpio.open(this.pin, rpio.OUTPUT);
        rpio.write(this.pin, rpio.LOW);

        //  Ensure we turn off buzzer if program stops
        process.on('SIGINT',() => rpio.write(this.pin, 0));
    }

	beep2 (beepCountMax = 1) {
		let beepCount = 0;
		let beepInterval;

		const beepCycle = () => {
			beepCount++;
			if (beepCount>=beepCountMax) {
				clearInterval(beepInterval);
			}
			rpio.write(this.pin, 1);
			setTimeout(() => rpio.write(this.pin, 0), beepDuration);
		}
		beepInterval = setInterval(() => beepCycle(), beepDuration + beepDelay);
	}



    beep() {
      console.log('beep');
        if (this.pin) {
          	setTimeout(() => {

            	rpio.write(this.pin, 1);

            	setTimeout(() => {
              		rpio.write(this.pin, 0);

              		BUZZERCount++;
              		if (BUZZERCount == 3) {
                		BUZZERCount = 1;
              		} else {
                		this.beep();
              		}

            	}, beepDuration);


          	}, beepDelay);
        }
    }
}

module.exports = Beeper;