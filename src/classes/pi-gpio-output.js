const rpio = require('rpio');

class PiGpioOutput {
    pin;
    onState;
    offState;
    enabled = false;

    constructor ({
        pin,
        onState = rpio.HIGH,
        offState = rpio.LOW,
        enabled = false,
    }) {
        this.pin = pin;
        this.onState = onState;
        this.offState = offState;
        this.enabled = enabled;
        this.init();
    }

    init () {
        if (!this.pin || !this.enabled) {
            return;
        }
        rpio.open(this.pin, rpio.OUTPUT);
        rpio.write(this.pin, this.offState);

        //  Ensure we turn off whatever is left on if program stops
        process.on('SIGINT',() => this.off());
    }

    on () {
        if (this.pin && this.enabled) {
            rpio.write(this.pin, this.onState);
        }
    }

    off () {
        if (this.pin && this.enabled) {
            rpio.write(this.pin, this.offState);
        }
    }
}

module.exports = PiGpioOutput;