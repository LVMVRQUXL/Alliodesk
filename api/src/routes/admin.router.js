const bodyParser = require('body-parser');

const UserStatusMiddleware = require('../middlewares').UserStatusMiddleware;
const HttpCodeUtil = require('../utils').HttpCodeUtil;

const routes = {
    Admins: '/admins',
    AdminsId: '/admins/:id'
};

module.exports = (app) => {

    app.use(UserStatusMiddleware.checkStatusForAdmins());

    // GET      /admins/:id ===> Get one administrator from id
    app.get(routes.AdminsId, async (req, res, next) => { // TODO: not implemented!
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end();
    });

    // DELETE   /admins/:id ===> Delete one administrator from id
    app.delete(routes.AdminsId, async (req, res, next) => { // TODO: not implemented!
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end();
    });

    // PUT   /admins/:id ===> Update one administrator from id
    app.put(routes.AdminsId, async (req, res, next) => { // TODO: not implemented!
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end();
    });

    // GET      /admins     ===> Get all administrators
    app.get(routes.Admins, async (req, res, next) => { // TODO: not implemented!
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end();
    });

    // POST     /admins     ===> Create one administrator
    app.post(routes.Admins, async (req, res, next) => { // TODO: not implemented!
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end();
    });

};
