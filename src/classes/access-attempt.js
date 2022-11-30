const config = require('config');

class AccessAttempt {
    keyId;
    result;

    constructor({ keyId, result } = {}) {
        this.keyId = keyId;
        this.result = result;
    }
}

module.exports = AccessAttempt;