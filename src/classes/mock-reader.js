const { sample } = require('lodash');

const maxBlanks = 4;

class MockReader {
    keys = [];

    setKeys (keys = []) {
        this.keys = [
            ...keys,
            ...Array.from(Array(maxBlanks).keys()).map(() => undefined)
        ];
    }

    readKey () {
        const key = sample([...this.keys, undefined ]);
        return key ? key.id : undefined;
    }
}

module.exports = MockReader;