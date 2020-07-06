const { Service_status } = require('../models');

class ServiceStatusService {
    /**
     * Create one status for services
     *
     * @param values {object}
     *
     * @returns {Promise<boolean>}
     */
    async create(values) {
        try {
            await Service_status.create(values);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    /**
     * Find one status for services corresponding to where clause
     *
     * @param where {object}
     *
     * @returns {Promise<Service_status | null>}
     */
    async findOne(where) { return Service_status.findOne({ where: where }); }
}

module.exports = new ServiceStatusService();
