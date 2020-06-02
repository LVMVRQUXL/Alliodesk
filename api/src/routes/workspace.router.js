const bodyParser = require('body-parser');

const HttpCodeUtil = require('../utils').HttpCodeUtil;
const WorkspaceController = require('../controllers').WorkspaceController;
const UserMiddleware = require('../middlewares').UserMiddleware;

const routes = {
    WorkspacesId: '/workspaces/:id',
    Workspaces: '/workspaces'
};

module.exports = (app) => {
    /**
     * @swagger
     *
     * '/workspaces/{id}':
     *   get:
     *     description: Get one workspace from id
     *     tags:
     *       - Workspaces
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Workspace's id
     *         in: path
     *         required: true
     *     responses:
     *       200:
     *         description: Ok
     *       400:
     *         description: Invalid workspace's id
     *       404:
     *         description: Can't find workspace from given id
     *       500:
     *         description: An internal error has occurred
     */
    app.get(routes.WorkspacesId, async (req, res) => {
        try {
            const workspaceId = parseInt(req.params.id);
            if (!isNaN(workspaceId)) {
                const workspace = await WorkspaceController.findOneWorkspaceFromId(workspaceId);
                if (workspace) {
                    res.status(HttpCodeUtil.OK).json(workspace);
                } else {
                    res.status(HttpCodeUtil.NOT_FOUND).end();
                }
            } else {
                res.status(HttpCodeUtil.BAD_REQUEST).end();
            }
        } catch (e) {
            console.error(e);
            res.status(HttpCodeUtil.INTERNAL_SERVER_ERROR).end();
        }
    });

    /**
     * @swagger
     *
     * '/workspaces/{id}':
     *   delete:
     *     description: Remove one workspace from id
     *     tags:
     *       - Workspaces
     *     parameters:
     *       - name: id
     *         description: Workspace's id
     *         in: path
     *         required: true
     *     responses:
     *       200:
     *         description: Ok
     *       400:
     *         description: Invalid workspace's id
     *       404:
     *         description: Can't find workspace from given id
     *       500:
     *         description: An internal error has occurred
     */
    app.delete(routes.WorkspacesId, async (req, res) => {
        try {
            const workspaceId = parseInt(req.params.id);
            if (!isNaN(workspaceId)) {
                const result = await WorkspaceController.removeOneWorkspaceFromId(workspaceId);
                if (result) {
                    res.status(HttpCodeUtil.OK).end();
                } else {
                    res.status(HttpCodeUtil.NOT_FOUND).end();
                }
            } else {
                res.status(HttpCodeUtil.BAD_REQUEST).end();
            }
        } catch (e) {
            console.error(e);
            res.status(HttpCodeUtil.INTERNAL_SERVER_ERROR).end();
        }
    });

    /**
     * @swagger
     *
     * '/workspaces/{id}':
     *   put:
     *     description: Update one workspace from id
     *     tags:
     *       - Workspaces
     *     parameters:
     *       - name: id
     *         description: Workspace's id
     *         in: path
     *         required: true
     *       - name: name
     *         description: Workspace's name
     *         in: body
     *         required: true
     *       - name: description
     *         description: Workspace's description
     *         in: body
     *         required: true
     *     responses:
     *       200:
     *         description: Ok
     *       400:
     *         description: Invalid inputs
     *       404:
     *         description: Can't find workspace from given id
     *       500:
     *         description: An internal error has occurred
     */
    app.put(routes.WorkspacesId, bodyParser.json(), async (req, res) => {
        try {
            const workspaceId = parseInt(req.params.id);
            const workspaceName = req.body.name;
            const workspaceDescription = req.body.description;
            if (!isNaN(workspaceId)
                && ((workspaceName && workspaceName !== "") || (workspaceDescription && workspaceDescription !== ""))) {
                const result = await WorkspaceController.updateOneWorkspaceFromId(
                    workspaceId, workspaceName, workspaceDescription
                );
                if (result) {
                    res.status(HttpCodeUtil.OK).end();
                } else {
                    res.status(HttpCodeUtil.NOT_FOUND).end();
                }
            } else {
                res.status(HttpCodeUtil.BAD_REQUEST).end();
            }
        } catch (e) {
            console.error(e);
            res.status(HttpCodeUtil.INTERNAL_SERVER_ERROR).end();
        }
    });

    /**
     * @swagger
     *
     * '/workspaces':
     *   get:
     *     description: Get all workspaces
     *     tags:
     *       - Workspaces
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Ok
     *       204:
     *         description: No workspaces to return
     *       500:
     *         description: An internal error has occurred
     */
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

    /**
     * @swagger
     *
     * '/workspaces':
     *   post:
     *     description: Create a new workspace
     *     tags:
     *       - Workspaces
     *     security:
     *       - bearerToken: []
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: name
     *         description: Workspace's name
     *         in: body
     *         required: true
     *       - name: description
     *         description: Workspace's description
     *         in: body
     *         required: true
     *     responses:
     *       201:
     *         description: New workspace created
     *       400:
     *         description: Invalid workspace's name or description
     *       500:
     *         description: An internal error has occurred
     */
    app.post(routes.Workspaces, bodyParser.json(), async (req, res) => {
        try {
            const workspaceName = req.body.name;
            const workspaceDescription = req.body.description;
            const userToken = UserMiddleware.extractTokenFromHeaders(req.headers);
            if (workspaceName && workspaceName !== ""
                && workspaceDescription && workspaceDescription !== ""
                && userToken && userToken !== "") {
                const workspace = await WorkspaceController.createWorkspace(
                    workspaceName, workspaceDescription, userToken
                );
                if (workspace) {
                    res.status(HttpCodeUtil.CREATED).json(workspace);
                } else {
                    res.status(HttpCodeUtil.UNAUTHORIZED).end();
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
