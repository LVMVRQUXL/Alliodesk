const {describe, it, afterEach} = require('mocha');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const assert = require('assert');

const SecurityUtil = require('../../../../src/v1/utils/security.util');

module.exports = () => {
    describe('WorkspaceController', () => {
        const MockDependencies = {
            Services: {
                ServiceService: {
                    mapToDTO: sinon.stub()
                },
                WorkspaceService: {
                    create: sinon.stub(),
                    destroy: sinon.stub(),
                    findAll: sinon.stub(),
                    findOne: sinon.stub(),
                    mapToDTO: sinon.stub(),
                    update: sinon.stub()
                }
            },
            UserController: {
                findOneUserFromToken: sinon.stub()
            },
            ServiceController: {
                findOneServiceFromId: sinon.stub()
            }
        };

        const WorkspaceController = proxyquire('../../../../src/v1/controllers/workspace.controller', {
            '../services': MockDependencies.Services,
            './user.controller': MockDependencies.UserController,
            './service.controller': MockDependencies.ServiceController
        });

        const fakeUser = {
            id: 1,
            name: 'Test',
            email: 'test@gmail.com',
            login: 'test'
        };
        const fakeWorkspace = {
            id: 1,
            name: 'Test',
            description: 'Something',
            user_id: fakeUser.id
        };
        const fakeService = {
            id: 1,
            name: 'Service',
            version: '1.0.0',
            source_url: 'https://www.google.fr',
            user_id: fakeUser.id,
            service_status_id: 1
        };
        const fakeUserToken = async () => await SecurityUtil.randomToken();

        describe('#addOneServiceInOneWorkspaceFromId(workspaceId, serviceId)', () => {
            afterEach(() => MockDependencies.ServiceController.findOneServiceFromId.resetHistory());

            const _setupServiceController_findOneServiceFromId = (service) => {
                MockDependencies.ServiceController.findOneServiceFromId.resolves(service);
            };
            const _setupWorkspaceController_findOne = (workspace) => {
                MockDependencies.Services.WorkspaceService.findOne.resolves(workspace);
            };
            const _call = async () => await WorkspaceController.addOneServiceInOneWorkspaceFromId(
                fakeWorkspace.id, fakeService.id
            );
            const _teardownWorkspaceController_findOne = () => {
                MockDependencies.Services.WorkspaceService.findOne.resetHistory();
            };

            it('should return true with valid inputs', async () => {
                // SETUP
                _setupServiceController_findOneServiceFromId(fakeService);
                _setupWorkspaceController_findOne(fakeWorkspace);
                fakeWorkspace.addService = sinon.stub();
                fakeWorkspace.addService.resolves();

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, true);

                // TEARDOWN
                _teardownWorkspaceController_findOne();
                fakeWorkspace.addService.resetHistory();
            });

            it('should return undefined with invalid service\'s id', async () => {
                // SETUP
                _setupServiceController_findOneServiceFromId();

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, undefined);
            });

            it('should return undefined with invalid workspace\'s id', async () => {
                // SETUP
                _setupServiceController_findOneServiceFromId(fakeService);
                _setupWorkspaceController_findOne();

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, undefined);

                // TEARDOWN
                _teardownWorkspaceController_findOne();
            });
        });

        describe('#createWorkspace(name, description, userToken)', () => {
            afterEach(() => MockDependencies.UserController.findOneUserFromToken.resetHistory());

            const _setupUserController_findOneUserFromToken = (user) => {
                MockDependencies.UserController.findOneUserFromToken.resolves(user);
            };
            const _call = async () => await WorkspaceController.createWorkspace(
                fakeWorkspace.name, fakeWorkspace.description, fakeUserToken()
            );

            it('should return the created workspace with valid inputs', async () => {
                // SETUP
                _setupUserController_findOneUserFromToken(fakeUser);
                MockDependencies.Services.WorkspaceService.create.resolves(fakeWorkspace);
                MockDependencies.Services.WorkspaceService.mapToDTO.resolves(fakeWorkspace);

                // CALL
                const workspace = await _call();

                // VERIFY
                assert.deepEqual(workspace, fakeWorkspace);

                // TEARDOWN
                MockDependencies.UserController.findOneUserFromToken.resetHistory();
                MockDependencies.Services.WorkspaceService.create.resetHistory();
                MockDependencies.Services.WorkspaceService.mapToDTO.resetHistory();
            });

            it('should return null with invalid user token', async () => {
                // SETUP
                _setupUserController_findOneUserFromToken();

                // CALL
                const workspace = await _call();

                // VERIFY
                assert.equal(workspace, null);
            });
        });

        describe('#findAllServicesOfOneWorkspaceFromId(id)', () => {
            afterEach(() => MockDependencies.Services.WorkspaceService.findOne.resetHistory());

            const _setupWorkspaceService_findOne = (workspace) => {
                MockDependencies.Services.WorkspaceService.findOne.resolves(workspace);
            };
            const _setupFakeWorkspace_getServices = (array) => {
                fakeWorkspace.getServices = sinon.stub();
                fakeWorkspace.getServices.resolves(array);
            };
            const _call = async () => await WorkspaceController.findAllServicesOfOneWorkspaceFromId(fakeWorkspace.id);
            const _teardownFakeWorkspace_getServices = () => fakeWorkspace.getServices.resetHistory();

            it('should return a singleton list of services with valid id', async () => {
                // SETUP
                _setupWorkspaceService_findOne(fakeWorkspace);
                _setupFakeWorkspace_getServices([fakeService]);
                MockDependencies.Services.ServiceService.mapToDTO.returns(fakeService);

                // CALL
                const services = await _call();

                // VERIFY
                assert.equal(services.length, 1);
                assert.deepEqual(services[0], fakeService);

                // TEARDOWN
                _teardownFakeWorkspace_getServices();
                MockDependencies.Services.ServiceService.mapToDTO.resetHistory();
            });

            it('should return an empty list of services with valid id', async () => {
                // SETUP
                _setupWorkspaceService_findOne(fakeWorkspace);
                _setupFakeWorkspace_getServices([]);

                // CALL
                const services = await _call();

                // VERIFY
                assert.equal(services.length, 0);

                // TEARDOWN
                _teardownFakeWorkspace_getServices();
            });

            it('should return undefined with invalid id', async () => {
                // SETUP
                _setupWorkspaceService_findOne();

                // CALL
                const services = await _call();

                // VERIFY
                assert.equal(services, undefined);
            });
        });

        describe('#findAllWorkspaces()', () => {
            afterEach(() => MockDependencies.Services.WorkspaceService.findAll.resetHistory());

            const _setupWorkspaceServiceFindAll = (array) => {
                MockDependencies.Services.WorkspaceService.findAll.resolves(array);
            };
            const _call = async () => await WorkspaceController.findAllWorkspaces();

            it('should return a singleton list of workspaces', async () => {
                // SETUP
                _setupWorkspaceServiceFindAll([fakeWorkspace]);
                MockDependencies.Services.WorkspaceService.mapToDTO.returns(fakeWorkspace);

                // CALL
                const workspaces = await _call();

                // VERIFY
                assert.equal(workspaces.length, 1);
                assert.deepEqual(workspaces[0], fakeWorkspace);

                // TEARDOWN
                MockDependencies.Services.WorkspaceService.mapToDTO.resetHistory();
            });

            it('should return an empty list of workspaces', async () => {
                // SETUP
                _setupWorkspaceServiceFindAll([]);

                // CALL
                const workspaces = await _call();

                // VERIFY
                assert.equal(workspaces.length, 0);
            });
        });

        describe('#findOneWorkspaceFromId(id)', () => {
            afterEach(() => MockDependencies.Services.WorkspaceService.findOne.resetHistory());

            const _setupWorkspaceServiceFindOne = (workspace) => {
                MockDependencies.Services.WorkspaceService.findOne.resolves(workspace);
            };
            const _call = async () => await WorkspaceController.findOneWorkspaceFromId(fakeWorkspace.id);

            it('should return a workspace with valid id', async () => {
                // SETUP
                _setupWorkspaceServiceFindOne(fakeWorkspace);
                MockDependencies.Services.WorkspaceService.mapToDTO.returns(fakeWorkspace);

                // CALL
                const workspace = await _call();

                // VERIFY
                assert.equal(workspace, fakeWorkspace);

                // TEARDOWN
                MockDependencies.Services.WorkspaceService.mapToDTO.resetHistory();
            });

            it('should return null with invalid id', async () => {
                // SETUP
                _setupWorkspaceServiceFindOne();

                // CALL
                const workspace = await _call();

                // VERIFY
                assert.equal(workspace, null);
            });
        });

        describe('#removeOneServiceOfOneWorkspaceFromId(workspaceId, serviceId)', () => {
            afterEach(() => MockDependencies.ServiceController.findOneServiceFromId.resetHistory());

            const _setupServiceController_findOneServiceFromId = (service) => {
                MockDependencies.ServiceController.findOneServiceFromId.resolves(service);
            };
            const _setupWorkspaceService_findOne = (workspace) => {
                MockDependencies.Services.WorkspaceService.findOne.resolves(workspace);
            };
            const _call = async () => await WorkspaceController.removeOneServiceOfOneWorkspaceFromId(
                fakeWorkspace.id, fakeService.id
            );
            const _teardownWorkspaceService_findOne = () => {
                MockDependencies.Services.WorkspaceService.findOne.resetHistory();
            };

            it('should return true with valid inputs', async () => {
                // SETUP
                _setupServiceController_findOneServiceFromId(fakeService);
                _setupWorkspaceService_findOne(fakeWorkspace);
                fakeWorkspace.removeService = sinon.stub();
                fakeWorkspace.removeService.resolves();

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, true);

                // TEARDOWN
                _teardownWorkspaceService_findOne();
                fakeWorkspace.removeService.resetHistory();
            });

            it('should return undefined with invalid service\'s id', async () => {
                // SETUP
                _setupServiceController_findOneServiceFromId();

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, undefined);
            });

            it('should return undefined with invalid workspace\'s id', async () => {
                // SETUP
                _setupServiceController_findOneServiceFromId(fakeService);
                _setupWorkspaceService_findOne();

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, undefined);

                // TEARDOWN
                _teardownWorkspaceService_findOne();
            });
        });

        describe('#removeOneWorkspaceFromId(id, userToken)', () => {
            afterEach(() => MockDependencies.UserController.findOneUserFromToken.resetHistory());

            const _setupUserController_findOneUserFromToken = (user) => {
                MockDependencies.UserController.findOneUserFromToken.resolves(user);
            };
            const _setupWorkspaceService_findOne = (workspace) => {
                MockDependencies.Services.WorkspaceService.findOne.resolves(workspace);
            };
            const _call = async () => await WorkspaceController.removeOneWorkspaceFromId(fakeWorkspace.id);
            const _teardownWorkspaceService_findOne = () => {
                MockDependencies.Services.WorkspaceService.findOne.resetHistory();
            };

            it('should return true with valid id', async () => {
                // SETUP
                _setupUserController_findOneUserFromToken(fakeUser);
                _setupWorkspaceService_findOne(fakeWorkspace);
                MockDependencies.Services.WorkspaceService.mapToDTO.returns(fakeWorkspace);
                MockDependencies.Services.WorkspaceService.destroy.resolves(true);

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, true);

                // TEARDOWN
                _teardownWorkspaceService_findOne();
                MockDependencies.Services.WorkspaceService.mapToDTO.resetHistory();
                MockDependencies.Services.WorkspaceService.destroy.resetHistory();
            });

            it('should return false with invalid id', async () => {
                // SETUP
                _setupUserController_findOneUserFromToken(fakeUser);
                _setupWorkspaceService_findOne();

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, false);
            });

            it('should return undefined with invalid user token', async () => {
                // SETUP
                _setupUserController_findOneUserFromToken();

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, undefined);
            });
        });

        describe('#updateOneWorkspaceFromId(id, name, description, userToken)', () => {
            afterEach(() => MockDependencies.UserController.findOneUserFromToken.resetHistory());

            const _setupUserController_findOneUserFromToken = (user) => {
                MockDependencies.UserController.findOneUserFromToken.resolves(user);
            };
            const _setupWorkspaceServiceFindOne = (workspace) => {
                MockDependencies.Services.WorkspaceService.findOne.resolves(workspace);
            };
            const _setupWorkspaceServiceMapToDTO = (workspace) => {
                MockDependencies.Services.WorkspaceService.mapToDTO.returns(workspace);
            };
            const _call = async () => await WorkspaceController.updateOneWorkspaceFromId(
                fakeWorkspace.id, fakeWorkspace.name, fakeWorkspace.description
            );
            const _teardownWorkspaceServiceFindOne = () => {
                MockDependencies.Services.WorkspaceService.findOne.resetHistory();
            };
            const _teardownWorkspaceServiceMapToDTO = () => {
                MockDependencies.Services.WorkspaceService.mapToDTO.resetHistory();
            };

            it('should return true with valid inputs', async () => {
                // SETUP
                _setupUserController_findOneUserFromToken(fakeUser);
                _setupWorkspaceServiceFindOne(fakeWorkspace);
                _setupWorkspaceServiceMapToDTO(fakeWorkspace);
                MockDependencies.Services.WorkspaceService.update.resolves(true);

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, true);

                // TEARDOWN
                _teardownWorkspaceServiceFindOne();
                _teardownWorkspaceServiceMapToDTO();
                MockDependencies.Services.WorkspaceService.update.resetHistory();
            });

            it('should return false with empty name and description', async () => {
                // SETUP
                _setupUserController_findOneUserFromToken(fakeUser);
                const backupName = fakeWorkspace.name;
                fakeWorkspace.name = '';
                const backupDescription = fakeWorkspace.description;
                fakeWorkspace.description = '';

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, false);

                // TEARDOWN
                fakeWorkspace.name = backupName;
                fakeWorkspace.description = backupDescription;
            });

            it('should return false with empty invalid id', async () => {
                // SETUP
                _setupUserController_findOneUserFromToken(fakeUser);
                _setupWorkspaceServiceFindOne();

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, false);

                // TEARDOWN
                _teardownWorkspaceServiceFindOne();
            });

            it('should return undefined with invalid user token', async () => {
                // SETUP
                _setupUserController_findOneUserFromToken();

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, undefined);
            });
        });
    });
};
