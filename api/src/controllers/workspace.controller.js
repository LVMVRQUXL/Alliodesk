const WorkspaceService = require('../services').WorkspaceService;
const UserController = require('./user.controller');

class WorkspaceController {
    /**
     * Create a new workspace
     *
     * @param name {string}
     * @param description {string}
     * @param userToken {string}
     *
     * @returns {Promise<WorkspaceDTO|null>}
     * TODO: update unit tests
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
     * Remove one workspace from id
     *
     * @param id {number}
     *
     * @returns {Promise<boolean>}
     */
    async removeOneWorkspaceFromId(id) {
        const workspace = await this.findOneWorkspaceFromId(id);
        return !workspace ? false : await WorkspaceService.destroy({id: id});
    }

    /**
     * Update one workspace from id
     *
     * @param id {number}
     * @param name {string}
     * @param description {string}
     *
     * @returns {Promise<boolean>}
     */
    async updateOneWorkspaceFromId(id, name, description) {
        if (name === "" && description === "") {
            return false;
        }
        const workspace = await this.findOneWorkspaceFromId(id);
        if (!workspace) {
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

module.exports = new WorkspaceController();
