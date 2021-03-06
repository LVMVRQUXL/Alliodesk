const {describe, it, before, afterEach, after} = require('mocha');
const assert = require('assert');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const SecurityUtil = require('../../../../src/v1/utils').SecurityUtil;

module.exports = () => {

    describe('UserController', () => {
        const MockDependencies = {
            Services: {
                ServiceService: {
                    findOne: sinon.stub(),
                    mapToDTO: sinon.stub()
                },
                UserService: {
                    create: sinon.stub(),
                    destroy: sinon.stub(),
                    findAll: sinon.stub(),
                    findOne: sinon.stub(),
                    mapToDTO: sinon.stub(),
                    update: sinon.stub(),
                    updateOneUser: sinon.stub()
                },
                WorkspaceService: {
                    mapToDTO: sinon.stub()
                }
            },
            ServiceStatusController: {
                findServiceStatusFromValue: sinon.stub(),
                validatedStatus: 'validated'
            },
            UserStatusController: {
                userValue: 'user',
                findUserStatusFromName: sinon.stub()
            }
        };

        const UserController = proxyquire('../../../../src/v1/controllers/user.controller', {
            '../services': MockDependencies.Services,
            './service_status.controller': MockDependencies.ServiceStatusController,
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
        const fakeWorkspace = {
            id: 1,
            name: 'Fake Workspace',
            description: 'No description',
            UserId: fakeUser.id
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

            it('should return the created user with valid inputs', async () => {
                // SETUP
                _setupUserServiceFindOne();
                MockDependencies.Services.UserService.create.resolves(fakeUser);
                _setupUserServiceMapToDTO(fakeUser);

                // CALL
                const user = await _call(userName, userEmail, userLogin, userPassword);

                // VERIFY
                assert.equal(user, fakeUser);

                // TEARDOWN
                MockDependencies.Services.UserService.create.resetHistory();
                _teardownUserServiceMapToDTO();
            });

            it('should return null if an existing user already use the given email', async () => {
                // SETUP
                _setupUserServiceFindOne(fakeUser);
                _setupUserServiceMapToDTO(fakeUser);

                // CALL
                const user = await _call(userName, userEmail, userLogin, userPassword);

                // VERIFY
                assert.equal(user, null);

                // TEARDOWN
                _teardownUserServiceMapToDTO();
            });

            it('should return null if an existing user already use the given login', async () => {
                // SETUP
                UserController.findOneUserFromEmail = sinon.stub();
                UserController.findOneUserFromEmail.resolves();
                _setupUserServiceFindOne(fakeUser);
                _setupUserServiceMapToDTO(fakeUser);

                // CALL
                const user = await _call(userName, userEmail, userLogin, userPassword);

                // VERIFY
                assert.equal(user, null);

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

        describe('#findAllWorkspacesOfOneUserFromId(userId)', () => {
            afterEach(() => MockDependencies.Services.UserService.findOne.resetHistory());

            const _setup_fakeUser_getWorkspaces = (array) => {
                fakeUser.getWorkspaces = sinon.stub();
                fakeUser.getWorkspaces.resolves(array);
            };
            const _setup_UserService_findOne = (user) => {
                MockDependencies.Services.UserService.findOne.resolves(user);
            };
            const _setup_WorkspaceService_mapToDTO = (workspace) => {
                MockDependencies.Services.WorkspaceService.mapToDTO.returns(workspace);
            };

            const _call = async () => await UserController.findAllWorkspacesOfOneUserFromId(fakeUser.id);

            const _teardown_fakeUser_getWorkspaces = () => fakeUser.getWorkspaces.resetHistory();
            const _teardown_WorkspaceService_mapToDTO = () => {
                MockDependencies.Services.WorkspaceService.mapToDTO.resetHistory();
            };

            it('should return a singleton list of workspaces with valid inputs', async () => {
                // SETUP
                _setup_UserService_findOne(fakeUser);
                _setup_fakeUser_getWorkspaces([fakeWorkspace]);
                _setup_WorkspaceService_mapToDTO(fakeWorkspace);

                // CALL
                const workspaces = await _call();

                // VERIFY
                assert.notEqual(workspaces, undefined);
                assert.equal(workspaces.length, 1);
                assert.deepEqual(workspaces[0], fakeWorkspace);

                // TEARDOWN
                _teardown_fakeUser_getWorkspaces();
                _teardown_WorkspaceService_mapToDTO();
            });

            it('should return an empty list of workspaces with valid inputs', async () => {
                // SETUP
                _setup_UserService_findOne(fakeUser);
                _setup_fakeUser_getWorkspaces([]);
                _setup_WorkspaceService_mapToDTO();

                // CALL
                const workspaces = await _call();

                // VERIFY
                assert.notEqual(workspaces, undefined);
                assert.equal(workspaces.length, 0);

                // TEARDOWN
                _teardown_fakeUser_getWorkspaces();
                _teardown_WorkspaceService_mapToDTO();
            });

            it('should return undefined with invalid user\'s id', async () => {
                // SETUP
                _setup_UserService_findOne();

                // CALL
                const workspaces = await _call();

                // VERIFY
                assert.equal(workspaces, undefined);
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

            it('should return undefined with invalid id', async () => {
                // SETUP
                _setupUserServiceFindOne();

                // CALL
                const result = await _call(userId, userTokenSession);

                // VERIFY
                assert.equal(result, undefined);
            });

            it('should return undefined with invalid token', async () => {
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
            const _call = async (id, name, email, password) => await UserController.updateUserInfosFromId(
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
                const result = await _call(userId, userName + userName, "new@mail.com", userPassword);

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
                const result = await _call(userId, `updated${userName}`, null, "");

                // VERIFY
                assert.equal(result, true);

                // TEARDOWN
                _teardownUserServiceUpdateOneUser();
            });

            it('should return false with invalid id', async () => {
                // SETUP
                _setupUserServiceFindOne();

                // CALL
                const result = await _call(userId, userName, userEmail, userPassword);

                // VERIFY
                assert.equal(result, false);
            });
        });
    });

};
