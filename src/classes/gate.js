const Milliseconds = require('../constants/milliseconds');
const config = require('config');

class Gate {
    lockTimer;

    lock() {
    }

    unlock() {
        const lockDelay = get(config, 'lockDelay', Milliseconds.Second * 5);
        if (this.lockTimer) {
            clearTimeout(this.lockTimer);
        }
        this.lockTimer = setTimeout(() => this.lock(), lockDelay);
    }

}

module.exports = Gate;