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
    async createUser(name, email, login, password) {
        if (!emailValidator.validate(email)) { return false; }
        try {
            const userStatus = await UserStatusController.findUserStatusFromName(UserStatusController.userValue);
            await User.create({
                name: name,
                email: email,
                login: login,
                password: SecurityUtil.hash(password),
                user_status_id: userStatus.id
            });
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
    async findAllUsers() { // TODO: add unit tests!
        const userStatus = await UserStatusController.findUserStatusFromName(UserStatusController.userValue);
        const users = await User.findAll({
            where: {
                user_status_id: userStatus.id
            }
        });
        return users.map(user => new UserDTO(user.id, user.name, user.email, user.login));
    }

    /**
     * Find one user from id
     *
     * @param id {number}
     *
     * @returns {Promise<UserDTO | null>}
     */
    async findOneUserFromId(id) { // TODO: add unit tests!
        const userStatus = await UserStatusController.findUserStatusFromName(UserStatusController.userValue);
        const user = await User.findOne({
            where: {
                id: id,
                user_status_id: userStatus.id
            }
        });
        return !user ? null : new UserDTO(user.id, user.name, user.email, user.login);
    }

    /**
     * Remove one user from id
     *
     * @param id {number}
     *
     * @returns {Promise<boolean>}
     */
    async removeUserFromId(id) { // TODO: add unit tests!
        try {
            const user = await this.findOneUserFromId(id);
            if (user) {
                await User.destroy({
                    where: {
                        id: id
                    }
                });
                return true;
            }
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    /**
     * Update one user from id
     *
     * @param id {number}
     * @param name {string}
     * @param email {string}
     * @param password {string}
     *
     * @returns {Promise<boolean>}
     */
    async updateUserFromId(id, name, email, password) { // TODO: add unit tests!
        try {
            const userStatus = await UserStatusController.findUserStatusFromName(UserStatusController.userValue);
            const user = await User.findOne({
                where: {
                    id: id,
                    user_status_id: userStatus.id
                }
            });

            if (user) {
                if (name && name !== user.name) {
                    await User.update({ name: name }, {
                        where: {
                            id: id
                        }
                    });
                }
                if (email && email !== user.email && emailValidator.validate(email)) {
                    await User.update({ email: email }, {
                        where: {
                            id: id
                        }
                    });
                }
                if (password && SecurityUtil.hash(password) !== user.password) {
                    await User.update({ password: SecurityUtil.hash(password) }, {
                        where: {
                            id: id
                        }
                    });
                }
                return true;
            }
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

module.exports = new UserController();
