const emailValidator = require('email-validator');

const {User} = require('../models');
const UserStatusController = require('./user_status.controller');
const SecurityUtil = require('../utils').SecurityUtil;

class UserController {
    /**
     * Create a new user
     *
     * @param name {string}
     * @param email {string}
     * @param login {string}
     * @param password {string}
     *
     * @returns {Promise<boolean>}
     */
    async createUser(name, email, login, password) { // TODO: refactor (put emailValidator in router)!
        if (!emailValidator.validate(email) || await this.findOneUserFromEmail(email) !== null
            || await this.findOneUserFromLogin(login) !== null) {
            return false;
        }
        try {
            await User.create(await _addUserStatusProperty({
                name: name,
                email: email,
                login: login,
                password: SecurityUtil.hash(password)
            }));
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    /**
     * Find all users
     *
     * @returns {Promise<UserDTO[]>}
     */
    async findAllUsers() {
        const users = await User.findAll({ where: await _addUserStatusProperty({}) });
        return users.map(user => _mapToDTO(user));
    }

    /**
     * Find one user from id
     *
     * @param id {number}
     *
     * @returns {Promise<UserDTO | null>}
     */
    async findOneUserFromId(id) {
        const user = await _findOneUser({ id: id });
        return !user ? null : _mapToDTO(user);
    }

    /**
     * Find one user from login
     *
     * @param login {string}
     *
     * @returns {Promise<UserDTO | null>}
     */
    async findOneUserFromLogin(login) {
        const user = await _findOneUser({ login: login });
        return !user ? null : _mapToDTO(user);
    }

    /**
     * Find one user from email
     *
     * @param email {string}
     *
     * @returns {Promise<UserDTO | null>}
     */
    async findOneUserFromEmail(email) {
        const user = await _findOneUser({ email: email });
        return !user ? null : _mapToDTO(user);
    }

    /**
     * Remove one user from id
     *
     * @param id {number}
     *
     * @returns {Promise<boolean>}
     */
    async removeUserFromId(id) {
        try {
            const user = await this.findOneUserFromId(id);
            if (!user) { return false; }
            await User.destroy({
                where: await _addUserStatusProperty({ id: id })
            });
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    /**
     * Update one user from id
     * PS: Empty inputs will be ignored!
     *
     * @param id {number}
     * @param name {string}
     * @param email {string}
     * @param password {string}
     *
     * @returns {Promise<boolean>}
     */
    async updateUserFromId(id, name, email, password) {
        try {
            const user = await _findOneUser(await _addUserStatusProperty({ id: id }));
            if (!user
                || (email && email !== ""
                    && (!emailValidator.validate(email) || await this.findOneUserFromEmail(email) !== null))
                || (name === "" && email === "" && password === "")) {
                return false;
            }

            const values = {};
            if (name && name !== "" && name !== user.name) { values.name = name; }
            if (email && email !== "" && email !== user.email) { values.email = email; }
            if (password && password !== "") {
                const pwd = SecurityUtil.hash(password);
                if (pwd !== user.password) { values.password = pwd; }
            }
            return await _updateUser(id, values);
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}

class UserDTO {
    constructor(id, name, email, login) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.login = login;
    }
}

/**
 * Add user's status property in given object
 *
 * @param properties {object}
 *
 * @returns {Promise<object>}
 *
 * @private
 */
const _addUserStatusProperty = async (properties) => {
    const userStatus = await UserStatusController.findUserStatusFromName(UserStatusController.userValue);
    properties.user_status_id = userStatus.id;
    return properties;
};

/**
 * Find one user from where clause
 *
 * @param where {object}
 *
 * @returns {Promise<User>}
 *
 * @private
 */
const _findOneUser = async (where) => await User.findOne({ where: await _addUserStatusProperty(where) });

/**
 * Map given user to DTO
 *
 * @param user {User}
 *
 * @returns {UserDTO}
 *
 * @private
 */
const _mapToDTO = (user) => new UserDTO(user.id, user.name, user.email, user.login);

/**
 * Update one user from id
 *
 * @param id {number}
 * @param values {object}
 *
 * @returns {Promise<boolean>}
 *
 * @private
 */
const _updateUser = async (id, values) => {
    try {
        await User.update(values, {
            where: { id: id }
        });
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};

module.exports = new UserController();
