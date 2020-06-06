const {describe, it, beforeEach, afterEach} = require('mocha');
const assert = require('assert');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const SecurityUtil = require('../../src/utils/security.util');

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
            id: 1,
            name: 'Fake user',
            email: 'fake.user@gmail.com',
            login: 'fakeUser'
        };
        const fakeUserTokenSession = async () => await SecurityUtil.randomToken();

        const _setup_ServiceService_create = (service) => {
            MockDependencies.Services.ServiceService.create.resolves(service);
        };
        const _setup_ServiceService_destroy = (result) => {
            MockDependencies.Services.ServiceService.destroy.resolves(result);
        };
        const _setup_ServiceService_findAll = (array) => {
            MockDependencies.Services.ServiceService.findAll.resolves(array);
        };
        const _setup_ServiceService_findOne = (service) => {
            MockDependencies.Services.ServiceService.findOne.resolves(service);
        };
        const _setup_ServiceService_mapToDTO = (service) => {
            MockDependencies.Services.ServiceService.mapToDTO.returns(service);
        };
        const _setup_ServiceService_update = (result) => {
            MockDependencies.Services.ServiceService.update.resolves(result);
        };
        const _setup_ServiceStatusController_findServiceStatusFromValue = (serviceStatus) => {
            MockDependencies.ServiceStatusController.findServiceStatusFromValue.resolves(serviceStatus);
        };
        const _setup_UserController_findOneUserFromToken = (user) => {
            MockDependencies.UserController.findOneUserFromToken.resolves(user);
        };

        const _teardown_ServiceService_create = () => MockDependencies.Services.ServiceService.create.resetHistory();
        const _teardown_ServiceService_destroy = () => MockDependencies.Services.ServiceService.destroy.resetHistory();
        const _teardown_ServiceService_findAll = () => MockDependencies.Services.ServiceService.findAll.resetHistory();
        const _teardown_ServiceService_findOne = () => MockDependencies.Services.ServiceService.findOne.resetHistory();
        const _teardown_ServiceService_mapToDTO = () => {
            MockDependencies.Services.ServiceService.mapToDTO.resetHistory();
        };
        const _teardown_ServiceService_update = () => MockDependencies.Services.ServiceService.update.resetHistory();
        const _teardown_ServiceStatusController_findServiceStatusFromValue = () => {
            MockDependencies.ServiceStatusController.findServiceStatusFromValue.resetHistory();
        };
        const _teardown_UserController_findOneUserFromToken = () => {
            MockDependencies.UserController.findOneUserFromToken.resetHistory();
        };

        describe('#createService(name, version, sourceUrl, userToken)', () => {
            afterEach(() => _teardown_UserController_findOneUserFromToken());

            const _call = async () => await ServiceController.createService(
                fakeServiceName, fakeServiceVersion, fakeServiceSourceUrl, fakeUserTokenSession()
            );

            it('should return the created service with valid inputs', async () => {
                // SETUP
                _setup_UserController_findOneUserFromToken(fakeUser);
                _setup_ServiceService_findOne();
                _setup_ServiceStatusController_findServiceStatusFromValue(fakeServicePendingStatus);
                _setup_ServiceService_create(fakeService);
                _setup_ServiceService_mapToDTO(fakeService);

                // CALL
                const service = await _call();

                // VERIFY
                assert.equal(service, fakeService);

                // TEARDOWN
                _teardown_ServiceService_findOne();
                _teardown_ServiceStatusController_findServiceStatusFromValue();
                _teardown_ServiceService_create();
                _teardown_ServiceService_mapToDTO();
            });

            it('should return null with invalid user\'s token session', async () => {
                // SETUP
                _setup_UserController_findOneUserFromToken();

                // CALL
                const service = await _call();

                // VERIFY
                assert.equal(service, null);
            });

            it('should return false with name already use', async () => {
                // SETUP
                _setup_UserController_findOneUserFromToken(fakeUser);
                _setup_ServiceService_findOne(fakeService);
                _setup_ServiceService_mapToDTO(fakeService);

                // CALL
                const service = await _call();

                // VERIFY
                assert.equal(service, false);

                // TEARDOWN
                _teardown_ServiceService_findOne();
                _teardown_ServiceService_mapToDTO();
            });
        });

        describe('#findAllServices()', () => {
            afterEach(() => _teardown_ServiceService_findAll());

            const _call = async () => await ServiceController.findAllServices();

            it('should return a singleton list of services', async () => {
                // SETUP
                _setup_ServiceService_findAll([fakeService]);
                _setup_ServiceService_mapToDTO(fakeService);

                // CALL
                const services = await _call();

                // VERIFY
                assert.equal(services.length, 1);
                assert.deepEqual(services[0], fakeService);

                // TEARDOWN
                _teardown_ServiceService_mapToDTO();
            });

            it('should return an empty list of services', async () => {
                // SETUP
                _setup_ServiceService_findAll([]);

                // CALL
                const services = await _call();

                // VERIFY
                assert.equal(services.length, 0);
            });
        });

        describe('#findOneServiceFromId(id)', () => {
            afterEach(() =>_teardown_ServiceService_findOne());

            const _call = async () => await ServiceController.findOneServiceFromId(fakeServiceId);

            it('should return a service with valid id', async () => {
                // SETUP
                _setup_ServiceService_findOne(fakeService);
                _setup_ServiceService_mapToDTO(fakeService);

                // CALL
                const service = await _call();

                // VERIFY
                assert.deepEqual(service, fakeService);

                // TEARDOWN
                _teardown_ServiceService_mapToDTO();
            });

            it('should return null with invalid id', async () => {
                // SETUP
                _setup_ServiceService_findOne();

                // CALL
                const service = await _call();

                // VERIFY
                assert.equal(service, null);
            });
        });

        describe('#rejectOneServiceFromId(id)', () => {
            beforeEach(() => {
                _setup_ServiceStatusController_findServiceStatusFromValue(fakeServicePendingStatus);
            });
            afterEach(() => {
                _teardown_ServiceStatusController_findServiceStatusFromValue();
                _teardown_ServiceService_findOne();
            });

            const _call = async () => await ServiceController.rejectOneServiceFromId(fakeServiceId);

            it('should return true with valid id', async () => {
                // SETUP
                _setup_ServiceService_findOne(fakeService);
                _setup_ServiceService_mapToDTO(fakeService);
                _setup_ServiceService_update(true);

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, true);

                // TEARDOWN
                _teardown_ServiceService_mapToDTO();
            });

            it('should return null with invalid id', async () => {
                // SETUP
                _setup_ServiceService_findOne();

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, undefined);
            });

            it('should return null with valid id but not a pending service', async () => {
                // SETUP
                fakeService.service_status_id = 3;
                _setup_ServiceService_findOne(fakeService);
                _setup_ServiceService_mapToDTO(fakeService);

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, undefined);

                // TEARDOWN
                fakeService.service_status_id = fakeServicePendingStatus.id;
                _teardown_ServiceService_mapToDTO();
            });
        });

        describe('#removeOneServiceFromId(id)', () => {
            afterEach(() => _teardown_ServiceService_findOne());
            const _call = async () => await ServiceController.removeOneServiceFromId(fakeServiceId);

            it('should return true with valid inputs', async () => {
                // SETUP
                _setup_ServiceService_findOne(fakeService);
                _setup_ServiceService_mapToDTO(fakeService);
                _setup_ServiceService_destroy(true);

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, true);

                // TEARDOWN
                _teardown_ServiceService_mapToDTO();
                _teardown_ServiceService_destroy();
            });

            it('should return false with invalid id', async () => {
                // SETUP
                _setup_ServiceService_findOne();

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, false);
            });
        });

        describe('#updateOneServiceFromId(id, name, version, sourceUrl)', () => {
            const _call = async (id, name, version, sourceUrl) => await ServiceController.updateOneServiceFromId(
                id, name, version, sourceUrl
            );

            it('should return true with valid inputs', async () => {
                // SETUP
                _setup_ServiceService_findOne(fakeService);
                _setup_ServiceService_mapToDTO(fakeService);
                _setup_ServiceService_update(true);

                // CALL
                const result = await _call(fakeServiceId, fakeServiceName, fakeServiceVersion, fakeServiceSourceUrl);

                // VERIFY
                assert.equal(result, true);

                // TEARDOWN
                _teardown_ServiceService_findOne();
                _teardown_ServiceService_mapToDTO();
                _teardown_ServiceService_update();
            });

            it('should return false with invalid name, version and sourceUrl inputs', async () => {
                // CALL
                const result = await _call(fakeServiceId, "", "", "");

                // VERIFY
                assert.equal(result, false);
            });

            it('should return false with invalid id', async () => {
                // SETUP
                _setup_ServiceService_findOne();

                // CALL
                const result = await _call(fakeServiceId, fakeServiceName, fakeServiceVersion, fakeServiceSourceUrl);

                // VERIFY
                assert.equal(result, false);
            });
        });

        describe('#validateOneServiceFromId(id)', () => {
            beforeEach(() => {
                _setup_ServiceStatusController_findServiceStatusFromValue(fakeServicePendingStatus);
            });
            afterEach(() => {
                _teardown_ServiceStatusController_findServiceStatusFromValue();
                _teardown_ServiceService_findOne();
            });

            const _call = async () => await ServiceController.validateOneServiceFromId(fakeServiceId);

            it('should return true with valid inputs', async () => {
                // SETUP
                _setup_ServiceService_findOne(fakeService);
                _setup_ServiceService_mapToDTO(fakeService);
                _setup_ServiceService_update(true);

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, true);

                // TEARDOWN
                _teardown_ServiceService_mapToDTO();
                _teardown_ServiceService_update();
            });

            it('should return false with invalid id', async () => {
                // SETUP
                _setup_ServiceService_findOne();

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, undefined);
            });

            it('should return false with valid id but not pending service', async () => {
                // SETUP
                fakeService.service_status_id = 3;
                _setup_ServiceService_findOne(fakeService);
                _setup_ServiceService_mapToDTO(fakeService);

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, undefined);

                // TEARDOWN
                fakeService.service_status_id = fakeServicePendingStatus.id;
                _teardown_ServiceService_mapToDTO();
            });
        });
    });
};
