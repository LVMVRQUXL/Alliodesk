const ErrorService = require('../services').ErrorService;
const ServiceController = require('./service.controller');
const UserController = require('./user.controller');

class ErrorController {
    /**
     * Create a new error
     *
     * @param message {string}
     * @param userToken {string}
     * @param serviceName {string}
     *
     * @returns {Promise<Error|null>}
     */
    async createError(message, userToken, serviceName) {
        const user = await UserController.findOneUserFromToken(userToken);
        const service = serviceName && serviceName !== '' ?
            await ServiceController.findOneServiceFromName(serviceName) : null;
        if (!user || (serviceName && serviceName !== '' && !service)) {
            return null;
        }
        const values = {
            message: message,
            user_id: user.id
        };
        values.service_id = service ? service.id : null;
        const error = await ErrorService.create(values);
        return error ? ErrorService.mapToDTO(error) : null;
    }

    /**
     * Find all errors
     *
     * @returns {Promise<ErrorDTO[]>}
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
     */
    async removeOneErrorFromId(id) {
        return await this.findOneErrorFromId(id) ? await ErrorService.destroy({id: id}) : false;
    }
}

module.exports = new ErrorController();
