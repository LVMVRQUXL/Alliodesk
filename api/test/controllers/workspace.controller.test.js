const {describe, it, afterEach} = require('mocha');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const assert = require('assert');

module.exports = () => {
    describe('WorkspaceController tests', () => {
        const MockDependencies = {
            Services: {
                WorkspaceService: {
                    create: sinon.stub(),
                    destroy: sinon.stub(),
                    findAll: sinon.stub(),
                    findOne: sinon.stub(),
                    mapToDTO: sinon.stub(),
                    update: sinon.stub()
                }
            }
        };

        const WorkspaceController = proxyquire('../../src/controllers/workspace.controller', {
            '../services': MockDependencies.Services
        });

        const fakeWorkspace = {
            id: 1,
            name: 'Test',
            description: 'Something',
            UserId: null
        };

        describe('#createWorkspace(name, description)', () => {
            it('should return the created workspace with valid inputs', async () => {
                // SETUP
                MockDependencies.Services.WorkspaceService.create.resolves(fakeWorkspace);
                MockDependencies.Services.WorkspaceService.mapToDTO.resolves(fakeWorkspace);

                // CALL
                const workspace = await WorkspaceController.createWorkspace(
                    fakeWorkspace.name, fakeWorkspace.description
                );

                // VERIFY
                assert.deepEqual(workspace, fakeWorkspace);

                // TEARDOWN
                MockDependencies.Services.WorkspaceService.create.resetHistory();
                MockDependencies.Services.WorkspaceService.mapToDTO.resetHistory();
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

        describe('#removeOneWorkspaceFromId(id)', () => {
            afterEach(() => MockDependencies.Services.WorkspaceService.findOne.resetHistory());

            const _setupWorkspaceServiceFindOne = (workspace) => {
                MockDependencies.Services.WorkspaceService.findOne.resolves(workspace);
            };
            const _call = async () => await WorkspaceController.removeOneWorkspaceFromId(fakeWorkspace.id);

            it('should return true with valid id', async () => {
                // SETUP
                _setupWorkspaceServiceFindOne(fakeWorkspace);
                MockDependencies.Services.WorkspaceService.mapToDTO.returns(fakeWorkspace);
                MockDependencies.Services.WorkspaceService.destroy.resolves(true);

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, true);

                // TEARDOWN
                MockDependencies.Services.WorkspaceService.mapToDTO.resetHistory();
                MockDependencies.Services.WorkspaceService.destroy.resetHistory();
            });

            it('should return false with invalid id', async () => {
                // SETUP
                _setupWorkspaceServiceFindOne();

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, false);
            });
        });

        describe('#updateOneWorkspaceFromId(id, name, description)', () => {
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
                _setupWorkspaceServiceFindOne();

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, false);

                // TEARDOWN
                _teardownWorkspaceServiceFindOne();
            });
        });
    });
};
