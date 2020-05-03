const {sequelize, dataTypes, checkModelName, makeMockModels} = require('sequelize-test-helpers');
const {describe, it, before, afterEach, after} = require('mocha');
const assert = require('assert');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const UserModel = require('../../src/models/user.model');

module.exports = () => {

    describe('UserController tests', () => {
        const MockModels = makeMockModels({
            User: {
                create: sinon.stub(),
                destroy: sinon.stub(),
                findAll: sinon.stub(),
                findOne: sinon.stub(),
                update: sinon.stub()
            }
        });
        const MockDependencies = {
            EmailValidator: {
                validate: (email) => {}
            },
            UserStatusController: {
                userValue: 'user',
                findUserStatusFromName: sinon.stub()
            },
            Utils: {
                SecurityUtil: {
                    hash: (password) => {}
                }
            }
        };

        const UserController = proxyquire('../../src/controllers/user.controller', {
            '../models': MockModels,
            'email-validator': MockDependencies.EmailValidator,
            './user_status.controller': MockDependencies.UserStatusController,
            '../utils': MockDependencies.Utils
        });

        const userId = 1;
        const userName = 'test';
        const userEmail = 'test@gmail.com';
        const userLogin = 'testLogin';
        const userPassword = 'testPwd';
        const fakeUserStatus = {
            id: 1,
            status: MockDependencies.UserStatusController.userValue
        };
        const fakeUser = {
            id: userId,
            name: userName,
            email: userEmail,
            login: userLogin
        };

        describe('Loading models...', () => {
            const Model = UserModel(sequelize, dataTypes);
            checkModelName(Model)('User');
        });

        describe('#createUser(name, email, login, password)', () => {
            afterEach(() => {
                // TEARDOWN
                MockDependencies.EmailValidator.validate = (email) => {};
            });

            it('should return true with valid inputs', async () => {
                // SETUP
                MockDependencies.EmailValidator.validate = (email) => true;
                MockModels.User.create.resolves();
                MockDependencies.UserStatusController.findUserStatusFromName.resolves(fakeUserStatus);
                MockDependencies.Utils.SecurityUtil.hash = (password) => `hash${password}`;

                // CALL
                const result = await UserController.createUser(userName, userEmail, userLogin, userPassword);

                // VERIFY
                assert.equal(result, true);

                // TEARDOWN
                MockModels.User.create.resetHistory();
                MockDependencies.UserStatusController.findUserStatusFromName.resetHistory();
                MockDependencies.Utils.SecurityUtil.hash = (password) => {};
            });

            it('should return false with invalid email', async () => {
                // SETUP
                MockDependencies.EmailValidator.validate = (email) => false;

                // CALL
                const result = await UserController.createUser(userName, "", userLogin, userPassword);

                // VERIFY
                assert.equal(result, false);
            });

            it('should return false if an existing user already use the given email', async () => {
                // SETUP
                MockDependencies.EmailValidator.validate = (email) => true;
                MockDependencies.UserStatusController.findUserStatusFromName.resolves(fakeUserStatus);
                MockModels.User.findOne.resolves(fakeUser);

                // CALL
                const result = await UserController.createUser(userName, "", userLogin, userPassword);

                // VERIFY
                assert.equal(result, false);

                // TEARDOWN
                MockDependencies.UserStatusController.findUserStatusFromName.resetHistory();
                MockModels.User.findOne.resetHistory();
            });

            it('should return false if an existing user already use the given login', async () => {
                // SETUP
                MockDependencies.EmailValidator.validate = (email) => true;
                UserController.findOneUserFromEmail = sinon.stub();
                UserController.findOneUserFromEmail.resolves(null);
                MockDependencies.UserStatusController.findUserStatusFromName.resolves(fakeUserStatus);
                MockModels.User.findOne.resolves(fakeUser);

                // CALL
                const result = await UserController.createUser(userName, "", userLogin, userPassword);

                // VERIFY
                assert.equal(result, false);

                // TEARDOWN
                UserController.findOneUserFromEmail.resetHistory();
                MockDependencies.UserStatusController.findUserStatusFromName.resetHistory();
                MockModels.User.findOne.resetHistory();
            });
        });

        describe('#findAllUsers()', () => {
            before(() => {
                // SETUP
                MockDependencies.UserStatusController.findUserStatusFromName.resolves(fakeUserStatus);
            });

            afterEach(() => {
                // TEARDOWN
                MockModels.User.findAll.resetHistory();
            });

            after(() => {
                // TEARDOWN
                MockDependencies.UserStatusController.findUserStatusFromName.resetHistory();
            });

            it('should return a singleton list of users', async () => {
                // SETUP
                MockModels.User.findAll.resolves([fakeUser]);

                // CALL
                const users = await UserController.findAllUsers();

                // VERIFY
                assert.equal(users.length, 1);
                assert.deepEqual(users[0], fakeUser);
            });

            it('should return an empty list of users', async () => {
                // SETUP
                MockModels.User.findAll.resolves([]);

                // CALL
                const users = await UserController.findAllUsers();

                // VERIFY
                assert.equal(users.length, 0);
            });
        });

        describe('#findOneUserFromId(id)', () => {
            before(() => {
                // SETUP
                MockDependencies.UserStatusController.findUserStatusFromName.resolves(fakeUserStatus);
            });

            afterEach(() => {
                // TEARDOWN
                MockModels.User.findOne.resetHistory();
            });

            after(() => {
                // TEARDOWN
                MockDependencies.UserStatusController.findUserStatusFromName.resetHistory();
            });

            it('should return one existing user', async () => {
                // SETUP
                MockModels.User.findOne.resolves(fakeUser);

                // CALL
                const user = await UserController.findOneUserFromId(userId);

                // VERIFY
                assert.notEqual(user, null);
                assert.deepEqual(user, fakeUser);
            });

            it('should return null if user doesn\'t exist', async () => {
                // SETUP
                MockModels.User.findOne.resolves();

                // CALL
                const user = await UserController.findOneUserFromId(userId);

                // VERIFY
                assert.equal(user, null);
            });
        });

        describe('#removeUserFromId(id)', () => {
            before(() => {
                // SETUP
                MockDependencies.UserStatusController.findUserStatusFromName.resolves(fakeUserStatus);
            });

            afterEach(() => {
                // TEARDOWN
                MockModels.User.findOne.resetHistory();
            });

            after(() => {
                // TEARDOWN
                MockDependencies.UserStatusController.findUserStatusFromName.resetHistory();
            });

            it('should return true with id of an existing user', async () => {
                // SETUP
                MockModels.User.findOne.resolves(fakeUser);
                MockModels.User.destroy.resolves();

                // CALL
                const result = await UserController.removeUserFromId(userId);

                // VERIFY
                assert.equal(result, true);

                // TEARDOWN
                MockModels.User.destroy.resetHistory();
            });

            it('should return false with invalid id', async () => {
                // SETUP
                MockModels.User.findOne.resolves();

                // CALL
                const result = await UserController.removeUserFromId(userId);

                // VERIFY
                assert.equal(result, false);
            });
        });

        describe('#updateUserFromId(id, name, email, password)', () => {
            afterEach(() => {
                // TEARDOWN
                MockDependencies.EmailValidator.validate = (email) => {};
            });

            it('should return true with valid inputs', async () => {
                // SETUP
                MockDependencies.EmailValidator.validate = (email) => true;
                UserController.findOneUserFromEmail = sinon.stub();
                UserController.findOneUserFromEmail.resolves(null);
                MockDependencies.UserStatusController.findUserStatusFromName.resolves(fakeUserStatus);
                MockModels.User.findOne.resolves(fakeUser);
                MockDependencies.Utils.SecurityUtil.hash = (password) => `hash${password}`;
                MockModels.User.update.resolves();

                // CALL
                const result = await UserController.updateUserFromId(userId, userName + userName, userEmail, userPassword);

                // VERIFY
                assert.equal(result, true);

                // TEARDOWN
                UserController.findOneUserFromEmail.resetHistory();
                MockDependencies.UserStatusController.findUserStatusFromName.resetHistory();
                MockModels.User.findOne.resetHistory();
                MockDependencies.Utils.SecurityUtil.hash = (password) => {};
                MockModels.User.update.resetHistory();
            });

            it('should return true with one valid input (name)', async () => {
                // SETUP
                MockDependencies.EmailValidator.validate = (email) => true;
                MockDependencies.UserStatusController.findUserStatusFromName.resolves(fakeUserStatus);
                MockModels.User.findOne.resolves(fakeUser);
                MockModels.User.update.resolves();

                // CALL
                const result = await UserController.updateUserFromId(userId, `updated${userName}`, "", "");

                // VERIFY
                assert.equal(result, true);

                // TEARDOWN
                MockDependencies.UserStatusController.findUserStatusFromName.resetHistory();
                MockModels.User.findOne.resetHistory();
                MockModels.User.update.resetHistory();
            });

            it('should return false with invalid id', async () => {
                // SETUP
                MockDependencies.EmailValidator.validate = (email) => true;
                MockDependencies.UserStatusController.findUserStatusFromName.resolves(fakeUserStatus);
                MockModels.User.findOne.resolves();

                // CALL
                const result = await UserController.updateUserFromId(userId, userName, userEmail, userPassword);

                // VERIFY
                assert.equal(result, false);

                // TEARDOWN
                MockDependencies.UserStatusController.findUserStatusFromName.resetHistory();
                MockModels.User.findOne.resetHistory();
            });

            it('should return false with invalid email', async () => {
                // SETUP
                MockDependencies.EmailValidator.validate = (email) => false;

                // CALL
                const result = await UserController.updateUserFromId(userId, userName, userName, userPassword);

                // VERIFY
                assert.equal(result, false);
            });

            it('should return false with empty inputs', async () => {
                // CALL
                const result = await UserController.updateUserFromId(userId, "", "", "");

                // VERIFY
                assert.equal(result, false);
            });
        });
    });

};
