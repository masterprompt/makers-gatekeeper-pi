const { sampleSize, sample } = require('lodash');
const { v4: uuid } = require('uuid')

const maxKeys = 4;
const maxGrantKeys = 2;

class MockApi {
    allKeys = [];
    grantedKeys = [];

    constructor () {
        const keys = [
            ...Array.from(Array(maxKeys).keys()).map(() => uuid()),
            '63c8c91d',
            'b5df9120'
        ]
        .map((id) => ({ id }));
        this.allKeys = keys;
        this.grantKeys = sampleSize(this.allKeys, maxGrantKeys);

    }

    async retrieveGateKeys () {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve(this.grantKeys);
            }, 2000);
        });
    }

    async sendAttempt (attempt) {
    }
}

module.exports = MockApi;