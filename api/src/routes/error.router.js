const HttpCodeUtil = require('../utils').HttpCodeUtil;

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

    // TODO: GET '/errors' => Get all errors
    app.get(routes.Errors, async (req, res) => {
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end();
    });

    // TODO: POST '/errors' => Create a new error
    app.post(routes.Errors, async (req, res) => {
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end();
    });
};
