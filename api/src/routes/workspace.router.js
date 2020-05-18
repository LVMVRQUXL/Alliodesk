const bodyParser = require('body-parser');

const HttpCodeUtil = require('../utils').HttpCodeUtil;
const WorkspaceController = require('../controllers').WorkspaceController;

const routes = {
    WorkspacesId: '/workspaces/:id',
    Workspaces: '/workspaces'
};

module.exports = (app) => {
    // GET '/workspaces/:id' ===> Get one workspace from id TODO
    app.get(routes.WorkspacesId, async (req, res) => {
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end();
    });

    // DELETE '/workspaces/:id' ===> Remove one workspace from id TODO
    app.delete(routes.WorkspacesId, async (req, res) => {
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end();
    });

    // PUT '/workspaces/:id' ===> Update one workspace from id TODO
    app.put(routes.WorkspacesId, async (req, res) => {
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end();
    });

    // GET '/workspaces' ===> Get all workspaces
    app.get(routes.Workspaces, async (req, res) => {
        try {
            const workspaces = await WorkspaceController.findAllWorkspaces();
            if (workspaces.length > 0) {
                res.status(HttpCodeUtil.OK).json(workspaces);
            } else {
                res.status(HttpCodeUtil.NO_CONTENT).end();
            }
        } catch (e) {
            console.error(e);
            res.status(HttpCodeUtil.INTERNAL_SERVER_ERROR).end();
        }
    });

    // POST '/workspaces' ===> Create a new workspace
    app.post(routes.Workspaces, bodyParser.json(), async (req, res) => {
        try {
            const workspaceName = req.body.name;
            const workspaceDescription = req.body.description;
            if (workspaceName && workspaceName !== ""
                && workspaceDescription && workspaceDescription !== "") {
                const result = await WorkspaceController.createWorkspace(workspaceName, workspaceDescription);
                if (result) {
                    res.status(HttpCodeUtil.CREATED).end();
                }
            } else {
                res.status(HttpCodeUtil.BAD_REQUEST).end();
            }
        } catch (e) {
            console.error(e);
            res.status(HttpCodeUtil.INTERNAL_SERVER_ERROR).end();
        }
    });
};
