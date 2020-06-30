const {describe, it, afterEach} = require('mocha');
const assert = require('assert');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const SecurityUtil = require('../../../src/utils/security.util');

module.exports = () => {
    describe('ErrorController', () => {
        const MockDependencies = {
            Services: {
                ErrorService: {
                    create: sinon.stub(),
                    destroy: sinon.stub(),
                    findAll: sinon.stub(),
                    findOne: sinon.stub(),
                    mapToDTO: sinon.stub()
                }
            },
            ServiceController: {
                findOneServiceFromName: sinon.stub()
            },
            UserController: {
                findOneUserFromToken: sinon.stub()
            }
        };

        const ErrorController = proxyquire('../../../src/controllers/error.controller', {
            '../services': MockDependencies.Services,
            './service.controller': MockDependencies.ServiceController,
            './user.controller': MockDependencies.UserController
        });

        const fakeUserDTO = {
            id: 1,
            name: 'Fake user',
            email: 'fake.user@gmail.com',
            login: 'fakeUser',
            token_session: async () => await SecurityUtil.randomToken()
        };
        const fakeServiceDTO = {
            id: 1,
            name: 'Fake service',
            version: '1.0.0',
            source_url: 'https://www.google.fr',
            user_id: fakeUserDTO.id,
            service_status_id: 1
        };
        const fakeError = {
            id: 1,
            message: 'New error',
            user_id: fakeUserDTO.id,
            service_id: fakeServiceDTO.id
        };

        const _setup_ErrorService_create = (error) => MockDependencies.Services.ErrorService.create.resolves(error);
        const _setup_ErrorService_destroy = (result) => MockDependencies.Services.ErrorService.destroy.resolves(result);
        const _setup_ErrorService_findAll = (array) => MockDependencies.Services.ErrorService.findAll.resolves(array);
        const _setup_ErrorService_findOne = (error) => MockDependencies.Services.ErrorService.findOne.resolves(error);
        const _setup_ErrorService_mapToDTO = (error) => MockDependencies.Services.ErrorService.mapToDTO.returns(error);
        const _setup_ServiceController_findOneServiceFromName = (service) => {
            MockDependencies.ServiceController.findOneServiceFromName.resolves(service);
        };
        const _setup_UserController_findOneUserFromToken = (user) => {
            MockDependencies.UserController.findOneUserFromToken.resolves(user);
        };

        const _teardown_ErrorService_create = () => MockDependencies.Services.ErrorService.create.resetHistory();
        const _teardown_ErrorService_destroy = () => MockDependencies.Services.ErrorService.destroy.resetHistory();
        const _teardown_ErrorService_findAll = () => MockDependencies.Services.ErrorService.findAll.resetHistory();
        const _teardown_ErrorService_findOne = () => MockDependencies.Services.ErrorService.findOne.resetHistory();
        const _teardown_ErrorService_mapToDTO = () => MockDependencies.Services.ErrorService.mapToDTO.resetHistory();
        const _teardown_ServiceController_findOneServiceFromName = () => {
            MockDependencies.ServiceController.findOneServiceFromName.resetHistory();
        };
        const _teardown_UserController_findOneUserFromToken = () => {
            MockDependencies.UserController.findOneUserFromToken.resetHistory();
        };

        describe('#createError(message, userToken, serviceName)', () => {
            afterEach(() => _teardown_UserController_findOneUserFromToken());

            const _call = async () => await ErrorController.createError(
                fakeError.message, fakeUserDTO.token_session(), fakeServiceDTO.name
            );

            const backupFakeServiceDTOName = fakeServiceDTO.name;

            it('should return the created error about the application with valid inputs', async () => {
                // SETUP
                fakeServiceDTO.name = null;
                _setup_UserController_findOneUserFromToken(fakeUserDTO);
                fakeError.service_id = null;
                _setup_ErrorService_create(fakeError);
                _setup_ErrorService_mapToDTO(fakeError);

                // CALL
                const error = await _call();

                // VERIFY
                assert.notEqual(error, null);
                assert.deepEqual(error, fakeError);

                // TEARDOWN
                fakeServiceDTO.name = backupFakeServiceDTOName;
                fakeError.service_id = fakeServiceDTO.id;
                _teardown_ErrorService_create();
                _teardown_ErrorService_mapToDTO();
            });

            it('should return the created error about one service with valid inputs', async () => {
                // SETUP
                _setup_UserController_findOneUserFromToken(fakeUserDTO);
                _setup_ServiceController_findOneServiceFromName(fakeServiceDTO);
                _setup_ErrorService_create(fakeError);
                _setup_ErrorService_mapToDTO(fakeError);

                // CALL
                const error = await _call();

                // VERIFY
                assert.notEqual(error, null);
                assert.deepEqual(error, fakeError);

                // TEARDOWN
                _teardown_ServiceController_findOneServiceFromName();
                _teardown_ErrorService_create();
                _teardown_ErrorService_mapToDTO();
            });

            it('should return null with invalid user\'s token session', async () => {
                // SETUP
                fakeServiceDTO.name = null;
                _setup_UserController_findOneUserFromToken();

                // CALL
                const error = await _call();

                // VERIFY
                assert.equal(error, null);

                // TEARDOWN
                fakeServiceDTO.name = backupFakeServiceDTOName;
            });

            it('should return null with invalid service\'s name', async () => {
                // SETUP
                fakeServiceDTO.name = 'invalid';
                _setup_UserController_findOneUserFromToken(fakeUserDTO);
                _setup_ServiceController_findOneServiceFromName();

                // CALL
                const error = await _call();

                // VERIFY
                assert.equal(error, null);

                // TEARDOWN
                fakeServiceDTO.name = backupFakeServiceDTOName;
                _teardown_UserController_findOneUserFromToken();
                _teardown_ServiceController_findOneServiceFromName();
            });
        });

        describe('#findAllErrors()', () => {
            afterEach(() => _teardown_ErrorService_findAll());

            const _call = async () => await ErrorController.findAllErrors();

            it('should return a singleton list of errors', async () => {
                // SETUP
                _setup_ErrorService_findAll([fakeError]);
                _setup_ErrorService_mapToDTO(fakeError);

                // CALL
                const errors = await _call();

                // VERIFY
                assert.equal(errors.length, 1);
                assert.deepEqual(errors[0], fakeError);

                // TEARDOWN
                _teardown_ErrorService_mapToDTO();
            });

            it('should return an empty list of errors', async () => {
                // SETUP
                _setup_ErrorService_findAll([]);

                // CALL
                const errors = await _call();

                // VERIFY
                assert.equal(errors.length, 0);
            });
        });

        describe('#findOneErrorFromId(id)', () => {
            afterEach(() => _teardown_ErrorService_findOne());

            const _call = async () => await ErrorController.findOneErrorFromId(fakeError.id);

            it('should return one error with valid id', async () => {
                // SETUP
                _setup_ErrorService_findOne(fakeError);
                _setup_ErrorService_mapToDTO(fakeError);

                // CALL
                const error = await _call();

                // VERIFY
                assert.notEqual(error, null);
                assert.deepEqual(error, fakeError);

                // TEARDOWN
                _teardown_ErrorService_mapToDTO();
            });

            it('should return null with invalid id', async () => {
                // SETUP
                _setup_ErrorService_findOne();

                // CALL
                const error = await _call();

                // VERIFY
                assert.equal(error, null);
            });
        });

        describe('#removeOneErrorFromId(id)', () => {
            afterEach(() => _teardown_ErrorService_findOne());

            const _call = async () => await ErrorController.removeOneErrorFromId(fakeError.id);

            it('should return true with valid id', async () => {
                // SETUP
                _setup_ErrorService_findOne(fakeError);
                _setup_ErrorService_mapToDTO(fakeError);
                _setup_ErrorService_destroy(true);

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, true);

                // TEARDOWN
                _teardown_ErrorService_mapToDTO();
                _teardown_ErrorService_destroy();
            });

            it('should return false with invalid id', async () => {
                // SETUP
                _setup_ErrorService_findOne();

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, false);
            });
        });
    });
};
