const {sequelize, dataTypes, checkModelName, makeMockModels} = require('sequelize-test-helpers');
const {describe, it, afterEach} = require('mocha');
const assert = require('assert');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const UserStatusModel = require('../../src/models/user_status.model');

module.exports = () => {

    describe('UserStatusController tests', () => {
        const MockModels = makeMockModels({
            User_status: {
                create: sinon.stub(),
                findOne: sinon.stub()
            }
        });
        const UserStatusController = proxyquire('../../src/controllers/user_status.controller', {
            '../models': MockModels
        });

        describe('Loading models...', () => {
            const Model = UserStatusModel(sequelize, dataTypes);
            checkModelName(Model)('User_status');
        });

        describe('#findUserStatusFromName(status)', () => {
            afterEach(() => {
                // TEARDOWN
                MockModels.User_status.create.resetHistory();
                MockModels.User_status.findOne.resetHistory();
            });

            it('should return a User_status with valid status', async () => {
                // SETUP
                const userValue = 'user';
                const fakeUserStatus = {
                    id: 1,
                    status: userValue
                };
                MockModels.User_status.findOne.resolves(fakeUserStatus);

                // CALL
                const userStatus = await UserStatusController.findUserStatusFromName(userValue);

                // VERIFY
                assert.notEqual(userStatus, null);
                assert.equal(userStatus.id, fakeUserStatus.id);
                assert.equal(userStatus.status, fakeUserStatus.status);
            });

            it('should return null with invalid status', async () => {
                // SETUP
                MockModels.User_status.findOne.resolves(null);

                // CALL
                const userStatus = await UserStatusController.findUserStatusFromName("invalidStatus");

                // VERIFY
                assert.equal(userStatus, null);
            });
        });
    });

};
