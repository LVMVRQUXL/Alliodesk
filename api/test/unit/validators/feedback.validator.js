const {describe, it, afterEach} = require('mocha');
const assert = require('assert');

const FeedbackValidator = require('../../../src/routes/validators').FeedbackValidator;

module.exports = (sandbox) => describe('FeedbackValidator', () => {
    afterEach(() => sandbox.restore());

    describe('#isValid', () => {
    });

    describe('#isValidScore', () => {
        const _call = (score) => FeedbackValidator.isValidScore(score);

        it('should return true with valid score', () => {
            // CALL
            const result = _call(5);

            // VERIFY
            assert.equal(result, true);
        });

        it('should return false with invalid score', () => {
            // CALL
            const result = _call(6);

            // VERIFY
            assert.equal(result, false);
        });
    });
});
