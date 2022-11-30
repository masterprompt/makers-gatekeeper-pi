const ENVIRONMENTS = require('../src/constants/environments');
const Milliseconds = require('../src/constants/milliseconds');

module.exports = {
    env: ENVIRONMENTS.MOCK,
    keysRetrievalIntervalDelay: Milliseconds.Minute,
}