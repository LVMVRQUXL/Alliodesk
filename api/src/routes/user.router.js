const bodyParser = require('body-parser');
const swaggerUi = require('swagger-ui-express');

const UserController = require('../controllers').UserController;
const UserStatusMiddleware = require('../middlewares').UserStatusMiddleware;
const HttpCodeUtil = require('../utils').HttpCodeUtil;

const routes = {
    Users: '/users',
    UsersId: '/users/:id'
};

module.exports = (app) => {

    app.use(UserStatusMiddleware.checkStatusForUsers());

    // GET  /users/:id  ===> Get one user from id
    app.get(routes.UsersId, async (req, res, next) => {
        try {
            const userId = parseInt(req.params.id);
            if (!isNaN(userId)) {
                const user = await UserController.findOneUserFromId(userId);
                if (user) { res.status(HttpCodeUtil.OK).json(user); }
                else { res.status(HttpCodeUtil.NOT_FOUND).end(); }
            }
        } catch (e) {
            console.error(e);
        } finally { res.status(HttpCodeUtil.BAD_REQUEST).end(); }
    });

    // DELETE   /users/:id  ===> Delete one user from id
    app.delete(routes.UsersId, async (req, res, next) => {
        try {
            const userId = parseInt(req.params.id);
            if (!isNaN(userId)) {
                const result = await UserController.removeUserFromId(userId);
                if (result) { res.status(HttpCodeUtil.OK).end(); }
                else { res.status(HttpCodeUtil.NOT_FOUND).end(); }
            }
        } catch (e) { console.error(e); }
        finally { res.status(HttpCodeUtil.BAD_REQUEST).end(); }
    });

    // PUT  /users/:id  ===> Update one user from id
    app.put(routes.UsersId, bodyParser.json(), async (req, res, next) => {
        try {
            const userId = parseInt(req.params.id);
            const userName = req.body.name;
            const userEmail = req.body.email;
            const userPassword = req.body.password;
            if (!isNaN(userId) && (userName || userEmail || userPassword)) {
                const result = await UserController.updateUserFromId(userId, userName, userEmail, userPassword);
                if (result) { res.status(HttpCodeUtil.OK).end(); }
                else { res.status(HttpCodeUtil.NOT_FOUND).end(); }
            }
        } catch (e) { console.error(e); }
        finally { res.status(HttpCodeUtil.BAD_REQUEST).end(); }
    });

    // GET  /users  ===> Get all users
    app.get(routes.Users, async (req, res, next) => {
        try {
            const users = await UserController.findAllUsers();
            if (users.length > 0) { res.status(HttpCodeUtil.OK).json(users); }
            else { res.status(HttpCodeUtil.NO_CONTENT).end(); }
        } catch (e) {
            console.error(e);
        } finally { res.status(HttpCodeUtil.BAD_REQUEST).end(); }
    });

    // POST /users  ===> Create one user
    app.post(routes.Users, bodyParser.json(), async (req, res, next) => {
        try {
            if (req.body.name && req.body.email && req.body.login && req.body.password) {
                const result = await UserController.createUser(req.body.name, req.body.email,
                    req.body.login, req.body.password);
                if (result) { res.status(HttpCodeUtil.CREATED).end(); }
                else { res.status(HttpCodeUtil.CONFLICT).end(); }
            }
        } catch (e) {
            console.error(e);
        } finally { res.status(HttpCodeUtil.BAD_REQUEST).end(); }
    });

};
