const Milliseconds = require('../constants/milliseconds');
const PiGpioOutput = require('./pi-gpio-output');
const config = require('config');
const { get } = require('lodash');

class Gate extends PiGpioOutput {
    lockDelay;
    lockTimer;

    constructor () {
        super({ pin: get(config, 'gatePin'), enabled: true });
        this.lockDelay = get(config, 'lockDelay', Milliseconds.Second * 5);
    }

    lock() {
        this.off();
    }

    unlock() {
        this.on();
        if (this.lockTimer) {
            clearTimeout(this.lockTimer);
        }
        this.lockTimer = setTimeout(() => this.lock(), this.lockDelay);
    }

}

module.exports = Gate;