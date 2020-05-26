const WorkspaceService = require('../services').WorkspaceService;

class WorkspaceController {
    /**
     * Create a new workspace
     *
     * @param name {string}
     * @param description {string}
     *
     * @returns {Promise<boolean>}
     */
    async createWorkspace(name, description) {
        return await WorkspaceService.create({
            name: name,
            description: description
        });
    }

    /**
     * Find all workspaces
     *
     * @returns {Promise<WorkspaceDTO[]>}
     * TODO: unit tests
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
     * TODO: unit tests
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
     * TODO: unit tests
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
     * TODO: unit tests
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
