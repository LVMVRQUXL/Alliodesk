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

    /**
     * Find all services
     *
     * @returns {Promise<Service[]>}
     */
    async findAll() { return Service.findAll(); }

    /**
     * Find one service corresponding to where clause
     *
     * @param where {object}
     *
     * @returns {Promise<Service>}
     */
    async findOne(where) { return Service.findOne({ where: where }) }

    /**
     * Map given service to DTO
     *
     * @param service {Service}
     *
     * @returns {ServiceDTO}
     */
    mapToDTO(service) { return new ServiceDTO(service.id, service.name, service.version, service.source_url); }
}

class ServiceDTO {
    constructor(id, name, version, sourceUrl) {
        this.id = id;
        this.name = name;
        this.version = version;
        this.source_url = sourceUrl;
    }
}

module.exports = new ServiceService();
