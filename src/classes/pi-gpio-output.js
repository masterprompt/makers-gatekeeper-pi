const rpio = require('rpio');

class PiGpioOutput {
    pin;
    onState;
    offState;

    constructor (pin, onState = rpio.HIGH, offState = rpio.LOW) {
        this.pin = pin;
        this.onState = onState;
        this.offState = offState;

        rpio.open(this.pin, rpio.OUTPUT);
        rpio.write(this.pin, this.offState);

        //  Ensure we turn off whatever is left on if program stops
        process.on('SIGINT',() => rpio.write(this.pin, this.offState));
    }

    on () {
        if (this.pin) {
            rpio.write(this.pin, this.onState);
        }
    }

    off () {
        if (this.pin) {
            rpio.write(this.pin, this.offState);
        }
    }
}

module.exports = PiGpioOutput;