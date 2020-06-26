const {describe, it, before, after, afterEach} = require('mocha');
const assert = require('assert');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

module.exports = () => describe('FeedbackController tests', () => {
    const MockDependencies = {
        Services: {
            FeedbackService: {}
        }
    };
    const FeedbackController = proxyquire('../../src/controllers/feedback.controller', {
        '../services': MockDependencies.Services
    });
    const fakeFeedback = {
        score: 5,
        title: 'Super service !'
    };

    const _reset_FeedbackService = () => {
        MockDependencies.Services.FeedbackService = {};
    };

    describe('#createFeedback', () => {
        before(() => {
            MockDependencies.Services.FeedbackService.create = sinon.stub();
            MockDependencies.Services.FeedbackService.mapToDTO = sinon.stub();
        });
        afterEach(() => {
            MockDependencies.Services.FeedbackService.create.reset();
            MockDependencies.Services.FeedbackService.mapToDTO.reset();
        });
        after(() => _reset_FeedbackService());

        const _call = async () => await FeedbackController.createFeedback(fakeFeedback.score, fakeFeedback.title, null);

        it('should return the created feedback with valid inputs', async () => {
            // SETUP
            const create = MockDependencies.Services.FeedbackService.create;
            create.resolves(fakeFeedback);
            const mapToDTO = MockDependencies.Services.FeedbackService.mapToDTO;
            mapToDTO.resolves(fakeFeedback);

            // CALL
            const feedback = await _call();

            // VERIFY
            assert.deepEqual(feedback, fakeFeedback);
            sinon.assert.calledOnce(create);
            sinon.assert.calledWithExactly(create, {
                score: fakeFeedback.score,
                title: fakeFeedback.title,
                description: null
            });
            sinon.assert.calledOnce(mapToDTO);
            sinon.assert.calledWithExactly(mapToDTO, fakeFeedback);
        });

        it('should return undefined if a conflict has occurred', async () => {
            // SETUP
            const create = MockDependencies.Services.FeedbackService.create;
            create.resolves();

            // CALL
            const feedback = await _call();

            // VERIFY
            assert.equal(feedback, undefined);
            sinon.assert.calledOnce(create);
            sinon.assert.calledWithExactly(create, {
                score: fakeFeedback.score,
                title: fakeFeedback.title,
                description: null
            });
            sinon.assert.notCalled(MockDependencies.Services.FeedbackService.mapToDTO);
        });
    });
});
