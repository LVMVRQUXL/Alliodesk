const {describe, it, before, beforeEach, afterEach, after} = require('mocha');
const assert = require('assert');
const sinon = require('sinon');
const proxyquire = require('proxyquire');

const SecurityUtil = require('../../src/utils').SecurityUtil;

module.exports = () => {

    describe('AdminController tests', () => {
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
                adminValue: 'admin',
                findUserStatusFromName: sinon.stub()
            }
        };

        const AdminController = proxyquire('../../src/controllers/admin.controller', {
            '../services': MockDependencies.Services,
            './user_status.controller': MockDependencies.UserStatusController
        });

        const adminId = 1;
        const adminName = 'test';
        const adminEmail = 'test@gmail.com';
        const adminLogin = 'testLogin';
        const adminPassword = 'testPwd';
        const adminTokenSession = 'zzzzzzzzzz';
        const fakeAdminStatus = {
            id: 1,
            status: MockDependencies.UserStatusController.userValue
        };
        const fakeAdmin = {
            id: adminId,
            name: adminName,
            email: adminEmail,
            login: adminLogin
        };

        before(() => {
            // SETUP
            MockDependencies.UserStatusController.findUserStatusFromName.resolves(fakeAdminStatus);
        });

        after(() => {
            // TEARDOWN
            MockDependencies.UserStatusController.findUserStatusFromName.resetHistory();
        });

        describe('#createAdmin(name, email, login, password)', () => {
            afterEach(() => MockDependencies.Services.UserService.findOne.resetHistory());

            const _setupUserServiceFindOne = (admin) => MockDependencies.Services.UserService.findOne.resolves(admin);
            const _setupUserServiceMapToDTO = () => MockDependencies.Services.UserService.mapToDTO.resolves(fakeAdmin);
            const _call = async () => await AdminController.createAdmin(
                adminName, adminEmail, adminLogin, adminPassword
            );
            const _teardownUserServiceMapToDTO = () => MockDependencies.Services.UserService.mapToDTO.resetHistory();

            it('should return true with valid inputs', async () => {
                // SETUP
                _setupUserServiceFindOne();
                MockDependencies.Services.UserService.create.resolves(true);

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, true);

                // TEARDOWN
                MockDependencies.Services.UserService.create.resetHistory();
            });

            it('should return false if an existing administrator already use the given email', async () => {
                // SETUP
                _setupUserServiceFindOne(fakeAdmin);
                _setupUserServiceMapToDTO();

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, false);

                // TEARDOWN
                _teardownUserServiceMapToDTO();
            });

            it('should return false if an existing administrator already use the given login', async () => {
                // SETUP
                AdminController.findOneAdminFromEmail = sinon.stub();
                AdminController.findOneAdminFromEmail.resolves();
                _setupUserServiceFindOne(fakeAdmin);
                _setupUserServiceMapToDTO();

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, false);

                // TEARDOWN
                AdminController.findOneAdminFromEmail.resetHistory();
                _teardownUserServiceMapToDTO();
            });
        });

        describe('#findAllAdmins()', () => {
            afterEach(() => {
                MockDependencies.Services.UserService.findAll.resetHistory();
                MockDependencies.Services.UserService.mapToDTO.resetHistory();
            });

            const _setupUserServiceFindAll = (array) => MockDependencies.Services.UserService.findAll.resolves(array);
            const _setupUserServiceMapToDTO = (admin) => MockDependencies.Services.UserService.mapToDTO.resolves(admin);
            const _call = async () => await AdminController.findAllAdmins();

            it('should return a singleton list of admins', async () => {
                // SETUP
                _setupUserServiceFindAll([fakeAdmin]);
                _setupUserServiceMapToDTO(fakeAdmin);

                // CALL
                const admins = await _call();

                // VERIFY
                assert.equal(admins.length, 1);
                assert.deepEqual(admins[0], fakeAdmin);
            });

            it('should return an empty list of users', async () => {
                // SETUP
                _setupUserServiceFindAll([]);
                _setupUserServiceMapToDTO();

                // CALL
                const admins = await _call();

                // VERIFY
                assert.equal(admins.length, 0);
            });
        });

        describe('#findOneAdminFromId(id)', () => {
            afterEach(() => MockDependencies.Services.UserService.findOne.resetHistory());

            const _setupUserServiceFindOne = (admin) => MockDependencies.Services.UserService.findOne.resolves(admin);
            const _call = async () => await AdminController.findOneAdminFromId(adminId);

            it('should return one existing administrator', async () => {
                // SETUP
                _setupUserServiceFindOne(fakeAdmin);
                MockDependencies.Services.UserService.mapToDTO.resolves(fakeAdmin);

                // CALL
                const admin = await _call();

                // VERIFY
                assert.deepEqual(admin, fakeAdmin);

                // TEARDOWN
                MockDependencies.Services.UserService.mapToDTO.resetHistory();
            });

            it('should return null if administrator with given id doesn\'t exist', async () => {
                // SETUP
                _setupUserServiceFindOne();

                // CALL
                const admin = await _call();

                // VERIFY
                assert.deepEqual(admin, null);
            });
        });

        describe('#loginOneAdmin(login, password)', () => {
            afterEach(() => MockDependencies.Services.UserService.findOne.resetHistory());

            const _setupUserServiceFindOne = (admin) => MockDependencies.Services.UserService.findOne.resolves(admin);
            const _call = async () => await AdminController.loginOneAdmin(adminLogin, adminPassword);

            it('should return a token with valid inputs', async () => {
                // SETUP
                _setupUserServiceFindOne({
                    fakeAdmin,
                    password: SecurityUtil.hash(adminPassword)
                });
                MockDependencies.Services.UserService.update.resolves(true);

                // CALL
                const token = await _call();

                // VERIFY
                assert.notEqual(token, undefined);

                // TEARDOWN
                MockDependencies.Services.UserService.update.resetHistory();
            });

            it('should return undefined with invalid login', async () => {
                // SETUP
                _setupUserServiceFindOne();

                // CALL
                const token = await _call();

                // VERIFY
                assert.equal(token, undefined);
            });

            it('should return undefined with administrator already logged in', async () => {
                // SETUP
                _setupUserServiceFindOne({
                    fakeAdmin,
                    token_session: adminTokenSession
                });

                // CALL
                const token = await _call();

                // VERIFY
                assert.equal(token, undefined);
            });

            it('should return undefined with invalid password', async () => {
                // SETUP
                _setupUserServiceFindOne({
                    fakeAdmin,
                    password: adminPassword
                });

                // CALL
                const token = await _call();

                // VERIFY
                assert.equal(token, undefined);
            });
        });

        describe('#logoutOneAdmin(id, token)', () => {
            afterEach(() => MockDependencies.Services.UserService.findOne.resetHistory());

            const _setupUserServiceFindOne = (admin) => MockDependencies.Services.UserService.findOne.resolves(admin);
            const _call = async () => await AdminController.logoutOneAdmin(adminId, adminTokenSession);

            it('should return true with valid inputs', async () => {
                // SETUP
                _setupUserServiceFindOne({
                    fakeAdmin,
                    token_session: adminTokenSession
                });
                MockDependencies.Services.UserService.update.resolves(true);

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, true);

                // TEARDOWN
                MockDependencies.Services.UserService.update.resetHistory();
            });

            it('should return undefined with invalid id', async () => {
                // SETUP
                _setupUserServiceFindOne();

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, undefined);
            });

            it('should return undefined with invalid token', async () => {
                // SETUP
                _setupUserServiceFindOne({
                    fakeAdmin,
                    token_session: 'adminTokenSession'
                });

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, undefined);
            });
        });

        describe('#removeAdminFromId(id)', () => {
            afterEach(() => MockDependencies.Services.UserService.findOne.resetHistory());

            const _setupUserServiceFindOne = (admin) => MockDependencies.Services.UserService.findOne.resolves(admin);
            const _call = async () => await AdminController.removeAdminFromId(adminId);

            it('should return true with id of an existing administrator', async () => {
                // SETUP
                _setupUserServiceFindOne(fakeAdmin);
                MockDependencies.Services.UserService.mapToDTO.resolves(fakeAdmin);
                MockDependencies.Services.UserService.destroy.resolves(true);

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, true);

                // TEARDOWN
                MockDependencies.Services.UserService.mapToDTO.resetHistory();
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

        describe('#updateAdminInfosFromId(id, name, email, password)', () => {
            beforeEach(() => {
                AdminController.findOneAdminFromEmail = sinon.stub();
                AdminController.findOneAdminFromEmail.resolves();
            });

            afterEach(() => {
                AdminController.findOneAdminFromEmail.resetHistory();
                MockDependencies.Services.UserService.findOne.resetHistory();
            });

            const _setupUserServiceFindOne = (admin) => MockDependencies.Services.UserService.findOne.resolves(admin);
            const _call = async (id, name, email, password) => await AdminController.updateAdminInfosFromId(
                id, name, email, password
            );

            it('should return true with valid inputs', async () => {
                // SETUP
                _setupUserServiceFindOne(fakeAdmin);
                MockDependencies.Services.UserService.updateOneUser.resolves(true);

                // CALL
                const result = await _call();

                // VERIFY
                assert.equal(result, true);

                // TEARDOWN
                MockDependencies.Services.UserService.updateOneUser.resetHistory();
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
    });

};
