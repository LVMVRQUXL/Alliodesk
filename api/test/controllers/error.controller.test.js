const {describe, it, before, beforeEach, afterEach, after} = require('mocha');
const assert = require('assert');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

module.exports = () => {
    describe('ErrorController tests', () => {
        const MockDependencies = {
            Services: {
                ErrorService: {
                    create: sinon.stub(),
                    mapToDTO: sinon.stub(),
                    findAll: sinon.stub()
                }
            }
        };

        const ErrorController = proxyquire('../../src/controllers/error.controller', {
            '../services': MockDependencies.Services
        });

        const fakeError = {
            id: 1,
            message: 'New error',
            user_id: null,
            service_id: null
        };

        describe('#createError(message)', () => {
            it('should return the created error with inputs', async () => {
                // SETUP
                MockDependencies.Services.ErrorService.create.resolves(fakeError);
                MockDependencies.Services.ErrorService.mapToDTO.returns(fakeError);

                // CALL
                const error = await ErrorController.createError(fakeError.message);

                // VERIFY
                assert.notEqual(error, null);
                assert.deepEqual(error, fakeError);

                // TEARDOWN
                MockDependencies.Services.ErrorService.create.resetHistory();
                MockDependencies.Services.ErrorService.mapToDTO.resetHistory();
            });
        });

        describe('#findAllErrors()', () => {
            afterEach(() => MockDependencies.Services.ErrorService.findAll.resetHistory());

            const _setup_ErrorService_findAll = (array) => {
                MockDependencies.Services.ErrorService.findAll.resolves(array);
            };
            const _setup_ErrorService_mapToDTO = (error) => {
                MockDependencies.Services.ErrorService.mapToDTO.returns(error);
            };

            const _call = async () => await ErrorController.findAllErrors();

            const _teardown_ErrorService_mapToDTO = () => {
                MockDependencies.Services.ErrorService.mapToDTO.resetHistory();
            };

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
    });
};
