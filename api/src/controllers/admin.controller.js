const UserService = require('../services').UserService;
const UserStatusController = require('./user_status.controller');
const SecurityUtil = require('../utils').SecurityUtil;

class AdminController {
    /**
     * Create a new administrator
     *
     * @param name {string}
     * @param email {string}
     * @param login {string}
     * @param password {string}
     *
     * @returns {Promise<boolean>}
     */
    async createAdmin(name, email, login, password) { // TODO: unit tests!
        if (await this.findOneAdminFromEmail(email) || await this.findOneAdminFromLogin(login)) {
            return false;
        }
        return await UserService.create(await _getAdminStatusId({
            name: name,
            email: email,
            login: login,
            password: SecurityUtil.hash(password)
        }));
    }

    /**
     * Find all administrators
     *
     * @returns {Promise<UserDTO[]>}
     */
    async findAllAdmins() { // TODO: unit tests!
        const admins = await UserService.findAll(await _getAdminStatusId({}));
        admins.map(user => UserService.mapToDTO(user));
        return admins;
    }

    /**
     * Find one administrator from id
     *
     * @param id {number}
     *
     * @returns {Promise<UserDTO | null>}
     */
    async findOneAdminFromId(id) {
        const admin = await UserService.findOne(await _getAdminStatusId({ id: id }));
        return !admin ? null : UserService.mapToDTO(admin);
    }

    /**
     * Find one administrator from login
     *
     * @param login {string}
     *
     * @returns {Promise<UserDTO | null>}
     */
    async findOneAdminFromLogin(login) {
        const admin = await UserService.findOne(await _getAdminStatusId({ login: login }));
        return !admin ? null : UserService.mapToDTO(admin);
    }

    /**
     * Find one administrator from email
     *
     * @param email {string}
     *
     * @returns {Promise<UserDTO | null>}
     */
    async findOneAdminFromEmail(email) {
        const admin = await UserService.findOne(await _getAdminStatusId({ email: email }));
        return !admin ? null : UserService.mapToDTO(admin);
    }

    /**
     * Login one administrator
     *
     * @param login {string}
     * @param password {string}
     *
     * @returns {Promise<string | null>}
     */
    async loginOneAdmin(login, password) {
        const admin = await UserService.findOne(await _getAdminStatusId({ login: login }));
        if (admin && !admin.token_session && SecurityUtil.hash(password) === admin.password) {
            const token = await SecurityUtil.randomToken();
            const result = await UserService.update(admin.id, { token_session: token });
            if (result) { return token; }
        }
    }

    /**
     * Logout one administrator from id
     *
     * @param id {number}
     * @param token {string}
     *
     * @returns {Promise<boolean | null>}
     */
    async logoutOneAdmin(id, token) {
        const user = await UserService.findOne(await _getAdminStatusId({ id: id }));
        if (user && token === user.token_session) {
            return await UserService.update(id, { token_session: null });
        }
    }

    /**
     * Remove one administrator from id
     *
     * @param id {number}
     *
     * @returns {Promise<boolean>}
     */
    async removeAdminFromId(id) {
        if (!await this.findOneAdminFromId(id)) { return false; }
        return await UserService.destroy(await _getAdminStatusId({ id: id }));
    }
}

/**
 * Add admin's status property in given object
 *
 * @param properties {object}
 *
 * @returns {Promise<object>}
 *
 * @private
 */
const _getAdminStatusId = async (properties) => {
    const adminStatus = await UserStatusController.findUserStatusFromName(UserStatusController.adminValue);
    properties.user_status_id = adminStatus.id;
    return properties;
};

module.exports = new AdminController();
