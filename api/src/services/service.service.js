const {Service} = require('../models');

class ServiceService {
    /**
     * Create a service
     *
     * @param values {object}
     *
     * @returns {Promise<Service>}
     */
    async create(values) {
        return Service.create(values);
    }

    /**
     * Remove one service corresponding to where clause
     *
     * @param where {object}
     *
     * @returns {Promise<boolean>}
     */
    async destroy(where) {
        try {
            await Service.destroy({where: where});
            return true;
        } catch (e) {
            console.log(e);
            return false;
        }
    }

    /**
     * Find all services
     *
     * @returns {Promise<Service[]>}
     */
    async findAll() {
        return Service.findAll();
    }

    /**
     * Find one service corresponding to where clause
     *
     * @param where {object}
     *
     * @returns {Promise<Service|null>}
     */
    async findOne(where) {
        return Service.findOne({where: where})
    }

    /**
     * Map given service to DTO
     *
     * @param service {Service}
     *
     * @returns {ServiceDTO}
     */
    mapToDTO(service) {
        return new ServiceDTO(
            service.id, service.name, service.version, service.source_url, service.user_id, service.service_status_id
        );
    }

    /**
     * Update one service corresponding to where clause
     *
     * @param values {object}
     * @param where {object}
     *
     * @returns {Promise<boolean>}
     */
    async update(values, where) {
        try {
            await Service.update(values, {where: where});
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }
}

class ServiceDTO {
    constructor(id, name, version, sourceUrl, userId, serviceStatusId) {
        this.id = id;
        this.name = name;
        this.version = version;
        this.source_url = sourceUrl;
        this.user_id = userId;
        this.service_status_id = serviceStatusId;
    }
}

module.exports = new ServiceService();
