const { Service } = require('../models');

class ServiceService {
    /**
     * Create a service
     *
     * @param values {object}
     *
     * @returns {Promise<boolean>}
     */
    async create(values) {
        try {
            await Service.create(values);
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }
}

module.exports = new ServiceService();
