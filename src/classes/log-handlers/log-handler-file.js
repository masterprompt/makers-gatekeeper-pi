const LogHandler = require('../log-handler');
const simpleNodeLogger = require('simple-node-logger');
const config = require('config');

class LogHandlerFile extends LogHandler {
    constructor({
        errorEventName = 'error',
        logDirectory = 'logs',
        fileNamePattern = 'roll-<DATE>.log',
        dateFormat = 'YYYY.MM.DD'
    } = {}) {
        super();
        this.handler = simpleNodeLogger.createRollingFileLogger({
            errorEventName,
            logDirectory, // NOTE: folder must exist and be writable...
            fileNamePattern,
            dateFormat
        });
    }

    static create() {
        return new LogHandlerFile({
            logDirectory: config.logDir
        });
    }
}

module.exports = LogHandlerFile;