const ENVIRONMENTS = require('../src/constants/environments');
const Milliseconds = require('../src/constants/milliseconds');

module.exports = {
    gateId: process.env.MAKER_GATE_ID,
    gateSecret: process.env.MAKER_GATE_SECRET,
    apiUrl: process.env.MAKER_GATE_API,
    env: ENVIRONMENTS.PRODUCTION,
    logDir: 'logs',
    lockDelay: Milliseconds.Second * 5,
    keyReadIntervalDelay: Milliseconds.Second,
    keysRetrievalIntervalDelay: Milliseconds.Hour,
    apiGateKeys: '/api/v1/gates/:gateId/keys',
    apiGateAttempts: '/api/v1/gates/:gateId/key-log',
    
}