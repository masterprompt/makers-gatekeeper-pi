class EventHandler {
    handlers = [];

    addHandler (handler) {
        this.handlers.push(handler);
    }

    publish (...args) {
        this.handlers.forEach(handler => handler(...args));
    }
}

module.exports = EventHandler;