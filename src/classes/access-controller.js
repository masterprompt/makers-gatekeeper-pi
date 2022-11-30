const { find } = require("lodash");
const AccessAttempt = require('./access-attempt');
const EventHandler = require('./event-handler');

class AccessController {
    onAttemptEventHandler;
    onGrantedEventHandler;
    onDeniedEventHandler;

    keys = [];

    constructor () {
        this.onAttemptEventHandler = new EventHandler();
        this.onGrantedEventHandler = new EventHandler();
        this.onDeniedEventHandler = new EventHandler();
    }

    setKeys (keys = []) {
        this.keys = keys;
    }

    createAttempt (keyId) {
        return new AccessAttempt({
            keyId,
            result: this.canAccess(keyId)
        });
    }

    canAccess (keyId) {
        const key = find(this.keys, { id: keyId });
        return Boolean(key);
    }

    attempt (keyId) {
        const attempt = this.createAttempt(keyId);
        this.onAttemptEventHandler.publish(attempt);
        if (attempt.result) {
            this.onGrantedEventHandler.publish(attempt);
        } else {
            this.onDeniedEventHandler.publish(attempt);
        }
    }

    onAttempt (handler) {
        this.onAttemptEventHandler.addHandler(handler);
    }

    onGranted (handler) {
        this.onGrantedEventHandler.addHandler(handler);
    }

    onDenied (handler) {
        this.onDeniedEventHandler.addHandler(handler);
    }
}

module.exports = AccessController;