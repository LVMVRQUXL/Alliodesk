const ServiceService = require('../services').ServiceService;
const ServiceStatusController = require('./service_status.controller');

class ServiceController {
    /**
     * Create a new service with pending status
     *
     * @param name {string}
     * @param version {string}
     * @param sourceUrl {string}
     *
     * @returns {Promise<boolean>}
     */
    async createService(name, version, sourceUrl) {
        return await ServiceService.create(await _getPendingStatusId({
            name: name,
            version: version,
            source_url: sourceUrl
        }));
    }

    /**
     * Find all services
     *
     * @returns {Promise<ServiceDTO[]>}
     */
    async findAllServices() {
        const services = await ServiceService.findAll();
        return Promise.all(services.map(service => ServiceService.mapToDTO(service)));
    }
}

/**
 * Add service's pending status in given object
 *
 * @param obj {object}
 *
 * @returns {Promise<object>}
 *
 * @private
 */
const _getPendingStatusId = async (obj) => {
    const status = await ServiceStatusController.findServiceStatusFromValue(ServiceStatusController.pendingStatus);
    obj.service_status_id = status.id;
    return obj;
};

module.exports = new ServiceController();
