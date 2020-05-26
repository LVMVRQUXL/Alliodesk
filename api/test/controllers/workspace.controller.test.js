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
                    findAll: sinon.stub(),
                    findOne: sinon.stub(),
                    mapToDTO: sinon.stub()
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
            user_id: null
        };

        describe('#createWorkspace(name, description)', () => {
            it('should return true with valid inputs', async () => {
                // SETUP
                MockDependencies.Services.WorkspaceService.create.resolves(true);

                // CALL
                const result = await WorkspaceController.createWorkspace(fakeWorkspace.name, fakeWorkspace.description);

                // VERIFY
                assert.equal(result, true);

                // TEARDOWN
                MockDependencies.Services.WorkspaceService.create.resetHistory();
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
    });
};
