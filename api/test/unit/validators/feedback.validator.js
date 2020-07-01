const {describe, it, afterEach, beforeEach} = require('mocha');
const assert = require('assert');

const FeedbackValidator = require('../../../src/routers/validators').FeedbackValidator;
const ValidatorUtil = require('../../../src/utils').ValidatorUtil;

module.exports = (sandbox) => describe('FeedbackValidator', () => {
    afterEach(() => sandbox.restore());

    describe('#isValid', () => {
        beforeEach(() => {
            sandbox.spy(FeedbackValidator, 'isValidScore');
            sandbox.spy(ValidatorUtil, 'isValidString');
        });
        afterEach(() => sandbox.reset());

        const _call = (feedback) => FeedbackValidator.isValid(feedback);

        it('should return true with valid feedback', () => {
            // SETUP
            const feedback = {
                score: 5,
                title: 'Test'
            };

            // CALL
            const result = _call(feedback);

            // VERIFY
            assert.equal(result, true);
            sandbox.assert.calledOnce(FeedbackValidator.isValidScore);
            sandbox.assert.calledWithExactly(FeedbackValidator.isValidScore, feedback.score);
            sandbox.assert.calledOnce(ValidatorUtil.isValidString);
            sandbox.assert.calledWithExactly(ValidatorUtil.isValidString, feedback.title);
        });

        it('should return false with null input', () => {
            // SETUP
            const feedback = null;

            // CALL
            const result = _call(feedback);

            // VERIFY
            assert.equal(result, false);
            sandbox.assert.notCalled(FeedbackValidator.isValidScore);
            sandbox.assert.notCalled(ValidatorUtil.isValidString);
        });

        it('should return false with invalid feedback\'s score', () => {
            // SETUP
            const feedback = {
                score: 6,
                title: 'Test'
            };

            // CALL
            const result = _call(feedback);

            // VERIFY
            assert.equal(result, false);
            sandbox.assert.calledOnce(FeedbackValidator.isValidScore);
            sandbox.assert.calledWithExactly(FeedbackValidator.isValidScore, feedback.score);
            sandbox.assert.notCalled(ValidatorUtil.isValidString);
        });

        it('should return false with invalid feedback\'s title', () => {
            // SETUP
            const feedback = {
                score: 5,
                title: ''
            };

            // CALL
            const result = _call(feedback);

            // VERIFY
            assert.equal(result, false);
            sandbox.assert.calledOnce(FeedbackValidator.isValidScore);
            sandbox.assert.calledWithExactly(FeedbackValidator.isValidScore, feedback.score);
            sandbox.assert.calledOnce(ValidatorUtil.isValidString);
            sandbox.assert.calledWithExactly(ValidatorUtil.isValidString, feedback.title);
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
});
