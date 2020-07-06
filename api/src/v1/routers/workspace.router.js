const router = require('express').Router();
const bodyParser = require('body-parser');

const HttpCodeUtil = require('../utils').HttpCodeUtil;
const WorkspaceController = require('../controllers').WorkspaceController;
const UserMiddleware = require('../middlewares').UserMiddleware;

// noinspection JSUnresolvedFunction
/**
 * @swagger
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
router.delete('/:id/services/:service_id', async (req, res) => {
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

// noinspection JSUnresolvedFunction
/**
 * @swagger
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
router.get('/:id/services', async (req, res) => {
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

// noinspection JSUnresolvedFunction
/**
 * @swagger
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
router.post('/:id/services', bodyParser.json(), async (req, res) => {
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

// noinspection JSUnresolvedFunction
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
router.get('/:id', async (req, res) => {
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

// noinspection JSUnresolvedFunction
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
router.delete('/:id', async (req, res) => {
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

// noinspection JSUnresolvedFunction
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
router.put('/:id', bodyParser.json(), async (req, res) => {
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

// noinspection JSUnresolvedFunction
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
router.get('/', async (req, res) => {
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

// noinspection JSUnresolvedFunction
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
router.post('/', bodyParser.json(), async (req, res) => {
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

module.exports = router;
