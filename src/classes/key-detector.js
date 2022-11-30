const EventHandler = require('./event-handler');

class KeyDetector {
    onKeyDetectedEventHandler;
    onDetectKeyCallback = () => {};

    constructor () {
        this.onKeyDetectedEventHandler = new EventHandler();
    }

    onKeyDetected (handler) {
        this.onKeyDetectedEventHandler.addHandler(handler);
    }

    onDetectKey (onDetectKeyCallback = () => {}) {
        this.onDetectKeyCallback = onDetectKeyCallback;
    }

    detectKey () {
        const keyId = this.onDetectKeyCallback();
        if (keyId) {
            this.onKeyDetectedEventHandler.publish(keyId);
        }
    }
}

module.exports = KeyDetector;