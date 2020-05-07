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
     * Find one admin from login
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
     * Find one admin from email
     *
     * @param email {string}
     *
     * @returns {Promise<UserDTO | null>}
     */
    async findOneAdminFromEmail(email) {
        const user = await UserService.findOne(await _getAdminStatusId({ email: email }));
        return !user ? null : UserService.mapToDTO(user);
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
