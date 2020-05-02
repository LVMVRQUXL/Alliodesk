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
    async findAllUsers() {
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
    async findOneUserFromId(id) {
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
    async removeUserFromId(id) {
        try {
            const user = await this.findOneUserFromId(id);
            if (!user) { return false; }
            await User.destroy({
                where: {
                    id: id
                }
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
    async updateUserFromId(id, name, email, password) { // TODO: refactor!
        try {
            if ((email !== "" && !emailValidator.validate(email))
                || (name === "" && email === "" && password === "")) {
                return false;
            }
            const userStatus = await UserStatusController.findUserStatusFromName(UserStatusController.userValue);
            const user = await User.findOne({
                where: {
                    id: id,
                    user_status_id: userStatus.id
                }
            });
            if (!user) { return false; }
            if (name && name !== "" && name !== user.name) {
                await User.update({ name: name }, {
                    where: {
                        id: id
                    }
                });
            }
            if (email && email !== "" && email !== user.email) {
                await User.update({ email: email }, {
                    where: {
                        id: id
                    }
                });
            }
            if (password && password !== "" && SecurityUtil.hash(password) !== user.password) {
                await User.update({ password: SecurityUtil.hash(password) }, {
                    where: {
                        id: id
                    }
                });
            }
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

}

const _updateUser = async (id, values) => {

};

class UserDTO {

    constructor(id, name, email, login) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.login = login;
    }

}

module.exports = new UserController();
