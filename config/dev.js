const ENVIRONMENTS = require('../src/constants/environments');
const Milliseconds = require('../src/constants/milliseconds');

module.exports = {
    env: ENVIRONMENTS.DEVELOPMENT,
    keysRetrievalIntervalDelay: Milliseconds.Second * 20,
    beeperPin: undefined,
    gatePin: undefined,
    readyPin: undefined,
}