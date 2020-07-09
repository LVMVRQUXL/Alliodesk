const router = require('express').Router();
const bodyParser = require('body-parser');

const HttpCodeUtil = require('../utils').HttpCodeUtil;
const {AdminMiddleware, ServiceStatusMiddleware, UserMiddleware} = require('../middlewares');
const ServiceController = require('../controllers').ServiceController;

// noinspection JSUnresolvedFunction
router.use(ServiceStatusMiddleware.checkStatusForServices());

// noinspection JSUnresolvedFunction
/**
 * @swagger
 *
 * '/services/{id}/feedbacks':
 *   get:
 *     description: Get all feedbacks of one service from id
 *     tags:
 *       - Services
 *       - Feedbacks
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: Service's id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: "Ok"
 *       204:
 *         description: "No feedbacks to return"
 *       400:
 *         description: "Invalid service's id"
 *       404:
 *         description: "Can't find service"
 *       500:
 *         description: "An internal error has occurred"
 */
router.get('/:id/feedbacks', async (req, res) => {
    try {
        const serviceId = parseInt(req.params.id);
        if (isNaN(serviceId)) {
            res.status(HttpCodeUtil.BAD_REQUEST).end();
        } else if (!await ServiceController.findOneServiceFromId(serviceId)) {
            res.status(HttpCodeUtil.NOT_FOUND).end();
        } else {
            const feedbackDTOS = await ServiceController.findAllFeedbacksOfOneServiceFromId(serviceId);
            if (feedbackDTOS.length === 0) {
                res.status(HttpCodeUtil.NO_CONTENT).end();
            } else {
                res.status(HttpCodeUtil.OK).json(feedbackDTOS);
            }
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
 * '/services/{id}/reject':
 *   put:
 *     description: "Reject one service from id"
 *     tags:
 *       - Services
 *     security:
 *       - bearerToken: []
 *     parameters:
 *       - name: id
 *         description: "Service's id"
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: "Ok"
 *       400:
 *         description: "Invalid inputs"
 *       401:
 *         description: "Invalid administrator's token session"
 *       404:
 *         description: "Can't find service"
 *       500:
 *         description: "An internal error has occurred"
 */
router.put('/:id/reject', AdminMiddleware.checkIfIsAdminFromToken(), async (req, res) => {
    try {
        const serviceId = parseInt(req.params.id);
        if (!isNaN(serviceId)) {
            const result = await ServiceController.rejectOneServiceFromId(serviceId);
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
 * '/services/{id}/validate':
 *   put:
 *     description: "Validate one service from id"
 *     tags:
 *       - Services
 *     security:
 *       - bearerToken: []
 *     parameters:
 *       - name: id
 *         description: "Service's id"
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: "Ok"
 *       400:
 *         description: "Invalid id"
 *       401:
 *         description: "Invalid administrator's token session"
 *       404:
 *         description: "Can't find service"
 *       500:
 *         description: "An internal error has occurred"
 */
router.put('/:id/validate', AdminMiddleware.checkIfIsAdminFromToken(), async (req, res) => {
    try {
        const serviceId = parseInt(req.params.id);
        if (!isNaN(serviceId)) {
            const result = await ServiceController.validateOneServiceFromId(serviceId);
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
 * '/services/{id}':
 *   get:
 *     description: "Get one service from id"
 *     tags:
 *       - Services
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: "Service's id"
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: "Ok"
 *       404:
 *         description: "Can't find service"
 *       400:
 *         description: "Invalid id"
 *       500:
 *         description: "An internal error has occurred"
 */
router.get('/:id', async (req, res) => {
    try {
        const serviceId = parseInt(req.params.id);
        if (!isNaN(serviceId)) {
            const service = await ServiceController.findOneServiceFromId(serviceId);
            if (service) {
                res.status(HttpCodeUtil.OK).json(service);
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
 * '/services/{id}':
 *   delete:
 *     description: "Remove one service from id"
 *     tags:
 *       - Services
 *     security:
 *       - bearerToken: []
 *     parameters:
 *       - name: id
 *         description: "Service's id"
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: "Ok"
 *       400:
 *         description: "Invalid id"
 *       401:
 *         description: "Invalid administrator's token session"
 *       404:
 *         description: "Can't find service"
 *       500:
 *         description: "An internal error has occurred"
 */
router.delete('/:id', AdminMiddleware.checkIfIsAdminFromToken(), async (req, res) => {
    try {
        const serviceId = parseInt(req.params.id);
        if (!isNaN(serviceId)) {
            const result = await ServiceController.removeOneServiceFromId(serviceId);
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
 * '/services/{id}':
 *   put:
 *     description: "Update one service from id"
 *     tags:
 *       - Services
 *     security:
 *       - bearerToken: []
 *     parameters:
 *       - name: id
 *         description: "Service's id"
 *         in: path
 *         required: true
 *       - name: name
 *         description: "New service's name"
 *         in: body
 *       - name: version
 *         description: "New service's version"
 *         in: body
 *       - name: source_url
 *         description: "New service's source URL"
 *         in: body
 *       - name: update_config_link
 *         description: New service's updating configuration link
 *         in: body
 *     responses:
 *       200:
 *         description: "Ok"
 *       400:
 *         description: "Invalid inputs"
 *       401:
 *         description: "Invalid administrator's token session"
 *       404:
 *         description: "Can't find service"
 *       500:
 *         description: "An internal error has occurred"
 */
router.put('/:id', AdminMiddleware.checkIfIsAdminFromToken(), bodyParser.json(), async (req, res) => {
    try {
        const serviceId = parseInt(req.params.id);
        const newValues = {
            name: req.body.name,
            version: req.body.version,
            source_url: req.body.source_url,
            update_config_link: req.body.update_config_link
        };
        if (!isNaN(serviceId)
            && ((newValues.name && newValues.name !== "")
                || (newValues.version && newValues.version !== "")
                || (newValues.source_url && newValues.source_url !== "")
                || (newValues.update_config_link && newValues.update_config_link !== ''))) {
            const result = await ServiceController.updateOneServiceFromId(serviceId, newValues);
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
 * '/services':
 *   get:
 *     description: "Get all services"
 *     tags:
 *       - Services
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: "Ok"
 *       204:
 *         description: "No services to return"
 *       500:
 *         description: "An internal error has occurred"
 */
router.get('/', async (req, res) => {
    try {
        const services = await ServiceController.findAllServices();
        if (services.length > 0) {
            res.status(HttpCodeUtil.OK).json(services);
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
 * '/services':
 *   post:
 *     description: "Create a new service with pending status"
 *     tags:
 *       - Services
 *     security:
 *       - bearerToken: []
 *     parameters:
 *       - name: name
 *         description: "Service's name"
 *         in: body
 *         required: true
 *       - name: version
 *         description: "Service's version"
 *         in: body
 *         required: true
 *       - name: source_url
 *         description: "Service's source URL (Github, Gitlab...)"
 *         in: body
 *         required: true
 *       - name: update_config_link
 *         description: "Link to the configuration.xml file of the source repository (useful for automated updates)"
 *         in: body
 *         required: true
 *     responses:
 *       201:
 *         description: "New service created"
 *       400:
 *         description: "Invalid input(s)"
 *       401:
 *         description: Unauthorized operation (you need to be logged in as a user)
 *       409:
 *         description: "A service with the given name already exists"
 *       500:
 *         description: "An internal error has occurred"
 */
router.post('/', bodyParser.json(), async (req, res) => {
    try {
        const values = {
            name: req.body.name,
            version: req.body.version,
            source_url: req.body.source_url,
            update_config_link: req.body.update_config_link
        };
        const userToken = UserMiddleware.extractTokenFromHeaders(req.headers);
        if (values.name && values.name !== ""
            && values.version && values.version !== ""
            && values.source_url && values.source_url !== ""
            && values.update_config_link && values.update_config_link !== ""
            && userToken && userToken !== "") {
            const service = await ServiceController.createService(values, userToken);
            if (service) {
                res.status(HttpCodeUtil.CREATED).json(service);
            } else if (service === null) {
                res.status(HttpCodeUtil.UNAUTHORIZED).end();
            } else {
                res.status(HttpCodeUtil.CONFLICT).end();
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
