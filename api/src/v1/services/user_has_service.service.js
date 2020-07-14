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

}

module.exports = new UserHasServiceService();
