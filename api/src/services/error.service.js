const {Error} = require('../models');

class ErrorService {
    /**
     * Create a new error
     *
     * @param values {object}
     *
     * @returns {Promise<Error>}
     */
    async create(values) {
        return Error.create(values);
    }

    /**
     * Find all errors
     *
     * @returns {Promise<Error[]>}
     */
    async findAll() {
        return Error.findAll();
    }

    /**
     * Find one error corresponding to where clause
     *
     * @param where {object}
     *
     * @returns {Promise<Error|null>}
     */
    async findOne(where) {
        return Error.findOne({where: where});
    }

    /**
     * Map given error to DTO
     *
     * @param error {Error}
     *
     * @returns {ErrorDTO}
     */
    mapToDTO(error) {
        return new ErrorDTO(error.id, error.message, error.user_id, error.service_id);
    }
}

class ErrorDTO {
    constructor(id, message, userId, serviceId) {
        this.id = id;
        this.message = message;
        this.user_id = userId;
        this.service_id = serviceId;
    }
}

module.exports = new ErrorService();
