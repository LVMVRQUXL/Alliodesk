const {describe, it, before, beforeEach, after, afterEach} = require('mocha');
const assert = require('assert');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const ValidatorUtil = require('../../../../src/v1/utils').ValidatorUtil;

module.exports = () => describe('FeedbackController', () => {
    const MockDependencies = {
        Services: {
            FeedbackService: {}
        }
    };
    const FeedbackController = proxyquire('../../../../src/v1/controllers/feedback.controller', {
        '../services': MockDependencies.Services
    });

    const fakeTokenSession = 'zzzzzzzzzzzzzzz';
    const fakeUser = {
        id: 1,
        name: 'User test',
        email: 'test@gmail.com',
        login: 'test'
    };
    let fakeFeedback = {
        id: 1,
        score: 5,
        title: 'Super service !',
        description: 'Old description',
        user_id: fakeUser.id,
        service_id: undefined
    };

    const setup_FeedbackService_create = () => MockDependencies.Services.FeedbackService.create = sinon.stub();
    const setup_FeedbackService_destroy = () => MockDependencies.Services.FeedbackService.destroy = sinon.stub();
    const setup_FeedbackService_findAll = () => MockDependencies.Services.FeedbackService.findAll = sinon.stub();
    const setup_FeedbackService_findOne = () => MockDependencies.Services.FeedbackService.findOne = sinon.stub();
    const setup_FeedbackService_mapToDTO = () => MockDependencies.Services.FeedbackService.mapToDTO = sinon.stub();
    const setup_FeedbackService_update = () => MockDependencies.Services.FeedbackService.update = sinon.stub();

    const reset_FeedbackService_create = () => MockDependencies.Services.FeedbackService.create.reset();
    const reset_FeedbackService_findAll = () => MockDependencies.Services.FeedbackService.findAll.reset();
    const reset_FeedbackService_findOne = () => MockDependencies.Services.FeedbackService.findOne.reset();
    const reset_FeedbackService_mapToDTO = () => MockDependencies.Services.FeedbackService.mapToDTO.reset();

    const teardown_FeedbackService_create = () => MockDependencies.Services.FeedbackService.create = undefined;
    const teardown_FeedbackService_destroy = () => MockDependencies.Services.FeedbackService.destroy = undefined;
    const teardown_FeedbackService_findAll = () => MockDependencies.Services.FeedbackService.findAll = undefined;
    const teardown_FeedbackService_findOne = () => MockDependencies.Services.FeedbackService.findOne = undefined;
    const teardown_FeedbackService_mapToDTO = () => MockDependencies.Services.FeedbackService.mapToDTO = undefined;
    const teardown_FeedbackService_update = () => MockDependencies.Services.FeedbackService.update = undefined;

    afterEach(() => sinon.restore());

    describe('#buildUpdatingValues', () => {
        beforeEach(() => sinon.spy(ValidatorUtil, 'isValidString'));
        afterEach(() => sinon.reset());

        const oldFeedback = {
            score: fakeFeedback.score,
            title: fakeFeedback.title,
            description: fakeFeedback.description
        };
        let newFeedback = {
            score: 3,
            title: 'Bof bof finalement...',
            description: 'Je rencontre quelques soucis depuis la MAJ...'
        };
        const backup = newFeedback;

        // noinspection JSUnresolvedFunction
        const _call = () => FeedbackController.buildUpdatingValues(oldFeedback, newFeedback);

        it('should return the new feedback values with completely different inputs', () => {
            // CALL
            const values = _call();

            // VERIFY
            assert.deepEqual(values, newFeedback);
            sinon.assert.calledOnce(ValidatorUtil.isValidString);
            sinon.assert.calledWithExactly(ValidatorUtil.isValidString, newFeedback.description);
        });

        it('should return a valid object with partial different inputs', () => {
            // SETUP
            const expectedValues = {
                score: oldFeedback.score,
                title: oldFeedback.title,
                description: newFeedback.description
            };
            newFeedback.score = oldFeedback.score;
            newFeedback.title = oldFeedback.title;

            // CALL
            const values = _call();

            // VERIFY
            assert.deepEqual(values, expectedValues);
            sinon.assert.calledOnce(ValidatorUtil.isValidString);
            sinon.assert.calledWithExactly(ValidatorUtil.isValidString, newFeedback.description);

            // TEARDOWN
            newFeedback = backup;
        });

        it('should return the old feedback values with same inputs', () => {
            // SETUP
            newFeedback = oldFeedback;

            // CALL
            const values = _call();

            // VERIFY
            assert.deepEqual(values, oldFeedback);
            sinon.assert.notCalled(ValidatorUtil.isValidString);

            // TEARDOWN
            newFeedback = backup;
        });
    });

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

        const givenFeedback = {
            score: fakeFeedback.score,
            title: fakeFeedback.title
        };
        // noinspection JSUnresolvedFunction
        const _call = async () => await FeedbackController.createFeedback(givenFeedback, fakeTokenSession);

        it('should return the created feedback with valid input', async () => {
            // SETUP
            const create = MockDependencies.Services.FeedbackService.create;
            const mapToDTO = MockDependencies.Services.FeedbackService.mapToDTO;
            create.resolves(fakeFeedback);
            mapToDTO.returns(fakeFeedback);

            // CALL
            const feedback = await _call();

            // VERIFY
            assert.deepEqual(feedback, fakeFeedback);
            sinon.assert.calledOnce(create);
            sinon.assert.calledWithExactly(create, givenFeedback);
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
            sinon.assert.calledWithExactly(create, givenFeedback);
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

        // noinspection JSUnresolvedFunction
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

        // noinspection JSUnresolvedFunction
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

    describe('#removeOneFeedbackFromId', () => {
        it('should return nothing with valid id', async () => {
            // SETUP
            setup_FeedbackService_destroy();
            const destroy = MockDependencies.Services.FeedbackService.destroy;
            destroy.resolves();

            // CALL
            // noinspection JSUnresolvedFunction
            const result = await FeedbackController.removeOneFeedbackFromId(fakeFeedback.id);

            // VERIFY
            assert.equal(result, undefined);
            sinon.assert.calledOnce(destroy);
            sinon.assert.calledWithExactly(destroy, {id: fakeFeedback.id});

            // TEARDOWN
            teardown_FeedbackService_destroy();
        });
    });

    describe('#updateOneFeedbackFromId', () => {
        it('should return true with valid inputs', async () => {
            // SETUP
            const newValues = {
                score: 3,
                title: 'Bof bof finalement...',
                description: 'J\'ai rencontré des problèmes bizarres depuis la MAJ...'
            };
            setup_FeedbackService_update();
            const update = MockDependencies.Services.FeedbackService.update;
            update.resolves();

            // CALL
            // noinspection JSUnresolvedFunction
            const result = await FeedbackController.updateOneFeedbackFromId(fakeFeedback.id, newValues);

            // VERIFY
            assert.equal(result, undefined);
            sinon.assert.calledOnce(update);
            sinon.assert.calledWithExactly(update, newValues, {id: fakeFeedback.id});

            // TEARDOWN
            teardown_FeedbackService_update();
        });
    });
});
