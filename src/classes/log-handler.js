class LogHandler {
    handler;

    info (...args) {
        this.handler.info(...args);
    }

    error (...args) {
        this.handler.error(...args);
    }
}

module.exports = LogHandler;