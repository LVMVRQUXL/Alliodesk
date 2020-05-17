const ServiceService = require('../services').ServiceService;
const ServiceStatusController = require('./service_status.controller');
const UserController = require('./user.controller');

class ServiceController {
    /**
     * Create a new service with pending status
     *
     * @param name {string}
     * @param version {string}
     * @param sourceUrl {string}
     * @param userToken {string}
     *
     * @returns {Promise<boolean>}
     */
    async createService(name, version, sourceUrl, userToken) {
        const user = await UserController.findOneUserFromToken(userToken);
        if (!user) {
            return false;
        }
        return await ServiceService.create(await _getPendingStatusId({
            name: name,
            version: version,
            source_url: sourceUrl,
            user_id: user.id
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

    /**
     * Find one service from id
     *
     * @param id {number}
     *
     * @returns {Promise<ServiceDTO>}
     */
    async findOneServiceFromId(id) {
        const service = await ServiceService.findOne({id: id});
        return !service ? null : ServiceService.mapToDTO(service);
    }

    /**
     * Reject one service from id
     *
     * @param id {number}
     *
     * @returns {Promise<boolean|undefined>}
     */
    async rejectOneServiceFromId(id) {
        const service = await this.findOneServiceFromId(id);
        const status = await _getPendingStatusId({});
        if (service && service.service_status_id === status.service_status_id) {
            const status = await _getRejectedStatusId({});
            return await ServiceService.update({service_status_id: status.service_status_id}, {id: id});
        }
    }

    /**
     * Remove one service from id
     *
     * @param id {number}
     *
     * @returns {Promise<boolean>}
     */
    async removeOneServiceFromId(id) {
        const service = await this.findOneServiceFromId(id);
        if (!service) {
            return false;
        }
        return await ServiceService.destroy({id: id});
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
     */
    async updateOneServiceFromId(id, name, version, sourceUrl) {
        if (name === "" && version === "" && sourceUrl === "") {
            return false;
        }
        const service = await this.findOneServiceFromId(id);
        if (!service) {
            return false;
        }
        const values = {};
        if (name !== service.name) {
            values.name = name;
        }
        if (version !== service.version) {
            values.version = version;
        }
        if (sourceUrl !== service.source_url) {
            values.source_url = sourceUrl;
        }
        return await ServiceService.update(values, {id: id});
    }

    /**
     * Validate one service from id
     *
     * @param id {number}
     *
     * @returns {Promise<boolean>}
     */
    async validateOneServiceFromId(id) {
        const service = await this.findOneServiceFromId(id);
        const status = await _getPendingStatusId({});
        if (service && service.service_status_id === status.service_status_id) {
            const status = await _getValidatedStatusId({});
            return await ServiceService.update({service_status_id: status.service_status_id}, {id: id});
        }
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

/**
 * Add service's rejected status in given object
 *
 * @param obj {object}
 *
 * @returns {Promise<object>}
 *
 * @private
 */
const _getRejectedStatusId = async (obj) => {
    const status = await ServiceStatusController.findServiceStatusFromValue(ServiceStatusController.rejectedStatus);
    obj.service_status_id = status.id;
    return obj;
};

/**
 * Add service's validated status in given object
 *
 * @param obj {object}
 *
 * @returns {Promise<object>}
 *
 * @private
 */
const _getValidatedStatusId = async (obj) => {
    const status = await ServiceStatusController.findServiceStatusFromValue(ServiceStatusController.validatedStatus);
    obj.service_status_id = status.id;
    return obj;
};

module.exports = new ServiceController();
