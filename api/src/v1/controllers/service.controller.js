const {FeedbackService, ServiceService} = require('../services');
const ServiceStatusController = require('./service_status.controller');
const UserController = require('./user.controller');

class ServiceController {
    /**
     * Create a new service with pending status
     *
     * @param values {Object}
     * @param userToken {string}
     *
     * @returns {Promise<ServiceDTO|null|boolean>}
     */
    async createService(values, userToken) {
        const user = await UserController.findOneUserFromToken(userToken);
        if (!user) {
            return null;
        } else if (await this.findOneServiceFromName(values.name)) {
            return false;
        }
        const service = await ServiceService.create(await _getPendingStatusId({
            name: values.name,
            version: values.version,
            source_url: values.source_url,
            update_config_link: values.update_config_link,
            user_id: user.id
        }));
        return ServiceService.mapToDTO(service);
    }

    /**
     * @param serviceId {number}
     *
     * @returns {Promise<FeedbackDTO[]>}
     */
    async findAllFeedbacksOfOneServiceFromId(serviceId) {
        const service = await ServiceService.findOne({id: serviceId});
        const feedbacks = await service.getFeedbacks();

        return feedbacks.map(feedback => FeedbackService.mapToDTO(feedback));
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
     * @returns {Promise<ServiceDTO|null>}
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
     * Find one service from name
     *
     * @param name {string}
     *
     * @returns {Promise<ServiceDTO|null>}
     */
    async findOneServiceFromName(name) {
        const service = await ServiceService.findOne({name: name});
        return !service ? null : ServiceService.mapToDTO(service);
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
     * @param newValues {Object}
     *
     * @returns {Promise<boolean>}
     */
    async updateOneServiceFromId(id, newValues) {
        if (newValues.name === "" && newValues.version === ""
            && newValues.source_url === "" && newValues.update_config_link === '') {
            return false;
        }
        const service = await this.findOneServiceFromId(id);
        if (!service) {
            return false;
        }
        const values = {};
        if (newValues.name !== service.name) {
            values.name = newValues.name;
        }
        if (newValues.version !== service.version) {
            values.version = newValues.version;
        }
        if (newValues.source_url !== service.source_url) {
            values.source_url = newValues.source_url;
        }
        if (newValues.update_config_link !== service.update_config_link) {
            values.update_config_link = newValues.update_config_link;
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
