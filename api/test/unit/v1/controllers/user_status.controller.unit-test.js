const {describe, it, afterEach} = require('mocha');
const assert = require('assert');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

module.exports = () => {

    describe('UserStatusController', () => {
        const MockDependencies = {
            Services: {
                UserStatusService: {
                    adminValue: 'admin',
                    create: sinon.stub(),
                    findOneFromStatus: sinon.stub(),
                    userValue: 'user'
                }
            }
        };

        const UserStatusController = proxyquire('../../../../src/v1/controllers/user_status.controller', {
            '../services': MockDependencies.Services
        });

        const fakeUserStatus = {
            id: 1,
            status: MockDependencies.Services.UserStatusService.userValue
        };

        describe('#findUserStatusFromName(status)', () => {
            afterEach(() => {
                MockDependencies.Services.UserStatusService.create.resetHistory();
                MockDependencies.Services.UserStatusService.findOneFromStatus.resetHistory();
            });

            const _setupUserStatusServiceFindOneFromStatus = (userStatus) => {
                MockDependencies.Services.UserStatusService.findOneFromStatus.resolves(userStatus);
            };
            const _call = async (status) => await UserStatusController.findUserStatusFromName(status);

            it('should return a User_status with valid status', async () => {
                // SETUP
                _setupUserStatusServiceFindOneFromStatus(fakeUserStatus);

                // CALL
                const userStatus = await _call(MockDependencies.Services.UserStatusService.userValue);

                // VERIFY
                assert.notEqual(userStatus, null);
                assert.equal(userStatus.id, fakeUserStatus.id);
                assert.equal(userStatus.status, fakeUserStatus.status);
            });

            it('should return null with invalid status', async () => {
                // SETUP
                _setupUserStatusServiceFindOneFromStatus();

                // CALL
                const userStatus = await _call("invalidStatus");

                // VERIFY
                assert.equal(userStatus, null);
            });
        });
    });

};
