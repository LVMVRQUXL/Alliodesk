const {User_has_Service} = require('../models');

class UserHasServiceService {
    /**
     * @param values {Object}
     *
     * @returns {Promise<void>}
     */
    async create(values) {
        await User_has_Service.create(values);
    }

    /**
     * @param [where] {Object}
     *
     * @returns {Promise<User_has_Service[]>}
     */
    async findAll(where) {
        if (!where) {
            return User_has_Service.findAll();
        }
        return User_has_Service.findAll({where: where});
    }

    /**
     * @param where {Object}
     *
     * @returns {Promise<User_has_Service>}
     */
    async findOne(where) {
        return User_has_Service.findOne({where: where});
    }
}

module.exports = new UserHasServiceService();
