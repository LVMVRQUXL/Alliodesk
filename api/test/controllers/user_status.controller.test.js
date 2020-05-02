const assert = require('assert');
const {describe, it, beforeEach} = require('mocha');

const bootSequelize = require('../../src/boot_sequelize');
const UserStatusController = require('../../src/controllers').UserStatusController;

module.exports = () => {

    describe('UserStatusController tests', () => {
        beforeEach('Booting sequelize...', () => bootSequelize());

        describe('findUserStatusFromName(status)', () => {

            it('should return a User_status with valid status', async () => {
                // SETUP
                await UserStatusController.createStatusForAdmins();
                await UserStatusController.createStatusForUsers();

                // CALL
                const adminStatus = await UserStatusController.findUserStatusFromName(
                    UserStatusController.adminValue
                );
                const userStatus = await UserStatusController.findUserStatusFromName(
                    UserStatusController.userValue
                );

                // VERIFY
                assert.notEqual(adminStatus, null);
                assert.equal(adminStatus.status, UserStatusController.adminValue);

                assert.notEqual(userStatus, null);
                assert.equal(userStatus.status, UserStatusController.userValue);
            });

            it('should return null with invalid status', async () => {
                // CALL
                const userStatus = await UserStatusController.findUserStatusFromName(
                    UserStatusController.userValue
                );

                // VERIFY
                assert.equal(userStatus, null);
            });

        });

    });

};
