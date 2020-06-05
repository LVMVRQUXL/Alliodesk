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
}

module.exports = new ErrorController();
