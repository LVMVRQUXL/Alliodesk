const UserStatusController = require('../controllers').UserStatusController;

class UserStatusMiddleware {

    /**
     * Check if status for admins exists
     *
     * @returns {function(req, res, next)}
     */
    checkStatusForAdmins() {
        return async (req, res, next) => {
            const status = UserStatusController.findUserStatusFromName(UserStatusController.adminValue);
            if (!status) { await UserStatusController.createStatusForAdmins(); }
            next();
        };
    }

    /**
     * Check if status for users exists
     *
     * @returns {function(req, res, next)}
     */
    checkStatusForUsers() {
        return async (req, res, next) => {
            const status = await UserStatusController.findUserStatusFromName(UserStatusController.userValue);
            if (!status) { await UserStatusController.createStatusForUsers(); }
            next();
        };
    }

}

module.exports = new UserStatusMiddleware();