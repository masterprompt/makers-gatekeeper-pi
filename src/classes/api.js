const config = require('config');
const axios = require('axios');
const EventHandler = require('./event-handler');

const callback = () => {}

class Api {
    onSendAttemptErrorEventHandler;

    constructor () {
        this.onSendAttemptErrorEventHandler = new EventHandler();
    }

    async retrieveGateKeys () {
        const { apiUrl, apiGateKeys, gateId, gateSecret } = config;
        const headers = { secret: gateSecret };
        const response = await axios.get(`${apiUrl}${apiGateKeys}`.replace(':gateId', gateId), { headers });
        return response.data;
        
    }

    async sendAttempt (attempt) {
        const { apiUrl, apiGateAttempts, gateId, gateSecret } = config;
        const headers = { secret: gateSecret };
        try {
            axios.post(`${apiUrl}${apiGateAttempts}`.replace(':gateId', gateId), attempt, { headers });
        } catch (err) {
            this.onSendAttemptErrorEventHandler.publish(err);
        }
        
    }

    onSendAttemptError (handler) {
        this.onSendAttemptErrorEventHandler.addHandler(handler);
    }
}

module.exports = Api;