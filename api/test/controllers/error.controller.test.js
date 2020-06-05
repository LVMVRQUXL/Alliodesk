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
                    mapToDTO: sinon.stub()
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
    });
};
