const ErrorService = require('../services').ErrorService;

class ErrorController {
    /**
     * Create a new error
     *
     * @param message {string}
     *
     * @returns {Promise<Error|null>}
     * TODO: add unit tests
     */
    async createError(message) {
        const error = await ErrorService.create({message: message});
        return error ? ErrorService.mapToDTO(error) : null;
    }

    /**
     * Find all errors
     *
     * @returns {Promise<ErrorDTO[]>}
     * TODO: add unit tests
     */
    async findAllErrors() {
        const errors = await ErrorService.findAll();
        return errors.map(error => ErrorService.mapToDTO(error));
    }

    /**
     * Find one error from id
     *
     * @param id {number}
     *
     * @returns {Promise<ErrorDTO|null>}
     * TODO: add unit tests
     */
    async findOneErrorFromId(id) {
        const error = await ErrorService.findOne({id: id});
        return error ? ErrorService.mapToDTO(error) : null;
    }

    /**
     * Remove one error from id
     *
     * @param id {number}
     *
     * @returns {Promise<boolean>}
     * TODO: add unit tests
     */
    async removeOneErrorFromId(id) {
        return await this.findOneErrorFromId(id) ? await ErrorService.destroy({id: id}) : false;
    }

    /**
     * Update one error from id
     *
     * @param id {number}
     * @param message {string}
     *
     * @returns {Promise<boolean>}
     * TODO: add unit tests
     */
    async updateOneErrorFromId(id, message) {
        const error = await this.findOneErrorFromId(id);
        return error && error.message !== message ?
            await ErrorService.update({message: message}, {id: id}) : false;
    }
}

module.exports = new ErrorController();
