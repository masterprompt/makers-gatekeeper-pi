const config = require('config');
const axios = require('axios');

const callback = () => {}

class Api {
    async retrieveGateKeys (logger) {
        const { apiUrl, apiGateKeys, gateId, gateSecret } = config;
        const headers = { secret: gateSecret };
        try {
            const response = await axios.get(`${apiUrl}${apiGateKeys}`.replace(':gateId', gateId), { headers });
            return response.data;
        } catch (err) {
            logger.info('Error Retrieving Gate Keys:', err.message)
        }
        return [];
        
    }

    async sendAttempt (attempt, logger) {
        const { apiUrl, apiGateAttempts, gateId, gateSecret } = config;
        const headers = { secret: gateSecret };
        try {
            await axios.post(`${apiUrl}${apiGateAttempts}`.replace(':gateId', gateId), attempt, { headers });
        } catch (err) {
            logger.info('Error Sending Attempt:', err.message)
        }
        return;
    }
}

module.exports = Api;