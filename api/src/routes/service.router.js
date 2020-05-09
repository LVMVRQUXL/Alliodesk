const bodyParser = require('body-parser');

const HttpCodeUtil = require('../utils').HttpCodeUtil;
const ServiceStatusMiddleware = require('../middlewares').ServiceStatusMiddleware;
const ServiceController = require('../controllers').ServiceController;

const routes = {
    ServicesId: '/services/:id',
    Services: '/services'
};

module.exports = (app) => {

    app.use(ServiceStatusMiddleware.checkStatusForServices());

    // GET '/services/:id' ===> Get one service from id
    app.get(routes.ServicesId, async (req, res) => {
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end(); // TODO: not implemented
    });

    // DELETE '/services/:id' ===> Remove one service from id
    app.delete(routes.ServicesId, async (req, res) => {
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end(); // TODO: not implemented
    });

    // PUT '/services/:id' ===> Update one service from id
    app.put(routes.ServicesId, bodyParser.json(), async (req, res) => {
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end(); // TODO: not implemented
    });

    /**
     * @swagger
     *
     * '/services':
     *   get:
     *     description: "Get all services"
     *     tags:
     *       - services
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
    app.get(routes.Services, async (req, res) => { // TODO: integration tests
        try {
            const services = await ServiceController.findAllServices();
            if (services.length > 0) { res.status(HttpCodeUtil.OK).json(services); }
            else { res.status(HttpCodeUtil.NO_CONTENT).end(); }
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
     *       - services
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
    app.post(routes.Services, bodyParser.json(), async (req, res) => { // TODO: integration tests
        try {
            const serviceName = req.body.name;
            const serviceVersion = req.body.version;
            const serviceSourceUrl = req.body.source_url;
            if (serviceName && serviceName !== ""
                && serviceVersion && serviceVersion !== ""
                && serviceSourceUrl && serviceSourceUrl !== "") {
                const result = await ServiceController.createService(serviceName, serviceVersion, serviceSourceUrl);
                if (result) { res.status(HttpCodeUtil.CREATED).end(); }
            } else { res.status(HttpCodeUtil.BAD_REQUEST).end(); }
        } catch (e) {
            console.error(e);
            res.status(HttpCodeUtil.INTERNAL_SERVER_ERROR).end();
        }
    });

};
