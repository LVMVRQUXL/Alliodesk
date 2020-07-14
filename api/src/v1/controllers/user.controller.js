const {ServiceService, UserService, UserHasServiceService, WorkspaceService} = require('../services');
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
    async addServiceInOneUserAccountFromId(userId, serviceId) {
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
        await UserHasServiceService.create({
            user_id: userId,
            service_id: serviceId
        });

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
     * @returns {Promise<UserDTO|null>}
     */
    async createUser(name, email, login, password) {
        if (await this.findOneUserFromEmail(email) || await this.findOneUserFromLogin(login)) {
            return null;
        }
        const user = await UserService.create(await _getUserStatusId({
            name: name,
            email: email,
            login: login,
            password: SecurityUtil.hash(password)
        }));
        return UserService.mapToDTO(user);
    }

    /**
     * Find all services of one user from id
     *
     * @param userId {number}
     *
     * @returns {Promise<ServiceDTO[]|undefined>}
     */
    async findAllServicesOfOneUserFromId(userId) {
        const user = await UserService.findOne(await _getUserStatusId({id: userId}));
        if (user) {
            const idsList = await UserHasServiceService.findAll({user_id: userId});
            const services = [];
            for (let index = 0; index < idsList.length; index++) {
                const service = await ServiceService.findOne({id: idsList[index].service_id});
                services.push(ServiceService.mapToDTO(service));
            }

            return services;
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
     * Find all workspaces of one user from id
     *
     * @param userId {number}
     *
     * @returns {Promise<WorkspaceDTO[]|undefined>}
     */
    async findAllWorkspacesOfOneUserFromId(userId) {
        const user = await UserService.findOne(await _getUserStatusId({id: userId}));
        if (user) {
            const workspaces = await user.getWorkspaces();
            return workspaces.map(workspace => WorkspaceService.mapToDTO(workspace));
        }
    }

    /**
     * Find one service of one user from id
     *
     * @param userId {number}
     * @param serviceId {number}
     *
     * @returns {Promise<ServiceDTO|undefined>}
     */
    async findOneServiceOfOneUserFromId(userId, serviceId) {
        const user = await UserService.findOne(await _getUserStatusId({id: userId}));
        if (user) {
            const ids = await UserHasServiceService.findOne({
                user_id: userId,
                service_id: serviceId
            });
            const service = await ServiceService.findOne({id: ids.service_id});

            return !service ? undefined : ServiceService.mapToDTO(service);
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
     * Remove a service of one user from id
     *
     * @param userId {number}
     * @param serviceId {number}
     *
     * @returns {Promise<boolean>}
     */
    async removeServiceOfOneUserFromId(userId, serviceId) {
        const user = await UserService.findOne(await _getUserStatusId({id: userId}));
        const service = await this.findOneServiceOfOneUserFromId(userId, serviceId);
        if (!user || !service) {
            return false;
        }
        await user.removeService(serviceId);
        return true;
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
