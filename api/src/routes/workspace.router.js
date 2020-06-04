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
    /**
     * @swagger
     * TODO: add rights & integration tests
     *
     * '/workspaces/{id}/services/{service_id}':
     *   delete:
     *     description: Remove one service from one workspace by id
     *     tags:
     *       - Workspaces
     *       - Services
     *     parameters:
     *       - name: id
     *         description: Workspace's id
     *         in: path
     *         required: true
     *       - name: service_id
     *         description: Service's id
     *         in: path
     *         required: true
     *     responses:
     *       200:
     *         description: Ok
     *       400:
     *         description: Invalid inputs
     *       404:
     *         description: Can't find workspace or service from id
     *       500:
     *         description: An internal error has occurred
     */
    app.delete(routes.WorkspacesIdServicesService_id, async (req, res) => {
        try {
            const workspaceId = parseInt(req.params.id);
            const serviceId = parseInt(req.params.service_id);
            if (!isNaN(workspaceId) && !isNaN(serviceId)) {
                const result = await WorkspaceController.removeOneServiceOfOneWorkspaceFromId(workspaceId, serviceId);
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
     * TODO: add rights & integration tests
     *
     * '/workspaces/{id}/services':
     *   get:
     *     description: Get all services of one workspace from id
     *     tags:
     *       - Workspaces
     *       - Services
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
     *       204:
     *         description: No services to return
     *       400:
     *         description: Invalid workspace's id
     *       404:
     *         description: Can't find workspace from id
     *       500:
     *         description: An internal error has occurred
     */
    app.get(routes.WorkspacesIdServices, async (req, res) => {
        try {
            const workspaceId = parseInt(req.params.id);
            if (!isNaN(workspaceId)) {
                const services = await WorkspaceController.findAllServicesOfOneWorkspaceFromId(workspaceId);
                if (services && services.length > 0) {
                    res.status(HttpCodeUtil.OK).json(services);
                } else if (services) {
                    res.status(HttpCodeUtil.NO_CONTENT).end();
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
     * TODO: add rights & integration tests
     *
     * '/workspaces/{id}/services':
     *   post:
     *     description: Add a new service in one workspace from id
     *     tags:
     *       - Workspaces
     *       - Services
     *     parameters:
     *       - name: id
     *         description: Workspace's id
     *         in: path
     *         required: true
     *       - name: service_id
     *         description: Service's id
     *         in: body
     *         required: true
     *     responses:
     *       201:
     *         description: Service successfully added
     *       400:
     *         description: Invalid inputs
     *       404:
     *         description: Can't find service or workspace from ids
     *       500:
     *         description: An internal error has occurred
     */
    app.post(routes.WorkspacesIdServices, bodyParser.json(), async (req, res) => {
        try {
            const workspaceId = parseInt(req.params.id);
            const serviceId = parseInt(req.body.service_id);
            if (!isNaN(workspaceId) && !isNaN(serviceId)) {
                const result = await WorkspaceController.addOneServiceInOneWorkspaceFromId(workspaceId, serviceId);
                if (result) {
                    res.status(HttpCodeUtil.CREATED).end();
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