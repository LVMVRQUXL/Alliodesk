const bodyParser = require('body-parser');

const HttpCodeUtil = require('../utils').HttpCodeUtil;
const ServiceStatusMiddleware = require('../middlewares').ServiceStatusMiddleware;
const ServiceController = require('../controllers').ServiceController;

const routes = {
    ServicesIdReject: '/services/:id/reject',
    ServicesIdValidate: '/services/:id/validate',
    ServicesId: '/services/:id',
    Services: '/services'
};

module.exports = (app) => {

    app.use(ServiceStatusMiddleware.checkStatusForServices());

    /**
     * @swagger
     *
     * '/services/:id/reject':
     *   put:
     *     description: "Reject one service from id"
     *     tags:
     *       - Services
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
    app.put(routes.ServicesIdReject, async (req, res) => {
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

    /**
     * @swagger
     *
     * '/services/:id/validate':
     *   put:
     *     description: "Validate one service from id"
     *     tags:
     *       - Services
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
    app.put(routes.ServicesIdValidate, async (req, res) => {
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

    /**
     * @swagger
     *
     * '/services/:id':
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
    app.get(routes.ServicesId, async (req, res) => {
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

    /**
     * @swagger
     *
     * '/services/:id':
     *   delete:
     *     description: "Remove one service from id"
     *     tags:
     *       - Services
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
    app.delete(routes.ServicesId, async (req, res) => {
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

    /**
     * @swagger
     *
     * '/services/:id':
     *   put:
     *     description: "Update one service from id"
     *     tags:
     *       - Services
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
     *     responses:
     *       200:
     *         description: "Ok"
     *       404:
     *         description: "Can't find service"
     *       400:
     *         description: "Invalid inputs"
     *       500:
     *         description: "An internal error has occurred"
     */
    app.put(routes.ServicesId, bodyParser.json(), async (req, res) => {
        try {
            const serviceId = parseInt(req.params.id);
            const serviceName = req.body.name;
            const serviceVersion = req.body.version;
            const serviceSourceUrl = req.body.source_url;
            if (!isNaN(serviceId)
                && ((serviceName && serviceName !== "")
                    || (serviceVersion && serviceVersion !== "")
                    || (serviceSourceUrl && serviceSourceUrl !== ""))) {
                const result = await ServiceController.updateOneServiceFromId(
                    serviceId, serviceName, serviceVersion, serviceSourceUrl
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
    app.get(routes.Services, async (req, res) => {
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

    /**
     * @swagger
     *
     * '/services':
     *   post:
     *     description: "Create a new service with pending status"
     *     tags:
     *       - Services
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
     *     responses:
     *       201:
     *         description: "New service created"
     *       400:
     *         description: "Invalid input(s)"
     *       500:
     *         description: "An internal error has occurred"
     */
    app.post(routes.Services, bodyParser.json(), async (req, res) => {
        try {
            const serviceName = req.body.name;
            const serviceVersion = req.body.version;
            const serviceSourceUrl = req.body.source_url;
            if (serviceName && serviceName !== ""
                && serviceVersion && serviceVersion !== ""
                && serviceSourceUrl && serviceSourceUrl !== "") {
                const result = await ServiceController.createService(serviceName, serviceVersion, serviceSourceUrl);
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
