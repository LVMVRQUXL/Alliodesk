const {describe, it, before, beforeEach, afterEach, after} = require('mocha');
const assert = require('assert');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

module.exports = () => {
    describe('ServiceController tests', () => {
        const MockDependencies = {
            Services: {
                ServiceService: {
                    create: sinon.stub(),
                    destroy: sinon.stub(),
                    findAll: sinon.stub(),
                    findOne: sinon.stub(),
                    mapToDTO: sinon.stub(),
                    update: sinon.stub()
                }
            },
            ServiceStatusController: {
                pendingStatus: 'pending',
                findServiceStatusFromValue: sinon.stub()
            },
            UserController: {
                findOneUserFromToken: sinon.stub()
            }
        };

        const ServiceController = proxyquire('../../src/controllers/service.controller', {
            '../services': MockDependencies.Services,
            './service_status.controller': MockDependencies.ServiceStatusController,
            './user.controller': MockDependencies.UserController
        });

        const fakeServicePendingStatus = {
            id: 2,
            status: MockDependencies.ServiceStatusController.pendingStatus
        };
        const fakeServiceId = 1;
        const fakeServiceName = 'Test';
        const fakeServiceVersion = '1.0.0';
        const fakeServiceSourceUrl = 'https://www.google.fr';
        const fakeService = {
            id: fakeServiceId,
            name: fakeServiceName,
            version: fakeServiceVersion,
            source_url: fakeServiceSourceUrl,
            service_status_id: fakeServicePendingStatus.id
        };
        const fakeUser = {
            id: 1
        };

        describe('#createService(name, version, sourceUrl)', () => {
            afterEach(() => MockDependencies.UserController.findOneUserFromToken.resetHistory());

            const _setupUserControllerFindOneUserFromToken = (user) => {
                MockDependencies.UserController.findOneUserFromToken.resolves(user);
            };
            const _call = async () => {
                return await ServiceController.createService(fakeServiceName, fakeServiceVersion, fakeServiceSourceUrl);
            };

            it('should return true with valid inputs', async () => {
                // SETUP
                _setupUserControllerFindOneUserFromToken(fakeUser);
                MockDependencies.ServiceStatusController.findServiceStatusFromValue.resolves(fakeServicePendingStatus);
                MockDependencies.Services.ServiceService.create.resolves(true);

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, true);

                // TEARDOWN
                MockDependencies.ServiceStatusController.findServiceStatusFromValue.resetHistory();
                MockDependencies.Services.ServiceService.create.resetHistory();
            });

            it('should return false with invalid user\'s token session', async () => {
                // SETUP
                _setupUserControllerFindOneUserFromToken();

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, false);
            });
        });

        describe('#findAllServices()', () => {
            afterEach(() => MockDependencies.Services.ServiceService.findAll.resetHistory());

            const _setupServiceServiceFindAll = (array) => {
                MockDependencies.Services.ServiceService.findAll.resolves(array);
            };
            const _call = async () => await ServiceController.findAllServices();

            it('should return a singleton list of services', async () => {
                // SETUP
                _setupServiceServiceFindAll([fakeService]);
                MockDependencies.Services.ServiceService.mapToDTO.returns(fakeService);

                // CALL
                const services = await _call();

                // VERIFY
                assert.equal(services.length, 1);
                assert.deepEqual(services[0], fakeService);

                // TEARDOWN
                MockDependencies.Services.ServiceService.mapToDTO.resetHistory();
            });

            it('should return an empty list of services', async () => {
                // SETUP
                _setupServiceServiceFindAll([]);

                // CALL
                const services = await _call();

                // VERIFY
                assert.equal(services.length, 0);
            });
        });

        describe('#findOneServiceFromId(id)', () => {
            afterEach(() => MockDependencies.Services.ServiceService.findOne.resetHistory());

            const _setupServiceServiceFindOne = (service) => {
                MockDependencies.Services.ServiceService.findOne.resolves(service);
            };
            const _call = async () => await ServiceController.findOneServiceFromId(fakeServiceId);

            it('should return a service with valid id', async () => {
                // SETUP
                _setupServiceServiceFindOne(fakeService);
                MockDependencies.Services.ServiceService.mapToDTO.returns(fakeService);

                // CALL
                const service = await _call();

                // VERIFY
                assert.deepEqual(service, fakeService);

                // TEARDOWN
                MockDependencies.Services.ServiceService.mapToDTO.resetHistory();
            });

            it('should return null with invalid id', async () => {
                // SETUP
                _setupServiceServiceFindOne();

                // CALL
                const service = await _call();

                // VERIFY
                assert.equal(service, null);
            });
        });

        describe('#rejectOneServiceFromId(id)', () => {
            beforeEach(() => {
                MockDependencies.ServiceStatusController.findServiceStatusFromValue.resolves(fakeServicePendingStatus);
            });
            afterEach(() => {
                MockDependencies.ServiceStatusController.findServiceStatusFromValue.resetHistory();
                MockDependencies.Services.ServiceService.findOne.resetHistory();
            });

            const _setupServiceServiceFindOne = (service) => {
                MockDependencies.Services.ServiceService.findOne.resolves(service);
            };
            const _setupServiceServiceMapToDTO = () => {
                MockDependencies.Services.ServiceService.mapToDTO.resolves(fakeService);
            };
            const _call = async () => await ServiceController.rejectOneServiceFromId(fakeServiceId);
            const _teardownServiceServiceMapToDTO = () => {
                MockDependencies.Services.ServiceService.mapToDTO.resetHistory();
            };

            it('should return true with valid id', async () => {
                // SETUP
                _setupServiceServiceFindOne(fakeService);
                _setupServiceServiceMapToDTO();
                MockDependencies.Services.ServiceService.update.resolves(true);

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, true);

                // TEARDOWN
                MockDependencies.Services.ServiceService.mapToDTO.resetHistory();
                _teardownServiceServiceMapToDTO();
            });

            it('should return null with invalid id', async () => {
                // SETUP
                _setupServiceServiceFindOne();

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, undefined);
            });

            it('should return null with valid id but not a pending service', async () => {
                // SETUP
                fakeService.service_status_id = 3;
                _setupServiceServiceFindOne(fakeService);
                _setupServiceServiceMapToDTO();

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, undefined);

                // TEARDOWN
                fakeService.service_status_id = fakeServicePendingStatus.id;
                _teardownServiceServiceMapToDTO();
            });
        });

        describe('#removeOneServiceFromId(id)', () => {
            afterEach(() => MockDependencies.Services.ServiceService.findOne.resetHistory());

            const _setupServiceServiceFindOne = (service) => {
                MockDependencies.Services.ServiceService.findOne.resolves(service);
            };
            const _call = async () => await ServiceController.removeOneServiceFromId(fakeServiceId);

            it('should return true with valid inputs', async () => {
                // SETUP
                _setupServiceServiceFindOne(fakeService);
                MockDependencies.Services.ServiceService.mapToDTO.returns(fakeService);
                MockDependencies.Services.ServiceService.destroy.resolves(true);

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, true);

                // TEARDOWN
                MockDependencies.Services.ServiceService.mapToDTO.resetHistory();
                MockDependencies.Services.ServiceService.destroy.resetHistory();
            });

            it('should return false with invalid id', async () => {
                // SETUP
                _setupServiceServiceFindOne();

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, false);
            });
        });

        describe('#updateOneServiceFromId(id, name, version, sourceUrl)', () => {
            const _setupServiceServiceFindOne = (service) => {
                MockDependencies.Services.ServiceService.findOne.resolves(service);
            };
            const _call = async (id, name, version, sourceUrl) => {
                return await ServiceController.updateOneServiceFromId(id, name, version, sourceUrl);
            };
            const _teardownServiceServiceFindOne = () => {
                MockDependencies.Services.ServiceService.findOne.resetHistory();
            };

            it('should return true with valid inputs', async () => {
                // SETUP
                _setupServiceServiceFindOne(fakeService);
                MockDependencies.Services.ServiceService.mapToDTO.returns(fakeService);
                MockDependencies.Services.ServiceService.update.resolves(true);

                // CALL
                const result = await _call(fakeServiceId, fakeServiceName, fakeServiceVersion, fakeServiceSourceUrl);

                // VERIFY
                assert.equal(result, true);

                // TEARDOWN
                _teardownServiceServiceFindOne();
                MockDependencies.Services.ServiceService.mapToDTO.resetHistory();
                MockDependencies.Services.ServiceService.update.resetHistory();
            });

            it('should return false with invalid name, version and sourceUrl inputs', async () => {
                // CALL
                const result = await _call(fakeServiceId, "", "", "");

                // VERIFY
                assert.equal(result, false);
            });

            it('should return false with invalid id', async () => {
                // SETUP
                _setupServiceServiceFindOne();

                // CALL
                const result = await _call(fakeServiceId, fakeServiceName, fakeServiceVersion, fakeServiceSourceUrl);

                // VERIFY
                assert.equal(result, false);
            });
        });

        describe('#validateOneServiceFromId(id)', () => {
            beforeEach(() => {
                MockDependencies.ServiceStatusController.findServiceStatusFromValue.resolves(fakeServicePendingStatus);
            });
            afterEach(() => {
                MockDependencies.ServiceStatusController.findServiceStatusFromValue.resetHistory();
                MockDependencies.Services.ServiceService.findOne.resetHistory();
            });

            const _setupServiceServiceFindOne = (service) => {
                MockDependencies.Services.ServiceService.findOne.resolves(service);
            };
            const _setupServiceServiceMapToDTO = () => {
                MockDependencies.Services.ServiceService.mapToDTO.resolves(fakeService);
            };
            const _call = async () => await ServiceController.validateOneServiceFromId(fakeServiceId);
            const _teardownServiceServiceMapToDTO = () => {
                MockDependencies.Services.ServiceService.mapToDTO.resetHistory();
            };

            it('should return true with valid inputs', async () => {
                // SETUP
                _setupServiceServiceFindOne(fakeService);
                _setupServiceServiceMapToDTO();
                MockDependencies.Services.ServiceService.update.resolves(true);

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, true);

                // TEARDOWN
                _teardownServiceServiceMapToDTO();
                MockDependencies.Services.ServiceService.update.resetHistory();
            });

            it('should return false with invalid id', async () => {
                // SETUP
                _setupServiceServiceFindOne();

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, undefined);
            });

            it('should return false with valid id but not pending service', async () => {
                // SETUP
                fakeService.service_status_id = 3;
                _setupServiceServiceFindOne(fakeService);
                _setupServiceServiceMapToDTO();

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, undefined);

                // TEARDOWN
                fakeService.service_status_id = fakeServicePendingStatus.id;
                _teardownServiceServiceMapToDTO();
            });
        });
    });
};
