const ENVIRONMENTS = require('../src/constants/environments');
const Milliseconds = require('../src/constants/milliseconds');

module.exports = {
    env: ENVIRONMENTS.PRODUCTION,
    keysRetrievalIntervalDelay: Milliseconds.Second * 20,
}