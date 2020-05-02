const assert = require('assert');
const {describe, it, before, beforeEach, after, afterEach} = require('mocha');
const mockery = require('mockery');

const bootSequelize = require('../../src/boot_sequelize');
const {UserController, UserStatusController} = require('../../src/controllers');

module.exports = () => {

    describe('User controller tests', () => {
        before('Enabling mockery...', () => mockery.enable());

        beforeEach('Booting sequelize...', () => bootSequelize());

        describe('createUser(name, email, login, password) tests', () => {
            const userName = 'test';
            const userEmail = 'test@gmail.com';
            const userLogin = 'test1234';
            const userPassword = '1234test';

            it('should return true with valid inputs', async () => {
                // SETUP
                const emailValidatorMock = {
                    validate: (email) => true
                };
                mockery.registerMock('email-validator', emailValidatorMock);
                await UserStatusController.createStatusForUsers();

                // CALL
                const result = await UserController.createUser(userName, userEmail, userLogin, userPassword);

                // VERIFY
                assert.equal(result, true);
            });

            it('should return false with invalid email input', async () => {
                // SETUP
                const emailValidatorMock = {
                    validate: (email) => false
                };
                mockery.registerMock('email-validator', emailValidatorMock);

                // CALL
                const result = await UserController.createUser(userName, "", userLogin, userPassword);

                // VERIFY
                assert.equal(result, false);
            });
        });

        describe('findAllUsers() tests', () => {
            it('should return a list of users', async () => {
                // SETUP
                const userName = 'test';
                const userEmail = 'test@gmail.com';
                const userLogin = 'test1234';
                const userPassword = '1234test';
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

        afterEach('Removing all registries from mockery...', () => mockery.deregisterAll());

        after('Disabling mockery...', () => mockery.disable());
    });

};
