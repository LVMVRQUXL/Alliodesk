const {ServiceService, UserService} = require('../services');
const UserStatusController = require('./user_status.controller');
const ServiceStatusController = require('./service_status.controller');
const SecurityUtil = require('../utils').SecurityUtil;

class UserController {
    /**
     * Add a service in one user's account from id
     *
     * @param userId {number}
     * @param serviceId {number}
     *
     * @returns {Promise<boolean>}
     */
    async addServiceInOneUserAccountFromId(userId, serviceId) { // TODO: unit tests
        const user = await UserService.findOne(await _getUserStatusId({id: userId}));
        const status = await ServiceStatusController.findServiceStatusFromValue(
            ServiceStatusController.validatedStatus
        );
        const service = await ServiceService.findOne({
            id: serviceId,
            service_status_id: status.id
        });
        if (!user || !service) {
            return false;
        }
        await user.addService(serviceId);
        return true;
    }

    /**
     * Create a new user
     *
     * @param name {string}
     * @param email {string}
     * @param login {string}
     * @param password {string}
     *
     * @returns {Promise<boolean>}
     */
    async createUser(name, email, login, password) {
        if (await this.findOneUserFromEmail(email) || await this.findOneUserFromLogin(login)) {
            return false;
        }
        return await UserService.create(await _getUserStatusId({
            name: name,
            email: email,
            login: login,
            password: SecurityUtil.hash(password)
        }));
    }

    /**
     * Find all services of one user from id
     *
     * @param userId {number}
     *
     * @returns {Promise<ServiceDTO[]>}
     */
    async findAllServicesOfOneUserFromId(userId) { // TODO: unit tests
        const user = await UserService.findOne(await _getUserStatusId({id: userId}));
        if (user) {
            const services = await user.getServices();
            return services.map(service => ServiceService.mapToDTO(service));
        }
    }

    /**
     * Find all users
     *
     * @returns {Promise<UserDTO[]>}
     */
    async findAllUsers() {
        let users = await UserService.findAll(await _getUserStatusId({}));
        return Promise.all(users.map(user => UserService.mapToDTO(user)));
    }

    /**
     * Find one service of one user from id
     *
     * @param userId {number}
     * @param serviceId {number}
     *
     * @returns {Promise<ServiceDTO|null>}
     */
    async findOneServiceOfOneUserFromId(userId, serviceId) { // TODO: unit tests
        const user = await UserService.findOne(await _getUserStatusId({id: userId}));
        if (user) {
            const services = await user.getServices({
                where: {id: serviceId}
            });
            return services.map(service => ServiceService.mapToDTO(service));
        }
    }

    /**
     * Find one user from id
     *
     * @param id {number}
     *
     * @returns {Promise<UserDTO | null>}
     */
    async findOneUserFromId(id) {
        const user = await UserService.findOne(await _getUserStatusId({id: id}));
        return !user ? null : UserService.mapToDTO(user);
    }

    /**
     * Find one user from login
     *
     * @param login {string}
     *
     * @returns {Promise<UserDTO | null>}
     */
    async findOneUserFromLogin(login) {
        const user = await UserService.findOne(await _getUserStatusId({login: login}));
        return !user ? null : UserService.mapToDTO(user);
    }

    /**
     * Find one user from email
     *
     * @param email {string}
     *
     * @returns {Promise<UserDTO | null>}
     */
    async findOneUserFromEmail(email) {
        const user = await UserService.findOne(await _getUserStatusId({email: email}));
        return !user ? null : UserService.mapToDTO(user);
    }

    /**
     * Find one user from token session
     *
     * @param token {string}
     *
     * @returns {Promise<UserDTO | null>}
     */
    async findOneUserFromToken(token) {
        const user = await UserService.findOne({token_session: token});
        return !user ? null : UserService.mapToDTO(user);
    }

    /**
     * Login one user
     *
     * @param login {string}
     * @param password {string}
     *
     * @returns {Promise<string | null>}
     */
    async loginOneUser(login, password) {
        const user = await UserService.findOne(await _getUserStatusId({login: login}));
        if (user && !user.token_session && SecurityUtil.hash(password) === user.password) {
            const token = await SecurityUtil.randomToken();
            const result = await UserService.update(user.id, {token_session: token});
            if (result) {
                return token;
            }
        }
    }

    /**
     * Logout one user from id
     *
     * @param id {number}
     * @param token {string}
     *
     * @returns {Promise<boolean | null>}
     */
    async logoutOneUser(id, token) {
        const user = await UserService.findOne(await _getUserStatusId({id: id}));
        if (user && token === user.token_session) {
            return await UserService.update(id, {token_session: null});
        }
    }

    /**
     * Remove one user from id
     *
     * @param id {number}
     *
     * @returns {Promise<boolean>}
     */
    async removeUserFromId(id) {
        if (!await this.findOneUserFromId(id)) {
            return false;
        }
        return await UserService.destroy(await _getUserStatusId({id: id}));
    }

    /**
     * Update one user from id
     * PS: Empty inputs will be ignored!
     *
     * @param id {number}
     * @param name {string}
     * @param email {string}
     * @param password {string}
     *
     * @returns {Promise<boolean>}
     */
    async updateUserInfosFromId(id, name, email, password) {
        if (email && email !== "" && await this.findOneUserFromEmail(email)) {
            return false;
        }
        const user = await UserService.findOne(await _getUserStatusId({id: id}));
        if (!user) {
            return false;
        }
        return await UserService.updateOneUser(user, name, email, password);
    }
}

/**
 * Add user's status property in given object
 *
 * @param properties {object}
 *
 * @returns {Promise<object>}
 *
 * @private
 */
const _getUserStatusId = async (properties) => {
    const userStatus = await UserStatusController.findUserStatusFromName(UserStatusController.userValue);
    properties.user_status_id = userStatus.id;
    return properties;
};

module.exports = new UserController();
