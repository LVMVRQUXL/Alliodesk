const {User} = require('../models');
const UserStatusController = require('./user_status.controller');
const SecurityUtil = require('../utils').SecurityUtil;

class AdminController {

}

/**
 * Add admin's status property in given object
 *
 * @param properties {object}
 *
 * @returns {Promise<object>}
 *
 * @private
 */
const _getAdminStatusId = async (properties) => {
    const adminStatus = await UserStatusController.findUserStatusFromName(UserStatusController.adminValue);
    properties.user_status_id = adminStatus.id;
    return properties;
};

module.exports = new AdminController();
