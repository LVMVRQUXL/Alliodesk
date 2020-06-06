const ErrorService = require('../services').ErrorService;
const UserController = require('./user.controller');

class ErrorController {
    /**
     * Create a new error
     *
     * @param message {string}
     * @param userToken {string}
     *
     * @returns {Promise<Error|null>}
     * TODO: update unit tests
     */
    async createError(message, userToken) {
        const user = await UserController.findOneUserFromToken(userToken);
        if (!user) {
            return null;
        }
        const error = await ErrorService.create({
            message: message,
            user_id: user.id
        });
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
