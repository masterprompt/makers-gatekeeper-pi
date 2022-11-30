class EventHandler {
    handlers = [];

    constructor (handlers = []) {
        this.handlers = handlers;
    }

    handleEvent (...args) {
        this.handlers.forEach(handler => handler(...args));
    }
}

module.exports = EventHandler;