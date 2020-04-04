const assert = require('assert');
const { describe, it } = require('mocha');

describe('Simple example of test',
    () => describe('#1+1 === 2', () => {
        it('should return true', () => assert.equal(1+1 === 2, true));
    }));
