const UserStatusService = require('../services').UserStatusService;

const adminValue = 'admin';
const userValue = 'user';

class UserStatusController {

    get adminValue() {
        return adminValue;
    }

    get userValue() {
        return userValue;
    }

    /**
     * Create one status for admins
     *
     * @returns {Promise<void>}
     */
    async createStatusForAdmins() {
        await UserStatusService.create(adminValue);
    }

    /**
     * Create one status for users
     *
     * @returns {Promise<void>}
     */
    async createStatusForUsers() {
        await UserStatusService.create(userValue);
    }

    /**
     * Find one user status from status
     *
     * @param status {string}
     *
     * @returns {Promise<User_status | null>}
     */
    async findUserStatusFromName(status) {
        return await UserStatusService.findOneFromStatus(status);
    }

}

module.exports = new UserStatusController();
