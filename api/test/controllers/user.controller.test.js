const assert = require('assert');
const {describe, it, before, beforeEach, after, afterEach} = require('mocha');
const mock = require('mock-require');

const bootSequelize = require('../../src/boot_sequelize');
const {UserController, UserStatusController} = require('../../src/controllers');

module.exports = () => {

    describe('UserController tests', () => {
        const userId = 1;
        const userName = 'test';
        const userEmail = 'test@gmail.com';
        const userLogin = 'test1234';
        const userPassword = '1234test';

        beforeEach('Booting sequelize...', () => bootSequelize());

        describe('#createUser(name, email, login, password)', () => {
            it('should return true with valid inputs', async () => {
                // SETUP
                const emailValidatorMock = {
                    validate: (email) => true
                };
                mock('email-validator', emailValidatorMock);
                await UserStatusController.createStatusForUsers();

                // CALL
                const result = await UserController.createUser(userName, userEmail, userLogin, userPassword);

                // VERIFY
                assert.equal(result, true);

                // TEARDOWN
                mock.stop('email-validator');
            });

            it('should return false with invalid email input', async () => {
                // SETUP
                const emailValidatorMock = {
                    validate: (email) => false
                };
                mock('email-validator', emailValidatorMock);

                // CALL
                const result = await UserController.createUser(userName, "", userLogin, userPassword);

                // VERIFY
                assert.equal(result, false);

                // TEARDOWN
                mock.stop('email-validator');
            });
        });

        describe('#findAllUsers()', () => {
            it('should return a list of users', async () => {
                // SETUP
                await UserStatusController.createStatusForUsers();
                await UserController.createUser(userName, userEmail, userLogin, userPassword);

                // CALL
                const users = await UserController.findAllUsers();

                // VERIFY
                assert.equal(users.length, 1);
                assert.equal(users[0].name, userName);
                assert.equal(users[0].email, userEmail);
                assert.equal(users[0].login, userLogin);
            });

            it('should return an empty list of users', async () => {
                // SETUP
                await UserStatusController.createStatusForUsers();

                // CALL
                const users = await UserController.findAllUsers();

                // VERIFY
                assert.equal(users.length, 0);
            });
        });

        describe('#findOneUserFromId(id)', () => {
            it('should return one existing user', async () => {
                // SETUP
                await UserStatusController.createStatusForUsers();
                await UserController.createUser(userName, userEmail, userLogin, userPassword);

                // CALL
                const user = await UserController.findOneUserFromId(userId);

                // VERIFY
                assert.notEqual(user, null);
                assert.equal(user.id, userId);
                assert.equal(user.name, userName);
                assert.equal(user.email, userEmail);
                assert.equal(user.login, userLogin);
            });

            it('should return null if user doesn\'t exist', async () => {
                // SETUP
                await UserStatusController.createStatusForUsers();

                // CALL
                const user = await UserController.findOneUserFromId(userId);

                // VERIFY
                assert.equal(user, null);
            });
        });

        describe('#removeUserFromId(id)', () => {
            it('should return true with valid id', async () => {
                // SETUP
                await UserStatusController.createStatusForUsers();
                await UserController.createUser(userName, userEmail, userLogin, userPassword);

                // CALL
                const result = await UserController.removeUserFromId(userId);

                // VERIFY
                assert.equal(result, true);
            });

            it('should return false with invalid id', async () => {
                // SETUP
                await UserStatusController.createStatusForUsers();

                // CALL
                const result = await UserController.removeUserFromId(userId);

                // VERIFY
                assert.equal(result, false);
            });
        });

        describe('#updateUserFromId(id, name, email, password)', () => {
            it('should return true with valid inputs', async () => {
                // SETUP
                const userNameUpdated = "updated!";
                const userEmailUpdated = "updated@test.fr";
                const userPasswordUpdated = "updatedpwd";
                await UserStatusController.createStatusForUsers();
                await UserController.createUser(userName, userEmail, userLogin, userPassword);

                // CALL
                const result = await UserController.updateUserFromId(
                    userId, userNameUpdated, userEmailUpdated, userPasswordUpdated
                );

                // VERIFY
                assert.equal(result, true);
                const user = await UserController.findOneUserFromId(userId);
                assert.equal(user.name, userNameUpdated);
                assert.equal(user.email, userEmailUpdated);
            });

            it('should return true with one valid input (name)', async () => {
                // SETUP
                const userNameUpdated = "updated!";
                await UserStatusController.createStatusForUsers();
                await UserController.createUser(userName, userEmail, userLogin, userPassword);

                // CALL
                const result = await UserController.updateUserFromId(userId, userNameUpdated, "", "");

                // VERIFY
                assert.equal(result, true);
                const user = await UserController.findOneUserFromId(userId);
                assert.equal(user.name, userNameUpdated);
                assert.equal(user.email, userEmail);
            });

            it('should return false with invalid id', async () => {
                // SETUP
                await UserStatusController.createStatusForUsers();

                // CALL
                const result = await UserController.updateUserFromId(userId, "", "", "");

                // VERIFY
                assert.equal(result, false);
            });

            it('should return false with invalid email', async () => {
                // SETUP
                const userEmailUpdated = "updated!";
                await UserStatusController.createStatusForUsers();
                await UserController.createUser(userName, userEmail, userLogin, userPassword);

                // CALL
                const result = await UserController.updateUserFromId(userId, "", userEmailUpdated, "");

                // VERIFY
                assert.equal(result, false);
                const user = await UserController.findOneUserFromId(userId);
                assert.equal(user.name, userName);
                assert.equal(user.email, userEmail);
            });

            it('should return false with empty inputs', async () => {
                // SETUP
                await UserStatusController.createStatusForUsers();
                await UserController.createUser(userName, userEmail, userLogin, userPassword);

                // CALL
                const result = await UserController.updateUserFromId(userId, "", "", "");

                // VERIFY
                assert.equal(result, false);
                const user = await UserController.findOneUserFromId(userId);
                assert.equal(user.name, userName);
                assert.equal(user.email, userEmail);
            });
        });
    });

};
