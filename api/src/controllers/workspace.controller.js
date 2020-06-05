const {ServiceService, WorkspaceService} = require('../services');
const UserController = require('./user.controller');
const ServiceController = require('./service.controller');

class WorkspaceController {
    /**
     * Add one service in one workspace from id
     *
     * @param workspaceId {number}
     * @param serviceId {number}
     *
     * @returns {Promise<boolean|undefined>}
     */
    async addOneServiceInOneWorkspaceFromId(workspaceId, serviceId) {
        const service = await ServiceController.findOneServiceFromId(serviceId);
        if (service) {
            const workspace = await WorkspaceService.findOne({id: workspaceId});
            if (workspace) {
                await workspace.addService(serviceId);
                return true;
            }
        }
    }

    /**
     * Create a new workspace
     *
     * @param name {string}
     * @param description {string}
     * @param userToken {string}
     *
     * @returns {Promise<WorkspaceDTO|null>}
     */
    async createWorkspace(name, description, userToken) {
        const user = await UserController.findOneUserFromToken(userToken);
        if (!user) {
            return null;
        }
        const workspace = await WorkspaceService.create({
            name: name,
            description: description,
            user_id: user.id
        });
        return WorkspaceService.mapToDTO(workspace);
    }

    /**
     * Find all services of one workspace from id
     *
     * @param id {number}
     *
     * @returns {Promise<ServiceDTO[]|undefined>}
     */
    async findAllServicesOfOneWorkspaceFromId(id) {
        const workspace = await WorkspaceService.findOne({id: id});
        if (workspace) {
            const services = await workspace.getServices();
            return services.map(service => ServiceService.mapToDTO(service));
        }
    }

    /**
     * Find all workspaces
     *
     * @returns {Promise<WorkspaceDTO[]>}
     */
    async findAllWorkspaces() {
        const workspaces = await WorkspaceService.findAll();
        return Promise.all(workspaces.map(workspace => WorkspaceService.mapToDTO(workspace)));
    }

    /**
     * Find one workspace from id
     *
     * @param id {number}
     *
     * @returns {Promise<WorkspaceDTO|null>}
     */
    async findOneWorkspaceFromId(id) {
        const workspace = await WorkspaceService.findOne({id: id});
        return !workspace ? null : WorkspaceService.mapToDTO(workspace);
    }

    /**
     * Remove one workspace's service from id
     *
     * @param workspaceId {number}
     * @param serviceId {number}
     *
     * @returns {Promise<boolean|undefined>}
     */
    async removeOneServiceOfOneWorkspaceFromId(workspaceId, serviceId) {
        const service = await ServiceController.findOneServiceFromId(serviceId);
        if (service) {
            const workspace = await WorkspaceService.findOne({id: workspaceId});
            if (workspace) {
                await workspace.removeService(serviceId);
                return true;
            }
        }
    }

    /**
     * Remove one workspace from id
     *
     * @param id {number}
     * @param userToken {string}
     *
     * @returns {Promise<boolean|undefined>}
     */
    async removeOneWorkspaceFromId(id, userToken) {
        const user = await UserController.findOneUserFromToken(userToken);
        if (user) {
            const workspace = await this.findOneWorkspaceFromId(id);
            return !workspace || workspace.user_id !== user.id ? false : await WorkspaceService.destroy({id: id});
        }
    }

    /**
     * Update one workspace from id
     *
     * @param id {number}
     * @param name {string}
     * @param description {string}
     * @param userToken {string}
     *
     * @returns {Promise<boolean|undefined>}
     */
    async updateOneWorkspaceFromId(id, name, description, userToken) {
        const user = await UserController.findOneUserFromToken(userToken);
        if (user) {
            if (name === "" && description === "") {
                return false;
            }
            const workspace = await this.findOneWorkspaceFromId(id);
            if (!workspace || workspace.user_id !== user.id) {
                return false;
            }
            const values = {};
            if (name !== workspace.name) {
                values.name = name;
            }
            if (description !== workspace.description) {
                values.description = description;
            }
            return await WorkspaceService.update(values, {id: id});
        }
    }
}

module.exports = new WorkspaceController();
