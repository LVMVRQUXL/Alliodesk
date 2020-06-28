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
        id: 1,
        score: 5,
        title: 'Super service !'
    };

    const setup_FeedbackService_create = () => MockDependencies.Services.FeedbackService.create = sinon.stub();
    const setup_FeedbackService_findAll = () => MockDependencies.Services.FeedbackService.findAll = sinon.stub();
    const setup_FeedbackService_findOne = () => MockDependencies.Services.FeedbackService.findOne = sinon.stub();
    const setup_FeedbackService_mapToDTO = () => MockDependencies.Services.FeedbackService.mapToDTO = sinon.stub();

    const reset_FeedbackService_create = () => MockDependencies.Services.FeedbackService.create.reset();
    const reset_FeedbackService_findAll = () => MockDependencies.Services.FeedbackService.findAll.reset();
    const reset_FeedbackService_findOne = () => MockDependencies.Services.FeedbackService.findOne.reset();
    const reset_FeedbackService_mapToDTO = () => MockDependencies.Services.FeedbackService.mapToDTO.reset();

    const teardown_FeedbackService_create = () => MockDependencies.Services.FeedbackService.create = undefined;
    const teardown_FeedbackService_findAll = () => MockDependencies.Services.FeedbackService.findAll = undefined;
    const teardown_FeedbackService_findOne = () => MockDependencies.Services.FeedbackService.findOne = undefined;
    const teardown_FeedbackService_mapToDTO = () => MockDependencies.Services.FeedbackService.mapToDTO = undefined;

    describe('#createFeedback', () => {
        before(() => {
            setup_FeedbackService_create();
            setup_FeedbackService_mapToDTO();
        });
        afterEach(() => {
            reset_FeedbackService_create();
            reset_FeedbackService_mapToDTO();
        });
        after(() => {
            teardown_FeedbackService_create();
            teardown_FeedbackService_mapToDTO();
        });

        const _call = async () => await FeedbackController.createFeedback({
            score: fakeFeedback.score,
            title: fakeFeedback.title
        });

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
            setup_FeedbackService_findAll();
            setup_FeedbackService_mapToDTO();
        });
        afterEach(() => {
            reset_FeedbackService_findAll();
            reset_FeedbackService_mapToDTO();
        });
        after(() => {
            teardown_FeedbackService_findAll();
            teardown_FeedbackService_mapToDTO();
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

    describe('#findOneFeedbackFromId', () => {
        before(() => {
            setup_FeedbackService_findOne();
            setup_FeedbackService_mapToDTO();
        });
        afterEach(() => {
            reset_FeedbackService_findOne();
            reset_FeedbackService_mapToDTO();
        });
        after(() => {
            teardown_FeedbackService_findOne();
            teardown_FeedbackService_mapToDTO();
        });

        const _call = async () => await FeedbackController.findOneFeedbackFromId(fakeFeedback.id);

        it('should return one feedback with valid id', async () => {
            // SETUP
            const findOne = MockDependencies.Services.FeedbackService.findOne;
            findOne.resolves(fakeFeedback);
            const mapToDTO = MockDependencies.Services.FeedbackService.mapToDTO;
            mapToDTO.returns(fakeFeedback);

            // CALL
            const feedback = await _call();

            // VERIFY
            assert.notEqual(feedback, undefined);
            assert.deepEqual(feedback, fakeFeedback);
            sinon.assert.calledOnce(findOne);
            sinon.assert.calledWithExactly(findOne, {id: fakeFeedback.id});
            sinon.assert.calledOnce(mapToDTO);
            sinon.assert.calledWithExactly(mapToDTO, fakeFeedback);
        });

        it('should return undefined with invalid id', async () => {
            // SETUP
            const findOne = MockDependencies.Services.FeedbackService.findOne;
            findOne.resolves();
            const mapToDTO = MockDependencies.Services.FeedbackService.mapToDTO;

            // CALL
            const feedback = await _call();

            // VERIFY
            assert.equal(feedback, undefined);
            sinon.assert.calledOnce(findOne);
            sinon.assert.calledWithExactly(findOne, {id: fakeFeedback.id});
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
