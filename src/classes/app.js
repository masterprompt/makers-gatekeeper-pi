const Milliseconds = require('../constants/milliseconds');
const config = require('config');
const { get, pick } = require('lodash');
const Logger = require('./logger');
const RfidReader = require('./rfid-reader');
const Gate = require('./gate');
const AccessController = require('./access-controller');
const EventHandler = require('./event-handler');
const Api = require('./api');
const MockData = require('./mock-data');

class App {
    logger;
    keyReader;
    gate;
    lockTimer;
    handlers = {};
    config = {};

    constructor ({
        keyReader,
        logger,
        accessController,
        accessAttemptHandler,
        gateKeysRetriever,
    }) {
        this.handlers = {
            logger,
            keyReader,
            accessController,
            accessAttemptHandler,
            gateKeysRetriever
        };

        this.config = {
            ...config,
            keyReadIntervalDelay: get(config, 'keyReadIntervalDelay', Milliseconds.Second),
            keysRetrievalIntervalDelay: get(config, 'keysRetrievalIntervalDelay', Milliseconds.Hour),
        };

        const loggedConfigs = ['keyReadIntervalDelay', 'lockDelay', 'env', 'gateId', 'apiUrl'];
        this.handlers.logger?.info('App > Created with Config:', pick(this.config, loggedConfigs));
    }

    start () {
        this.handlers.logger?.info('App > Starting...');
        const {
            keyReadIntervalDelay,
            keysRetrievalIntervalDelay
        } = config
        setInterval(() => this.checkForKey(), keyReadIntervalDelay);
        setInterval(() => this.retrieveAuthorizedKeys(), keysRetrievalIntervalDelay);
        setTimeout(() => this.retrieveAuthorizedKeys(), Milliseconds.Second);
        this.handlers.logger?.info('App > Started!');
    }

    async checkForKey () {
        const keyId = await this.handlers.keyReader();
        if (!keyId) {
            return;
        }
        const attempt = this.handlers.accessController?.createAttempt(keyId);
        this.handlers.logger?.info('App > Access Attempt:', attempt);
        this.handlers.accessAttemptHandler?.handleEvent(attempt);
    }

    async retrieveAuthorizedKeys () {
        this.handlers.logger?.info('App > retrieveAuthorizedKeys');
        try {
            const gateKeys = await this.handlers.gateKeysRetriever();
            this.handlers.logger?.info('App > retrieveAuthorizedKeys > Received:', gateKeys);
            this.handlers.accessController?.setKeys(gateKeys);
        } catch (err) {
            this.handlers.logger?.error('App > retrieveAuthorizedKeys > Error', err);
        }
    }

    static createMockApp () {
        const logger = Logger.create();
        const mockData = new MockData();
        return new App({
            logger,
            keyReader: () => mockData.readKey(),
            accessController: new AccessController(),
            accessAttemptHandler: new EventHandler(),
            gateKeysRetriever: () => mockData.getGateKeys()
        });
    }

    static createDevApp () {
        const logger = Logger.create();
        const api = new Api();
        const mockData = new MockData();
        return new App({
            logger,
            keyReader: () => mockData.readKey(),
            accessController: new AccessController(),
            gateKeysRetriever: () => api.retrieveGateKeys(logger),
            accessAttemptHandler: new EventHandler([
                (a) => api.sendAttempt(a, logger),
            ]),
        });
    }

    static createProdApp () {
        const gate = new Gate();
        const api = new Api();
        const logger = Logger.create();
        const rfidReader = new RfidReader();
        return new App({
            logger,
            keyReader: () => rfidReader.readKey(),
            accessController: new AccessController(),
            gateKeysRetriever: () => api.retrieveGateKeys(logger),
            accessAttemptHandler: new EventHandler([
                (a) => gate.handleAttempt(a),
                (a) => api.sendAttempt(a, logger),
            ])
        });
    }
}

module.exports = App;