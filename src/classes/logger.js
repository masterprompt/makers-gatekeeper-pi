const LogHandlerStdOut = require('./log-handlers/log-handler-stdout');
const LogHandlerFile = require('./log-handlers/log-handler-file');

class Logger {
    logHandlers = [];

    constructor(loggHandlers = []) {
        this.logHandlers =loggHandlers;
    }

    //  Create the basics
    static create() {
        return new Logger([ LogHandlerStdOut.create(), LogHandlerFile.create() ]);
    }

    info (...args) {
        this.logHandlers.forEach(handler => handler.info(...args));
    }

    error (...args) {
        this.logHandlers.forEach(handler => handler.error(...args));
    }

    addHandler(handler) {
        this.logHandlers.push(handler);
    }

    handleAttempt (attempt) {
        this.info('Attempt:', attempt);
    }

}

module.exports = Logger;