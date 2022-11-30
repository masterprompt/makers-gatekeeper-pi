const LogHandler = require('../log-handler');
const simpleNodeLogger = require('simple-node-logger');

class LogHandlerStdOut extends LogHandler {
    constructor() {
        super();
        this.handler = simpleNodeLogger.createSimpleLogger();
    }

    static create() {
        return new LogHandlerStdOut();
    }
}

module.exports = LogHandlerStdOut;