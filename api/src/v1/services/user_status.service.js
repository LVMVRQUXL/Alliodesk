const {User_status} = require('../models');

class UserStatusService {
    /**
     * Create a new user status with given value
     *
     * @param status {string}
     *
     * @returns {Promise<void>}
     */
    async create(status) {
        await User_status.create({status: status});
    }

    /**
     * Find one user status from given status value
     *
     * @param status {string}
     *
     * @returns {Promise<User_status>}
     */
    async findOneFromStatus(status) {
        return await User_status.findOne({
            where: {status: status}
        });
    }
}

module.exports = new UserStatusService();
