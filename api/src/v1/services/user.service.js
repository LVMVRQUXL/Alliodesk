const {User} = require('../models');
const SecurityUtil = require('../utils').SecurityUtil;

class UserService {
    /**
     * Create a new user
     *
     * @param values {object}
     *
     * @returns {Promise<User>}
     */
    async create(values) {
        return User.create(values);
    }

    /**
     * Remove one user
     *
     * @param where {object}
     *
     * @returns {Promise<boolean>}
     */
    async destroy(where) {
        try {
            await User.destroy({where: where});
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    /**
     * Find all users
     *
     * @param where {object}
     *
     * @returns {Promise<User[] | null>}
     */
    async findAll(where) {
        return User.findAll({where: where});
    }

    /**
     * Find one user corresponding to where clause
     *
     * @param where {object}
     *
     * @returns {Promise<User | null>}
     */
    async findOne(where) {
        return User.findOne({where: where});
    }

    /**
     * Map given user to DTO
     *
     * @param user {User}
     *
     * @returns {UserDTO}
     */
    mapToDTO(user) {
        return new UserDTO(user.id, user.name, user.email, user.login);
    }

    /**
     * Update one user with given values
     *
     * @param user {User}
     * @param name {string}
     * @param email {string}
     * @param password {string}
     *
     * @return {Promise<boolean>}
     */
    async updateOneUser(user, name, email, password) {
        const values = {};
        if (name && name !== "" && name !== user.name) {
            values.name = name;
        }
        if (email && email !== "" && email !== user.email) {
            values.email = email;
        }
        if (password && password !== "") {
            const pwd = SecurityUtil.hash(password);
            if (pwd !== user.password) {
                values.password = pwd;
            }
        }
        return await this.update(user.id, values);
    }

    /**
     * Update one user from id
     *
     * @param id {number}
     * @param values {object}
     *
     * @returns {Promise<boolean>}
     */
    async update(id, values) {
        try {
            await User.update(values, {
                where: {id: id}
            });
            return true;
        } catch (e) {
            console.error(e);
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

module.exports = new UserService();
