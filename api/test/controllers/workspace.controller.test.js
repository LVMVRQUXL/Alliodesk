const {describe, it} = require('mocha');
const proxyquire = require('proxyquire');
const sinon = require('sinon');
const assert = require('assert');

module.exports = () => {
    describe('WorkspaceController tests', () => {
        const MockDependencies = {
            Services: {
                WorkspaceService: {
                    create: sinon.stub()
                }
            }
        };

        const WorkspaceController = proxyquire('../../src/controllers/workspace.controller', {
            '../services': MockDependencies.Services
        });

        const fakeWorkspaceName = 'Test';
        const fakeWorkspaceDescription = 'Something';

        describe('#createWorkspace(name, description)', () => {
            it('should return true with valid inputs', async () => {
                // SETUP
                MockDependencies.Services.WorkspaceService.create.resolves(true);

                // CALL
                const result = await WorkspaceController.createWorkspace(fakeWorkspaceName, fakeWorkspaceDescription);

                // VERIFY
                assert.equal(result, true);

                // TEARDOWN
                MockDependencies.Services.WorkspaceService.create.resetHistory();
            });
        });
    });
};
