const WorkspaceService = require('../services').WorkspaceService;

class WorkspaceController {
    /**
     * Create a new workspace
     *
     * @param name {string}
     * @param description {string}
     *
     * @returns {Promise<boolean>}
     * TODO: unit tests
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
}

module.exports = new WorkspaceController();
