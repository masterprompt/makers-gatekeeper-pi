const EventHandler = require('./event-handler');

class KeysListRetriever {
    onKeysListRetrievedEventHandler;
    onErrorEventHandler;
    onKeysListRetrieveCallback = async () => [];

    constructor () {
        this.onKeysListRetrievedEventHandler = new EventHandler();
        this.onErrorEventHandler = new EventHandler();
    }

    onKeysListRetrieved (handler) {
        this.onKeysListRetrievedEventHandler.addHandler(handler);
    }

    onError (handler) {
        this.onErrorEventHandler.addHandler(handler);
    }

    onKeysListRetrieve (onKeysListRetrieveCallback = async () => {}) {
        this.onKeysListRetrieveCallback = onKeysListRetrieveCallback;
    }

    async retrieveKeysList () {
        try {
            const keysList = await this.onKeysListRetrieveCallback()
            this.onKeysListRetrievedEventHandler.publish(keysList);
        } catch (err) {
            this.onErrorEventHandler.publish(err);
        }
    }
}

module.exports = KeysListRetriever;