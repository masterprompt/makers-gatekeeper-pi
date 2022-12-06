const PiGpioOutput = require('./pi-gpio-output');
const config = require('config');
const { get } = require('lodash');

class ReadyIndicator extends PiGpioOutput {
    constructor () {
        super({ pin: get(config, 'readyPin'), enabled: true });
    }
}

module.exports = ReadyIndicator;