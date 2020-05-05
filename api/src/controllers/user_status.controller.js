const {User_status} = require('../models');

const adminValue = 'admin';
const userValue = 'user';

class UserStatusController {

    get adminValue() { return adminValue; }
    get userValue() { return userValue; }

    /**
     * Create one status for admins
     *
     * @returns {Promise<void>}
     */
    async createStatusForAdmins() { await User_status.create({status: adminValue}); }

    /**
     * Create one status for users
     *
     * @returns {Promise<void>}
     */
    async createStatusForUsers() { await User_status.create({status: userValue}); }

    /**
     * Find one user status from status
     *
     * @param status {string}
     *
     * @returns {Promise<User_status | null>}
     */
    async findUserStatusFromName(status) {
        return await User_status.findOne({
            where: {
                status: status
            }
        });
    }

}

module.exports = new UserStatusController();
