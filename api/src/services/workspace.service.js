const {Workspace} = require('../models');

class WorkspaceService {
    /**
     * Create a new workspace
     *
     * @param values {object}
     *
     * @returns {Promise<boolean>}
     */
    async create(values) {
        try {
            await Workspace.create(values);
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
    }

    /**
     * Find all workspaces
     *
     * @returns {Promise<Workspace[]>}
     */
    async findAll() {
        return Workspace.findAll();
    }

    /**
     * Map given workspace to DTO
     *
     * @param workspace {Workspace}
     *
     * @returns {WorkspaceDTO}
     */
    mapToDTO(workspace) {
        return new WorkspaceDTO(workspace.id, workspace.name, workspace.description, workspace.user_id);
    }
}

class WorkspaceDTO {
    constructor(id, name, description, userId) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.user_id = userId;
    }
}

module.exports = new WorkspaceService();
