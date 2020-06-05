const bodyParser = require('body-parser');

const HttpCodeUtil = require('../utils').HttpCodeUtil;
const ErrorController = require('../controllers').ErrorController;

const routes = {
    ErrorsId: '/errors/:id',
    Errors: '/errors'
};

module.exports = (app) => {
    // TODO: PUT '/errors/:id' => Update one error from id
    app.put(routes.ErrorsId, async (req, res) => {
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end();
    });

    // TODO: DELETE '/errors/:id' => Remove one error from id
    app.delete(routes.ErrorsId, async (req, res) => {
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end();
    });

    // TODO: GET '/errors/:id' => Get one error from id
    app.get(routes.ErrorsId, async (req, res) => {
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end();
    });

    /**
     * @swagger
     *
     * '/errors':
     *   get:
     *     description: Get all errors
     *     tags:
     *       - Errors
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: Ok
     *       204:
     *         description: No errors to return
     *       500:
     *         description: An internal error has occurred
     */
    app.get(routes.Errors, async (req, res) => {
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
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: message
     *         description: Error's message
     *         in: body
     *         required: true
     *     responses:
     *       201:
     *         description: Error successfully created
     *       400:
     *         description: Invalid error's message
     *       409:
     *         description: Conflict encountered
     *       500:
     *         description: An internal error has occurred
     */
    app.post(routes.Errors, bodyParser.json(), async (req, res) => {
        try {
            const errorMessage = req.body.message;
            if (errorMessage && errorMessage.length >= 3) {
                const error = await ErrorController.createError(errorMessage);
                if (error) {
                    res.status(HttpCodeUtil.CREATED).json(error);
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
};
