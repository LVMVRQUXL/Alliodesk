const {describe, it, before, afterEach, after} = require('mocha');
const assert = require('assert');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const SecurityUtil = require('../../src/utils').SecurityUtil;

module.exports = () => {

    describe('UserController tests', () => {
        const MockDependencies = {
            Services: {
                UserService: {
                    create: sinon.stub(),
                    destroy: sinon.stub(),
                    findAll: sinon.stub(),
                    findOne: sinon.stub(),
                    mapToDTO: sinon.stub(),
                    update: sinon.stub(),
                    updateOneUser: sinon.stub()
                }
            },
            UserStatusController: {
                userValue: 'user',
                findUserStatusFromName: sinon.stub()
            }
        };

        const UserController = proxyquire('../../src/controllers/user.controller', {
            '../services': MockDependencies.Services,
            './user_status.controller': MockDependencies.UserStatusController
        });

        const userId = 1;
        const userName = 'test';
        const userEmail = 'test@gmail.com';
        const userLogin = 'testLogin';
        const userPassword = 'testPwd';
        const userTokenSession = 'zzzzzzzzzz';
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

        describe('#createUser(name, email, login, password)', () => {
            afterEach(() => MockDependencies.Services.UserService.findOne.resetHistory());

            const _setupUserServiceFindOne = (user) => MockDependencies.Services.UserService.findOne.resolves(user);
            const _setupUserServiceMapToDTO = (user) => MockDependencies.Services.UserService.mapToDTO.resolves(user);
            const _call = async (name, email, login, password) => await UserController.createUser(
                name, email, login, password
            );
            const _teardownUserServiceMapToDTO = () => MockDependencies.Services.UserService.mapToDTO.resetHistory();

            it('should return true with valid inputs', async () => {
                // SETUP
                _setupUserServiceFindOne();
                MockDependencies.Services.UserService.create.resolves(true);

                // CALL
                const result = await _call(userName, userEmail, userLogin, userPassword);

                // VERIFY
                assert.equal(result, true);

                // TEARDOWN
                MockDependencies.Services.UserService.create.resetHistory();
            });

            it('should return false if an existing user already use the given email', async () => {
                // SETUP
                _setupUserServiceFindOne(fakeUser);
                _setupUserServiceMapToDTO(fakeUser);

                // CALL
                const result = await _call(userName, userEmail, userLogin, userPassword);

                // VERIFY
                assert.equal(result, false);

                // TEARDOWN
                _teardownUserServiceMapToDTO();
            });

            it('should return false if an existing user already use the given login', async () => {
                // SETUP
                UserController.findOneUserFromEmail = sinon.stub();
                UserController.findOneUserFromEmail.resolves();
                _setupUserServiceFindOne(fakeUser);
                _setupUserServiceMapToDTO(fakeUser);

                // CALL
                const result = await _call(userName, userEmail, userLogin, userPassword);

                // VERIFY
                assert.equal(result, false);

                // TEARDOWN
                UserController.findOneUserFromEmail.resetHistory();
                _teardownUserServiceMapToDTO();
            });
        });

        describe('#findAllUsers()', () => {
            afterEach(() => {
                MockDependencies.Services.UserService.findAll.resetHistory();
                MockDependencies.Services.UserService.mapToDTO.resetHistory();
            });

            const _setupUserServiceFindAll = (array) => MockDependencies.Services.UserService.findAll.resolves(array);
            const _setupUserServiceMapToDTO = (user) => MockDependencies.Services.UserService.mapToDTO.resolves(user);
            const _call = async () => await UserController.findAllUsers();

            it('should return a singleton list of users', async () => {
                // SETUP
                _setupUserServiceFindAll([fakeUser]);
                _setupUserServiceMapToDTO(fakeUser);

                // CALL
                const users = await _call();

                // VERIFY
                assert.equal(users.length, 1);
                assert.equal(users[0].id, fakeUser.id);
            });

            it('should return an empty list of users', async () => {
                // SETUP
                _setupUserServiceFindAll([]);
                _setupUserServiceMapToDTO();

                // CALL
                const users = await _call();

                // VERIFY
                assert.equal(users.length, 0);
            });
        });

        describe('#findOneUserFromId(id)', () => {
            afterEach(() => MockDependencies.Services.UserService.findOne.resetHistory());

            const _setupUserServiceFindOne = (user) => MockDependencies.Services.UserService.findOne.resolves(user);
            const _call = async () => await UserController.findOneUserFromId(userId);

            it('should return one existing user', async () => {
                // SETUP
                _setupUserServiceFindOne(fakeUser);
                MockDependencies.Services.UserService.mapToDTO.resolves(fakeUser);

                // CALL
                const user = await _call();

                // VERIFY
                assert.notEqual(user, null);
                assert.deepEqual(user, fakeUser);

                // TEARDOWN
                MockDependencies.Services.UserService.mapToDTO.resetHistory();
            });

            it('should return null if user doesn\'t exist', async () => {
                // SETUP
                _setupUserServiceFindOne();

                // CALL
                const user = await _call();

                // VERIFY
                assert.equal(user, null);
            });
        });

        describe('#loginOneUser(login, password)', () => {
            afterEach(() => MockDependencies.Services.UserService.findOne.resetHistory());

            const _setupUserServiceFindOne = (user) => MockDependencies.Services.UserService.findOne.resolves(user);
            const _call = async (login, password) => await UserController.loginOneUser(login, password);

            it('should return a token with valid inputs', async () => {
                // SETUP
                _setupUserServiceFindOne({
                    fakeUser,
                    password: SecurityUtil.hash(userPassword)
                });
                MockDependencies.Services.UserService.update.resolves(true);

                // CALL
                const token = await _call(userLogin, userPassword);

                // VERIFY
                assert.notEqual(token, undefined);

                // TEARDOWN
                MockDependencies.Services.UserService.update.resetHistory();
            });

            it('should return undefined with invalid login', async () => {
                // SETUP
                _setupUserServiceFindOne();

                // CALL
                const token = await _call(userLogin, userPassword);

                // VERIFY
                assert.equal(token, undefined);
            });

            it('should return undefined with user already logged in', async () => {
                // SETUP
                _setupUserServiceFindOne({
                    fakeUser,
                    token_session: 'zzzzzzzzzz'
                });

                // CALL
                const token = await _call(userLogin, userPassword);

                // VERIFY
                assert.equal(token, undefined);
            });

            it('should return undefined with invalid password', async () => {
                // SETUP
                _setupUserServiceFindOne({
                    fakeUser,
                    password: SecurityUtil.hash('userPassword')
                });

                // CALL
                const token = await _call(userLogin, userPassword);

                // VERIFY
                assert.equal(token, undefined);
            });
        });

        describe('#logoutOneUser(id, token)', () => {
            afterEach(() => MockDependencies.Services.UserService.findOne.resetHistory());

            const _setupUserServiceFindOne = (user) => MockDependencies.Services.UserService.findOne.resolves(user);
            const _call = async (id, token) => await UserController.logoutOneUser(id, token);

            it('should return true with valid inputs', async () => {
                // SETUP
                _setupUserServiceFindOne({
                    fakeUser,
                    token_session: userTokenSession
                });
                MockDependencies.Services.UserService.update.resolves(true);

                // CALL
                const result = await _call(userId, userTokenSession);

                // VERIFY
                assert.equal(result, true);

                // TEARDOWN
                MockDependencies.Services.UserService.update.resetHistory();
            });

            it('should return false with invalid id', async () => {
                // SETUP
                _setupUserServiceFindOne();

                // CALL
                const result = await _call(userId, userTokenSession);

                // VERIFY
                assert.equal(result, undefined);
            });

            it('should return false with invalid token', async () => {
                // SETUP
                _setupUserServiceFindOne({
                    fakeUser,
                    token_session: 'userTokenSession'
                });

                // CALL
                const result = await _call(userId, userTokenSession);

                // VERIFY
                assert.equal(result, undefined);
            });
        });

        describe('#removeUserFromId(id)', () => {
            afterEach(() => MockDependencies.Services.UserService.findOne.resetHistory());

            const _setupUserServiceFindOne = (user) => MockDependencies.Services.UserService.findOne.resolves(user);
            const _call = async () => await UserController.removeUserFromId(userId);

            it('should return true with id of an existing user', async () => {
                // SETUP
                _setupUserServiceFindOne(fakeUser);
                MockDependencies.Services.UserService.destroy.resolves(true);

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, true);

                // TEARDOWN
                MockDependencies.Services.UserService.destroy.resetHistory();
            });

            it('should return false with invalid id', async () => {
                // SETUP
                _setupUserServiceFindOne();

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, false);
            });
        });

        describe('#updateUserInfosFromId(id, name, email, password)', () => {
            afterEach(() => MockDependencies.Services.UserService.findOne.resetHistory());

            const _setupUserServiceFindOne = (user) => MockDependencies.Services.UserService.findOne.resolves(user);
            const _setupUserServiceUpdateOneUser = () => {
                MockDependencies.Services.UserService.updateOneUser.resolves(true);
            };
            const call = async (id, name, email, password) => await UserController.updateUserInfosFromId(
                id, name, email, password
            );
            const _teardownUserServiceUpdateOneUser = () => {
                MockDependencies.Services.UserService.updateOneUser.resetHistory();
            };

            it('should return true with valid inputs', async () => {
                // SETUP
                UserController.findOneUserFromEmail = sinon.stub();
                UserController.findOneUserFromEmail.resolves();
                _setupUserServiceFindOne(fakeUser);
                _setupUserServiceUpdateOneUser(true);

                // CALL
                const result = await call(userId, userName + userName, "new@mail.com", userPassword);

                // VERIFY
                assert.equal(result, true);

                // TEARDOWN
                UserController.findOneUserFromEmail.resetHistory();
                _teardownUserServiceUpdateOneUser();
            });

            it('should return true with one valid input (name)', async () => {
                // SETUP
                _setupUserServiceFindOne(fakeUser);
                _setupUserServiceUpdateOneUser(true);

                // CALL
                const result = await call(userId, `updated${userName}`, null, "");

                // VERIFY
                assert.equal(result, true);

                // TEARDOWN
                _teardownUserServiceUpdateOneUser();
            });

            it('should return false with invalid id', async () => {
                // SETUP
                _setupUserServiceFindOne();

                // CALL
                const result = await call(userId, userName, userEmail, userPassword);

                // VERIFY
                assert.equal(result, false);
            });
        });
    });

};
