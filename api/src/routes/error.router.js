const bodyParser = require('body-parser');

const HttpCodeUtil = require('../utils').HttpCodeUtil;
const ErrorController = require('../controllers').ErrorController;
const {AdminMiddleware, UserMiddleware} = require('../middlewares');

const routes = {
    ErrorsId: '/errors/:id',
    Errors: '/errors'
};

module.exports = (app) => {
    /**
     * @swagger
     *
     * '/errors/{id}':
     *   delete:
     *     description: Remove one error from id
     *     tags:
     *       - Errors
     *     security:
     *       - bearerToken: []
     *     parameters:
     *       - name: id
     *         description: Error's id
     *         in: path
     *         required: true
     *     responses:
     *       200:
     *         description: Ok
     *       400:
     *         description: Invalid error's id or administrator's token session
     *       401:
     *         description: Unauthorized operation
     *       404:
     *         description: Can't find error from id
     *       500:
     *         description: An internal error has occurred
     */
    app.delete(routes.ErrorsId, AdminMiddleware.checkIfIsAdminFromToken(), async (req, res) => {
        try {
            const errorId = parseInt(req.params.id);
            if (errorId && errorId > 0) {
                const result = await ErrorController.removeOneErrorFromId(errorId);
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
     * '/errors/{id}':
     *   get:
     *     description: Get one error from id
     *     tags:
     *       - Errors
     *     security:
     *       - bearerToken: []
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: Error's id
     *         in: path
     *         required: true
     *     responses:
     *       200:
     *         description: Ok
     *       204:
     *         description: No errors to return
     *       400:
     *         description: Invalid error's id or administrator's token session
     *       401:
     *         description: Unauthorized operation
     *       404:
     *         description: Can't find error from id
     *       500:
     *         description: An internal error has occurred
     */
    app.get(routes.ErrorsId, AdminMiddleware.checkIfIsAdminFromToken(), async (req, res) => {
        try {
            const errorId = parseInt(req.params.id);
            if (errorId && errorId > 0) {
                const error = await ErrorController.findOneErrorFromId(errorId);
                if (error) {
                    res.status(HttpCodeUtil.OK).json(error);
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
     * '/errors':
     *   get:
     *     description: Get all errors
     *     tags:
     *       - Errors
     *     security:
     *       - bearerToken: []
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Ok
     *       204:
     *         description: No errors to return
     *       400:
     *         description: Invalid administrator's token session
     *       401:
     *         description: Unauthorized operation
     *       500:
     *         description: An internal error has occurred
     */
    app.get(routes.Errors, AdminMiddleware.checkIfIsAdminFromToken(), async (req, res) => {
        try {
            const errors = await ErrorController.findAllErrors();
            if (errors && errors.length > 0) {
                res.status(HttpCodeUtil.OK).json(errors);
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
     * '/errors':
     *   post:
     *     description: Create a new error
     *     tags:
     *       - Errors
     *     security:
     *       - bearerToken: []
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: message
     *         description: Error's message
     *         in: body
     *         required: true
     *       - name: service_name
     *         description: Target service's name
     *         in: body
     *         required: false
     *     responses:
     *       201:
     *         description: Error successfully created
     *       400:
     *         description: Invalid error's message or target service's name
     *       404:
     *         description: Can't find user from token session or service from name
     *       500:
     *         description: An internal error has occurred
     */
    app.post(routes.Errors, bodyParser.json(), async (req, res) => {
        try {
            const errorMessage = req.body.message;
            const serviceName = req.body.service_name;
            const userToken = UserMiddleware.extractTokenFromHeaders(req.headers);
            if (errorMessage && errorMessage.length >= 3
                && userToken && userToken !== ''
                && ((serviceName && serviceName !== '') || !serviceName)) {
                const error = await ErrorController.createError(errorMessage, userToken, serviceName);
                if (error) {
                    res.status(HttpCodeUtil.CREATED).json(error);
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
};
