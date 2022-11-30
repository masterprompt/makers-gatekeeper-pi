const Milliseconds = require('../constants/milliseconds');
const config = require('config');

class Gate {
    lockTimer;
    handler;

    constructor(handler) {
        this.handler = handler;
    }

    handleAttempt (attempt) {
        if (attempt.result) {
            this.unlock();
        }
    }

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