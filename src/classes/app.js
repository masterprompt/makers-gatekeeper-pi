const Milliseconds = require('../constants/milliseconds');
const config = require('config');
const { pick } = require('lodash');
const Logger = require('./logger');
const RfidReader = require('./rfid-reader');
const Gate = require('./gate');
const AccessController = require('./access-controller');
const EventHandler = require('./event-handler');
const Api = require('./api');
const Beeper = require('./beeper');
const MockReader = require('./mock-reader');
const KeysListRetriever = require('./keys-list-retriever');
const MockApi = require('./mock-api');
const KeyDetector = require('./key-detector');
const ENVIRONMENTS = require('../constants/environments');

class App {
    onStartEventHandler;
    logger;
    keysListRetriever;
    accessController;
    keyDetector;

    constructor () {
        this.onStartEventHandler = new EventHandler();
        this.logger = Logger.create();
        this.keysListRetriever = new KeysListRetriever();
        this.accessController = new AccessController();
        this.keyDetector = new KeyDetector();

        const loggedConfigs = ['keyReadIntervalDelay', 'lockDelay', 'env', 'gateId', 'apiUrl'];
        this.logger.info('App Created with Config:', pick(config, loggedConfigs));

        this.keysListRetriever.onKeysListRetrieved(keys => {
            this.logger.info('Keys List Retrieved:', keys);
            this.accessController.setKeys(keys);
        });

        this.keyDetector.onKeyDetected(keyId => {
            this.accessController.attempt(keyId);
        });

        this.accessController.onAttempt(attempt => {
            this.logger.info('Attempt:', attempt);
        });

        this.keysListRetriever.onError(error => {
            this.logger.info('Error retrieving keys:', error.message);
        });
        
    }

    onStart (handler) {
        this.onStartEventHandler.addHandler(handler);
    }

    start () {
        this.logger.info('Starting...');
        const {
            keyReadIntervalDelay,
            keysRetrievalIntervalDelay
        } = config;
        setInterval(() => this.keyDetector.detectKey(), keyReadIntervalDelay);
        setInterval(() => this.keysListRetriever.retrieveKeysList(), keysRetrievalIntervalDelay);
        setTimeout(() => this.keysListRetriever.retrieveKeysList(), Milliseconds.Second);
        this.onStartEventHandler.publish();
    }

    static createMockApp () {
        const app = new App();
        const reader = new MockReader();
        const api = new MockApi();

        reader.setKeys(api.allKeys);
        app.keyDetector.onDetectKey(() => reader.readKey());
        app.keysListRetriever.onKeysListRetrieve(() => api.retrieveGateKeys());
        return app;
    }

    static createDevApp () {
        const app = new App();
        const reader = new MockReader();
        const mockApi = new MockApi();
        const api = new Api();

        reader.setKeys(mockApi.allKeys);
        app.keyDetector.onDetectKey(() => reader.readKey());
        app.keysListRetriever.onKeysListRetrieve(() => api.retrieveGateKeys());
        app.accessController.onAttempt(attempt => api.sendAttempt(attempt));
        api.onSendAttemptError(error => app.logger.info('Error sending attempt:', error.message));
        return app;
    }
   
    static createProdApp () {
        const app = new App();
        const reader = new RfidReader();
        const gate = new Gate();
        const Beeper = new Beeper();
        const api = new Api();

        app.onStart(() => Beeper.beep2(2));
        app.keyDetector.onDetectKey(() => reader.readKey());
        app.keysListRetriever.onKeysListRetrieve(() => api.retrieveGateKeys());
        app.accessController.onAttempt(attempt => api.sendAttempt(attempt));
        app.accessController.onAttempt(() => Beeper.beep());
        app.accessController.onGranted(() => gate.unlock());
        api.onSendAttemptError(error => app.logger.info('Error sending attempt:', error.message));
        return app;
    }

    static createApp () {
        const { env } = config;
        switch(env) {
            case ENVIRONMENTS.MOCK: return this.createMockApp();
            case ENVIRONMENTS.DEVELOPMENT: return this.createDevApp();
            default: return this.createProdApp();
        }
    }
}

module.exports = App;