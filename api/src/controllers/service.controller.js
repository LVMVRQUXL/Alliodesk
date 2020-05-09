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
     * TODO: unit tests
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
     * TODO: unit tests
     */
    async findAllServices() {
        const services = await ServiceService.findAll();
        return Promise.all(services.map(service => ServiceService.mapToDTO(service)));
    }

    /**
     * Find one service from id
     *
     * @param id {number}
     *
     * @returns {Promise<ServiceDTO>}
     * TODO: unit tests
     */
    async findOneServiceFromId(id) {
        const service = await ServiceService.findOne({ id: id });
        return !service ? null : ServiceService.mapToDTO(service);
    }

    /**
     * Reject one service from id
     *
     * @param id {number}
     *
     * @returns {Promise<boolean>}
     * TODO: unit tests
     */
    async rejectOneServiceFromId(id) { return await _updateServiceStatusFromId(id, false); }

    /**
     * Remove one service from id
     *
     * @param id {number}
     *
     * @returns {Promise<boolean>}
     * TODO: unit tests
     */
    async removeOneServiceFromId(id) {
        const service = await this.findOneServiceFromId(id);
        if (!service) { return false; }
        return await ServiceService.destroy({ id: id });
    }

    /**
     * Update one service from id
     *
     * @param id {number}
     * @param name {string}
     * @param version {string}
     * @param sourceUrl {string}
     *
     * @returns {Promise<boolean>}
     * TODO: unit tests
     */
    async updateOneServiceFromId(id, name, version, sourceUrl) {
        if (name === "" && version === "" && sourceUrl === "") { return false; }
        const service = await this.findOneServiceFromId(id);
        if (!service) { return false; }
        const values = {};
        if (name !== service.name) { values.name = name; }
        if (version !== service.version) { values.version = version; }
        if (sourceUrl !== service.source_url) { values.source_url = sourceUrl; }
        return await ServiceService.update(values, { id: id });
    }

    /**
     * Validate one service from id
     *
     * @param id {number}
     *
     * @returns {Promise<boolean>}
     * TODO: unit tests
     */
    async validateOneServiceFromId(id) { return await _updateServiceStatusFromId(id, true); }
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

/**
 * Update status of one service from id
 *
 * @param id {number}
 * @param validate {boolean}
 *
 * @returns {Promise<boolean>}
 *
 * @private
 */
const _updateServiceStatusFromId = async (id, validate) => {
    const service = await this.findOneServiceFromId(id);
    if (service && service.service_status_id === ServiceStatusController.pendingStatus) {
        const statusId = validate ? ServiceStatusController.validatedStatus : ServiceStatusController.rejectedStatus;
        return await ServiceService.update({ service_status_id: statusId }, { id: id });
    }
};

module.exports = new ServiceController();
