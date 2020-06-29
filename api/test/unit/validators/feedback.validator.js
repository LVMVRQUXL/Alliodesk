const {describe, it, beforeEach, afterEach} = require('mocha');
const assert = require('assert');

const FeedbackValidator = require('../../../src/routes/validators').FeedbackValidator;
const StringUtil = require('../../../src/utils').StringUtil;

module.exports = (sandbox) => describe('FeedbackValidator', () => {
    afterEach(() => sandbox.restore());

    describe('#isValid', () => {
    });

    describe('#isValidDescription', () => {
        beforeEach(() => sandbox.spy(StringUtil, 'isEmpty'));
        afterEach(() => sandbox.reset());

        const _call = (description) => FeedbackValidator.isValidDescription(description);

        it('should return true with valid description', () => {
            // CALL
            const result = _call('Test');

            // VERIFY
            assert.equal(result, true);
            sandbox.assert.calledOnce(StringUtil.isEmpty);
        });

        it('should return false with empty description', () => {
            // CALL
            const result = _call('');

            // VERIFY
            assert.equal(result, false);
            sandbox.assert.calledOnce(StringUtil.isEmpty);
        });
    });

    describe('#isValidScore', () => {
    });

    describe('#isValidTitle', () => {
    });
});
