const {Workspace} = require('../models');

class WorkspaceService {
    /**
     * Create a new workspace
     *
     * @param values {object}
     *
     * @returns {Promise<Workspace>}
     */
    async create(values) {
        return Workspace.create(values);
    }

    /**
     * Remove one workspace corresponding to where clause
     *
     * @param where {object}
     *
     * @returns {Promise<boolean>}
     */
    async destroy(where) {
        try {
            await Workspace.destroy({where: where});
            return true;
        } catch (e) {
            console.log(e);
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
     * Find one workspace corresponding to where clause
     *
     * @param where {object}
     *
     * @returns {Promise<Workspace|null>}
     */
    async findOne(where) {
        return Workspace.findOne({where: where});
    }

    /**
     * Map given workspace to DTO
     *
     * @param workspace {Workspace}
     *
     * @returns {WorkspaceDTO}
     */
    mapToDTO(workspace) {
        return new WorkspaceDTO(workspace.id, workspace.name, workspace.description, workspace.UserId);
    }

    /**
     * Update one workspace corresponding to where clause
     *
     * @param values {object}
     * @param where {object}
     *
     * @returns {Promise<boolean>}
     */
    async update(values, where) {
        try {
            await Workspace.update(values, {where: where});
            return true;
        } catch (e) {
            console.error(e);
            return false;
        }
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
