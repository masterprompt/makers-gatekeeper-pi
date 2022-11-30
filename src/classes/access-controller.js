const { find } = require("lodash");
const AccessAttempt = require('./access-attempt');

class AccessController {
    keys = [];

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
}

module.exports = AccessController;