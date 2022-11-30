const { sampleSize, sample } = require('lodash');
const { v4: uuid } = require('uuid')

const maxKeys = 10;
const maxGrantKeys = 2;

class MockData {
    keys = [];
    grantKeys = [];

    constructor() {
        const ids = this.generateIds();
        this.keys = ids.map((id) => ({ id }));
        this.grantKeys = sampleSize(this.keys, maxGrantKeys);
    }

    getGateKeys () {
        return this.grantKeys;
    }

    readKey () {
        const key = sample(this.keys);
        return key ? key.id : undefined;
    }

    generateIds () {
        return [
            ...Array.from(Array(maxKeys).keys()).map(() => uuid()),
            '63c8c91d',
            'b5df9120'
        ]
    }
}

module.exports = MockData;