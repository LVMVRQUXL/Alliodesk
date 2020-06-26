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
    let fakeFeedback = {
        score: 5,
        title: 'Super service !'
    };

    // TODO: add useful methods for calling methods instantiation

    describe('#createFeedback', () => {
        before(() => {
            MockDependencies.Services.FeedbackService.create = sinon.stub();
            MockDependencies.Services.FeedbackService.mapToDTO = sinon.stub();
        });
        afterEach(() => {
            MockDependencies.Services.FeedbackService.create.reset();
            MockDependencies.Services.FeedbackService.mapToDTO.reset();
        });
        after(() => {
            MockDependencies.Services.FeedbackService.create = undefined;
            MockDependencies.Services.FeedbackService.mapToDTO = undefined;
        });

        const _call = async () => await FeedbackController.createFeedback(fakeFeedback);

        it('should return the created feedback with valid input', async () => {
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
                title: fakeFeedback.title
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
                title: fakeFeedback.title
            });
            sinon.assert.notCalled(MockDependencies.Services.FeedbackService.mapToDTO);
        });
    });

    describe('#findAllFeedbacks', () => {
        before(() => {
            MockDependencies.Services.FeedbackService.findAll = sinon.stub();
            MockDependencies.Services.FeedbackService.mapToDTO = sinon.stub();
        });
        afterEach(() => {
            MockDependencies.Services.FeedbackService.findAll.reset();
            MockDependencies.Services.FeedbackService.mapToDTO.reset();
        });
        after(() => {
            MockDependencies.Services.FeedbackService.findAll = undefined;
            MockDependencies.Services.FeedbackService.mapToDTO = undefined;
        });

        const _call = async () => await FeedbackController.findAllFeedbacks();

        it('should return a feedback\'s singleton', async () => {
            // SETUP
            const findAll = MockDependencies.Services.FeedbackService.findAll;
            findAll.resolves([fakeFeedback]);
            const mapToDTO = MockDependencies.Services.FeedbackService.mapToDTO;
            mapToDTO.returns(fakeFeedback);

            // CALL
            const feedbacks = await _call();

            // VERIFY
            assert.notEqual(feedbacks, undefined);
            assert.equal(feedbacks.length, 1);
            assert.deepEqual(feedbacks[0], fakeFeedback);
            sinon.assert.calledOnce(findAll);
            sinon.assert.calledWithExactly(findAll);
            sinon.assert.calledOnce(mapToDTO);
            sinon.assert.calledWithExactly(mapToDTO, fakeFeedback);
        });

        it('should return an empty array of feedbacks', async () => {
            // SETUP
            const findAll = MockDependencies.Services.FeedbackService.findAll;
            findAll.resolves([]);
            const mapToDTO = MockDependencies.Services.FeedbackService.mapToDTO;

            // CALL
            const feedbacks = await _call();

            // VERIFY
            assert.notEqual(feedbacks, undefined);
            assert.equal(feedbacks.length, 0);
            sinon.assert.calledOnce(findAll);
            sinon.assert.calledWithExactly(findAll);
            sinon.assert.notCalled(mapToDTO);
        });
    });

    describe('#isValid', () => {
        const _call = () => FeedbackController.isValid(fakeFeedback);

        it('should return true with valid input', () => {
            // CALL
            const result = _call();

            // VERIFY
            assert.equal(result, true);
        });

        it('should return false with invalid score', () => {
            // SETUP
            const scoreBackup = fakeFeedback.score;
            fakeFeedback.score = 10;

            // CALL
            const result = _call();

            // VERIFY
            assert.equal(result, false);

            // TEARDOWN
            fakeFeedback.score = scoreBackup;
        });

        it('should return false with invalid title', () => {
            // SETUP
            const titleBackup = fakeFeedback.title;
            fakeFeedback.title = '';

            // CALL
            const result = _call();

            // VERIFY
            assert.equal(result, false);

            // TEARDOWN
            fakeFeedback.title = titleBackup;
        });

        it('should return false with undefined input', () => {
            // SETUP
            const fakeFeedbackBackup = fakeFeedback;
            fakeFeedback = undefined;

            // CALL
            const result = _call();

            // VERIFY
            assert.equal(result, false);

            // TEARDOWN
            fakeFeedback = fakeFeedbackBackup;
        });
    });
});
