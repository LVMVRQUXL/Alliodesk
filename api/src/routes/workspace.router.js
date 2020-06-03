const bodyParser = require('body-parser');

const HttpCodeUtil = require('../utils').HttpCodeUtil;
const WorkspaceController = require('../controllers').WorkspaceController;
const UserMiddleware = require('../middlewares').UserMiddleware;

const routes = {
    WorkspacesIdServicesService_id: '/workspaces/:id/services/:service_id',
    WorkspacesIdServices: '/workspaces/:id/services',
    WorkspacesId: '/workspaces/:id',
    Workspaces: '/workspaces'
};

module.exports = (app) => {
    // TODO: DELETE '/workspaces/{id}/services/{service_id}' ==> Remove one service from one workspace by id
    app.delete(routes.WorkspacesIdServicesService_id, async (req, res) => {
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end();
    });

    // TODO: GET '/workspaces/{id}/services' ==> Get all services of one workspace from id
    app.get(routes.WorkspacesIdServices, async (req, res) => {
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end();
    });

    // TODO: POST '/workspaces/{id}/services' ==> Add a new service in one workspace from id
    app.post(routes.WorkspacesIdServices, async (req, res) => {
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end();
    });

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
     *     security:
     *       - bearerToken: []
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
     *       401:
     *         description: Can't find user from given token session
     *       404:
     *         description: Can't find workspace from given id
     *       500:
     *         description: An internal error has occurred
     */
    app.delete(routes.WorkspacesId, async (req, res) => {
        try {
            const workspaceId = parseInt(req.params.id);
            const userToken = UserMiddleware.extractTokenFromHeaders(req.headers);
            if (!isNaN(workspaceId) && userToken && userToken !== "") {
                const result = await WorkspaceController.removeOneWorkspaceFromId(workspaceId, userToken);
                if (result) {
                    res.status(HttpCodeUtil.OK).end();
                } else if (result === false) {
                    res.status(HttpCodeUtil.NOT_FOUND).end();
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

    /**
     * @swagger
     *
     * '/workspaces/{id}':
     *   put:
     *     description: Update one workspace from id
     *     tags:
     *       - Workspaces
     *     security:
     *       - bearerToken: []
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
     *       401:
     *         description: Can't find user from given token session
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
            const userToken = UserMiddleware.extractTokenFromHeaders(req.headers);
            if (!isNaN(workspaceId)
                && ((workspaceName && workspaceName !== "") || (workspaceDescription && workspaceDescription !== ""))
                && userToken && userToken !== "") {
                const result = await WorkspaceController.updateOneWorkspaceFromId(
                    workspaceId, workspaceName, workspaceDescription, userToken
                );
                if (result) {
                    res.status(HttpCodeUtil.OK).end();
                } else if (result === false) {
                    res.status(HttpCodeUtil.NOT_FOUND).end();
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
