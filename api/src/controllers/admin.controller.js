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
        const users = await UserService.findAll(await _getAdminStatusId({}));
        users.map(user => UserService.mapToDTO(user));
        return users;
    }

    /**
     * Find one administrator from id
     *
     * @param id {number}
     *
     * @returns {Promise<UserDTO | null>}
     */
    async findOneAdminFromId(id) {
        const user = await UserService.findOne(await _getAdminStatusId({ id: id }));
        return !user ? null : UserService.mapToDTO(user);
    }

    /**
     * Find one administrator from login
     *
     * @param login {string}
     *
     * @returns {Promise<UserDTO | null>}
     */
    async findOneAdminFromLogin(login) {
        const user = await UserService.findOne(await _getAdminStatusId({ login: login }));
        return !user ? null : UserService.mapToDTO(user);
    }

    /**
     * Find one administrator from email
     *
     * @param email {string}
     *
     * @returns {Promise<UserDTO | null>}
     */
    async findOneAdminFromEmail(email) {
        const user = await UserService.findOne(await _getAdminStatusId({ email: email }));
        return !user ? null : UserService.mapToDTO(user);
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
