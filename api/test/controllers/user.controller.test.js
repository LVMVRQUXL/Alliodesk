const {sequelize, dataTypes, checkModelName, makeMockModels} = require('sequelize-test-helpers');
const {describe, it, before, beforeEach, afterEach, after} = require('mocha');
const assert = require('assert');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const UserModel = require('../../src/models/user.model');
const SecurityUtil = require('../../src/utils').SecurityUtil;

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
            UserStatusController: {
                userValue: 'user',
                findUserStatusFromName: sinon.stub()
            }
        };

        const UserController = proxyquire('../../src/controllers/user.controller', {
            '../models': MockModels,
            './user_status.controller': MockDependencies.UserStatusController
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

        before(() => {
            // SETUP
            MockDependencies.UserStatusController.findUserStatusFromName.resolves(fakeUserStatus);
        });

        after(() => {
            // TEARDOWN
            MockDependencies.UserStatusController.findUserStatusFromName.resetHistory();
        });

        const _setupUserFindOne = (user) => MockModels.User.findOne.resolves(user);
        const _teardownUserFindOne = () => MockModels.User.findOne.resetHistory();

        describe('Loading models...', () => {
            const Model = UserModel(sequelize, dataTypes);
            checkModelName(Model)('User');
        });

        describe('#createUser(name, email, login, password)', () => {
            afterEach(() => _teardownUserFindOne());

            const call = async (name, email, login, password) => await UserController.createUser(
                name, email, login, password
            );

            it('should return true with valid inputs', async () => {
                // SETUP
                _setupUserFindOne();
                MockModels.User.create.resolves();

                // CALL
                const result = await call(userName, userEmail, userLogin, userPassword);

                // VERIFY
                assert.equal(result, true);

                // TEARDOWN
                MockModels.User.create.resetHistory();
            });

            it('should return false if an existing user already use the given email', async () => {
                // SETUP
                _setupUserFindOne(fakeUser);

                // CALL
                const result = await call(userName, userEmail, userLogin, userPassword);

                // VERIFY
                assert.equal(result, false);
            });

            it('should return false if an existing user already use the given login', async () => {
                // SETUP
                UserController.findOneUserFromEmail = sinon.stub();
                UserController.findOneUserFromEmail.resolves(null);
                _setupUserFindOne(fakeUser);

                // CALL
                const result = await call(userName, "another@email.com", userLogin, userPassword);

                // VERIFY
                assert.equal(result, false);

                // TEARDOWN
                UserController.findOneUserFromEmail.resetHistory();
            });
        });

        describe('#findAllUsers()', () => {
            afterEach(() => {
                // TEARDOWN
                MockModels.User.findAll.resetHistory();
            });

            const setupUserFindAll = (users) => MockModels.User.findAll.resolves(users);
            const call = async () => await UserController.findAllUsers();

            it('should return a singleton list of users', async () => {
                // SETUP
                setupUserFindAll([fakeUser]);

                // CALL
                const users = await call();

                // VERIFY
                assert.equal(users.length, 1);
                assert.deepEqual(users[0], fakeUser);
            });

            it('should return an empty list of users', async () => {
                // SETUP
                setupUserFindAll([]);

                // CALL
                const users = await call();

                // VERIFY
                assert.equal(users.length, 0);
            });
        });

        describe('#findOneUserFromId(id)', () => {
            afterEach(() => _teardownUserFindOne());

            const call = async () => await UserController.findOneUserFromId(userId);

            it('should return one existing user', async () => {
                // SETUP
                _setupUserFindOne(fakeUser);

                // CALL
                const user = await call();

                // VERIFY
                assert.notEqual(user, null);
                assert.deepEqual(user, fakeUser);
            });

            it('should return null if user doesn\'t exist', async () => {
                // SETUP
                _setupUserFindOne();

                // CALL
                const user = await call();

                // VERIFY
                assert.equal(user, null);
            });
        });

        describe('#loginOneUser(login, password)', () => {
            afterEach(() => _teardownUserFindOne());

            const call = async (login, password) => await UserController.loginOneUser(login, password);

            it('should return a token with valid inputs', async () => {
                // SETUP
                _setupUserFindOne({
                    fakeUser,
                    password: SecurityUtil.hash(userPassword)
                });
                MockModels.User.update.resolves();

                // CALL
                const token = await call(userLogin, userPassword);

                // VERIFY
                assert.notEqual(token, undefined);

                // TEARDOWN
                MockModels.User.update.resetHistory();
            });

            it('should return undefined with invalid login', async () => {
                // SETUP
                _setupUserFindOne();

                // CALL
                const token = await call(userLogin, userPassword);

                // VERIFY
                assert.equal(token, undefined);
            });

            it('should return undefined with invalid password', async () => {
                // SETUP
                _setupUserFindOne({
                    fakeUser,
                    password: SecurityUtil.hash('userPassword')
                });

                // CALL
                const token = await call(userLogin, userPassword);

                // VERIFY
                assert.equal(token, undefined);
            });
        });

        describe('#removeUserFromId(id)', () => {
            afterEach(() => _teardownUserFindOne());

            const call = async () => await UserController.removeUserFromId(userId);

            it('should return true with id of an existing user', async () => {
                // SETUP
                _setupUserFindOne(fakeUser);
                MockModels.User.destroy.resolves();

                // CALL
                const result = await call();

                // VERIFY
                assert.equal(result, true);

                // TEARDOWN
                MockModels.User.destroy.resetHistory();
            });

            it('should return false with invalid id', async () => {
                // SETUP
                _setupUserFindOne();

                // CALL
                const result = await call();

                // VERIFY
                assert.equal(result, false);
            });
        });

        describe('#updateUserInfosFromId(id, name, email, password)', () => {
            afterEach(() => _teardownUserFindOne());

            const setupUserUpdate = () => MockModels.User.update.resolves();
            const call = async (id, name, email, password) => await UserController.updateUserInfosFromId(
                id, name, email, password
            );
            const teardownUserUpdate = () => MockModels.User.update.resetHistory();

            it('should return true with valid inputs', async () => {
                // SETUP
                _setupUserFindOne(fakeUser);
                UserController.findOneUserFromEmail = sinon.stub();
                UserController.findOneUserFromEmail.resolves();
                setupUserUpdate();

                // CALL
                const result = await call(userId, userName + userName, "new@mail.com", userPassword);

                // VERIFY
                assert.equal(result, true);

                // TEARDOWN
                UserController.findOneUserFromEmail.resetHistory();
                teardownUserUpdate();
            });

            it('should return true with one valid input (name)', async () => {
                // SETUP
                _setupUserFindOne(fakeUser);
                setupUserUpdate();

                // CALL
                const result = await call(userId, `updated${userName}`, null, "");

                // VERIFY
                assert.equal(result, true);

                // TEARDOWN
                teardownUserUpdate();
            });

            it('should return false with invalid id', async () => {
                // SETUP
                _setupUserFindOne();

                // CALL
                const result = await call(userId, userName, userEmail, userPassword);

                // VERIFY
                assert.equal(result, false);
            });
        });
    });

};
