const {describe, it, before, after, afterEach} = require('mocha');
const assert = require('assert');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

module.exports = () => describe('FeedbackController', () => {
    const MockDependencies = {
        Services: {
            FeedbackService: {},
            UserService: {}
        },
        UserController: {}
    };
    MockDependencies.UserController = proxyquire('../../../src/controllers/user.controller', {
        '../services': MockDependencies.Services
    });
    const FeedbackController = proxyquire('../../../src/controllers/feedback.controller', {
        '../services': MockDependencies.Services,
        './user.controller': MockDependencies.UserController
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
    const setup_UserService_findOne = () => MockDependencies.Services.UserService.findOne = sinon.stub();
    const setup_UserService_mapToDTO = () => MockDependencies.Services.UserService.mapToDTO = sinon.stub();

    const reset_FeedbackService_create = () => MockDependencies.Services.FeedbackService.create.reset();
    const reset_FeedbackService_destroy = () => MockDependencies.Services.FeedbackService.destroy.reset();
    const reset_FeedbackService_findAll = () => MockDependencies.Services.FeedbackService.findAll.reset();
    const reset_FeedbackService_findOne = () => MockDependencies.Services.FeedbackService.findOne.reset();
    const reset_FeedbackService_mapToDTO = () => MockDependencies.Services.FeedbackService.mapToDTO.reset();
    const reset_FeedbackService_update = () => MockDependencies.Services.FeedbackService.update.reset();
    const reset_UserService_findOne = () => MockDependencies.Services.UserService.findOne.reset();
    const reset_UserService_mapToDTO = () => MockDependencies.Services.UserService.mapToDTO.reset();

    const teardown_FeedbackService_create = () => MockDependencies.Services.FeedbackService.create = undefined;
    const teardown_FeedbackService_destroy = () => MockDependencies.Services.FeedbackService.destroy = undefined;
    const teardown_FeedbackService_findAll = () => MockDependencies.Services.FeedbackService.findAll = undefined;
    const teardown_FeedbackService_findOne = () => MockDependencies.Services.FeedbackService.findOne = undefined;
    const teardown_FeedbackService_mapToDTO = () => MockDependencies.Services.FeedbackService.mapToDTO = undefined;
    const teardown_FeedbackService_update = () => MockDependencies.Services.FeedbackService.update = undefined;
    const teardown_UserService_findOne = () => MockDependencies.Services.UserService.findOne = undefined;
    const teardown_UserService_mapToDTO = () => MockDependencies.Services.UserService.mapToDTO = undefined;

    describe('#createFeedback', () => {
        before(() => {
            setup_FeedbackService_create();
            setup_FeedbackService_mapToDTO();
            setup_UserService_findOne();
            setup_UserService_mapToDTO();
        });
        afterEach(() => {
            reset_FeedbackService_create();
            reset_FeedbackService_mapToDTO();
            reset_UserService_findOne();
            reset_UserService_mapToDTO();
        });
        after(() => {
            teardown_FeedbackService_create();
            teardown_FeedbackService_mapToDTO();
            teardown_UserService_findOne();
            teardown_UserService_mapToDTO();
        });

        const givenFeedback = {
            score: fakeFeedback.score,
            title: fakeFeedback.title
        };
        // noinspection JSUnresolvedFunction
        const _call = async () => await FeedbackController.createFeedback(givenFeedback, fakeTokenSession);

        it('should return the created feedback with valid input', async () => {
            // SETUP
            const create_FeedbackService = MockDependencies.Services.FeedbackService.create;
            const mapToDTO_FeedbackService = MockDependencies.Services.FeedbackService.mapToDTO;
            const findOne_UserService = MockDependencies.Services.UserService.findOne;
            const mapToDTO_UserService = MockDependencies.Services.UserService.mapToDTO;
            findOne_UserService.resolves(fakeUser);
            mapToDTO_UserService.returns(fakeUser);
            create_FeedbackService.resolves(fakeFeedback);
            mapToDTO_FeedbackService.returns(fakeFeedback);

            // CALL
            const feedback = await _call();

            // VERIFY
            assert.deepEqual(feedback, fakeFeedback);
            sinon.assert.calledOnce(findOne_UserService);
            sinon.assert.calledWithExactly(findOne_UserService, {token_session: fakeTokenSession});
            sinon.assert.calledOnce(mapToDTO_UserService);
            sinon.assert.calledWithExactly(mapToDTO_UserService, fakeUser);
            sinon.assert.calledOnce(create_FeedbackService);
            sinon.assert.calledWithExactly(create_FeedbackService, givenFeedback);
            sinon.assert.calledOnce(mapToDTO_FeedbackService);
            sinon.assert.calledWithExactly(mapToDTO_FeedbackService, fakeFeedback);
        });

        it('should return undefined if a conflict has occurred', async () => {
            // SETUP
            const findOne_UserService = MockDependencies.Services.UserService.findOne;
            const mapToDTO_UserService = MockDependencies.Services.UserService.mapToDTO;
            const create_FeedbackService = MockDependencies.Services.FeedbackService.create;
            findOne_UserService.resolves(fakeUser);
            mapToDTO_UserService.returns(fakeUser);
            create_FeedbackService.resolves();

            // CALL
            const feedback = await _call();

            // VERIFY
            assert.equal(feedback, undefined);
            sinon.assert.calledOnce(findOne_UserService);
            sinon.assert.calledWithExactly(findOne_UserService, {token_session: fakeTokenSession});
            sinon.assert.calledOnce(mapToDTO_UserService);
            sinon.assert.calledWithExactly(mapToDTO_UserService, fakeUser);
            sinon.assert.calledOnce(create_FeedbackService);
            sinon.assert.calledWithExactly(create_FeedbackService, givenFeedback);
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
        before(() => {
            setup_FeedbackService_destroy();
            setup_FeedbackService_findOne();
            setup_FeedbackService_mapToDTO();
        });
        afterEach(() => {
            reset_FeedbackService_destroy();
            reset_FeedbackService_findOne();
            reset_FeedbackService_mapToDTO();
        });
        after(() => {
            teardown_FeedbackService_destroy();
            teardown_FeedbackService_findOne();
            teardown_FeedbackService_mapToDTO();
        });

        // noinspection JSUnresolvedFunction
        const _call = async () => await FeedbackController.removeOneFeedbackFromId(fakeFeedback.id);

        // noinspection DuplicatedCode
        it('should return true with valid id', async () => {
            // SETUP
            const destroy = MockDependencies.Services.FeedbackService.destroy;
            const findOne = MockDependencies.Services.FeedbackService.findOne;
            const mapToDTO = MockDependencies.Services.FeedbackService.mapToDTO;
            findOne.resolves(fakeFeedback);
            mapToDTO.returns(fakeFeedback);
            destroy.resolves(true);

            // CALL
            const result = await _call();

            // VERIFY
            assert.equal(result, true);
            sinon.assert.calledOnce(findOne);
            sinon.assert.calledWithExactly(findOne, {id: fakeFeedback.id});
            sinon.assert.calledOnce(mapToDTO);
            sinon.assert.calledWithExactly(mapToDTO, fakeFeedback);
            sinon.assert.calledOnce(destroy);
            sinon.assert.calledWithExactly(destroy, {id: fakeFeedback.id});
        });

        // noinspection DuplicatedCode
        it('should return false with valid id', async () => {
            // SETUP
            const destroy = MockDependencies.Services.FeedbackService.destroy;
            const findOne = MockDependencies.Services.FeedbackService.findOne;
            const mapToDTO = MockDependencies.Services.FeedbackService.mapToDTO;
            findOne.resolves();

            // CALL
            const result = await _call();

            // VERIFY
            assert.equal(result, false);
            sinon.assert.calledOnce(findOne);
            sinon.assert.calledWithExactly(findOne, {id: fakeFeedback.id});
            sinon.assert.notCalled(mapToDTO);
            sinon.assert.notCalled(destroy);
        });
    });

    describe('#updateOneFeedbackFromId', () => {
        before(() => {
            setup_FeedbackService_update();
            setup_FeedbackService_findOne();
            setup_FeedbackService_mapToDTO();
        });
        afterEach(() => {
            reset_FeedbackService_update();
            reset_FeedbackService_findOne();
            reset_FeedbackService_mapToDTO();
        });
        after(() => {
            teardown_FeedbackService_update();
            teardown_FeedbackService_findOne();
            teardown_FeedbackService_mapToDTO();
        });

        const newFeedback = {
            score: 3,
            title: 'Bof bof finalement...',
            description: 'J\'ai rencontré des problèmes bizarres depuis la MAJ...'
        };

        // noinspection JSUnresolvedFunction
        const _call = async () => await FeedbackController.updateOneFeedbackFromId(fakeFeedback.id, newFeedback);

        // noinspection DuplicatedCode
        it('should return true with valid inputs', async () => {
            // SETUP
            const update = MockDependencies.Services.FeedbackService.update;
            const findOne = MockDependencies.Services.FeedbackService.findOne;
            const mapToDTO = MockDependencies.Services.FeedbackService.mapToDTO;
            findOne.resolves(fakeFeedback);
            mapToDTO.returns(fakeFeedback);
            update.resolves(true);

            // CALL
            const result = await _call();

            // VERIFY
            assert.equal(result, true);
            sinon.assert.calledOnce(findOne);
            sinon.assert.calledWithExactly(findOne, {id: fakeFeedback.id});
            sinon.assert.calledOnce(mapToDTO);
            sinon.assert.calledWithExactly(mapToDTO, fakeFeedback);
            sinon.assert.calledOnce(update);
            sinon.assert.calledWithExactly(update, newFeedback, {id: fakeFeedback.id});
        });

        // noinspection DuplicatedCode
        it('should return false with invalid id', async () => {
            // SETUP
            const update = MockDependencies.Services.FeedbackService.update;
            const findOne = MockDependencies.Services.FeedbackService.findOne;
            const mapToDTO = MockDependencies.Services.FeedbackService.mapToDTO;
            findOne.resolves();

            // CALL
            const result = await _call();

            // VERIFY
            assert.equal(result, false);
            sinon.assert.calledOnce(findOne);
            sinon.assert.calledWithExactly(findOne, {id: fakeFeedback.id});
            sinon.assert.notCalled(mapToDTO);
            sinon.assert.notCalled(update);
        });
    });
});
