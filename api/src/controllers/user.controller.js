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
     * @returns {Promise<UserDTO[] | null>}
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
