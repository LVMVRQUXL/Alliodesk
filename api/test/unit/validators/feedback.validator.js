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

            // TODO: VERIFY
            assert.equal(result, true);
            sandbox.assert.calledOnce(StringUtil.isEmpty);
        });

        it('should return false with empty description', () => {
            // CALL
            const result = _call('');

            // TODO: VERIFY
            assert.equal(result, false);
            sandbox.assert.calledOnce(StringUtil.isEmpty);
        });
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

    describe('#isValidTitle', () => {
        beforeEach(() => sandbox.spy(StringUtil, 'isEmpty'));
        afterEach(() => sandbox.reset());

        const _call = (title) => FeedbackValidator.isValidTitle(title);

        it('should return true with valid title', () => {
            // SETUP
            const title = 'Test';

            // CALL
            const result = _call(title);

            // VERIFY
            assert.equal(result, true);
            sandbox.assert.calledOnce(StringUtil.isEmpty);
            sandbox.assert.calledWithExactly(StringUtil.isEmpty, title);
        });

        it('should return false with invalid title', () => {
            // SETUP
            const title = '';

            // CALL
            const result = _call(title);

            // VERIFY
            assert.equal(result, false);
            sandbox.assert.calledOnce(StringUtil.isEmpty);
            sandbox.assert.calledWithExactly(StringUtil.isEmpty, title);
        });
    });
});
