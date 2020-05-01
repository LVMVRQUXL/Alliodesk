const bodyParser = require('body-parser');

const UserController = require('../controllers').UserController;
const UserStatusMiddleware = require('../middlewares').UserStatusMiddleware;
const HttpCodeUtil = require('../utils').HttpCodeUtil;

module.exports = (app) => {

    // GET  /users  ===> Get all users
    app.get('/users', UserStatusMiddleware.checkStatusForUsers(),
        async (req, res, next) => {
            try {
                const users = await UserController.findAllUsers();
                if (users) { res.status(HttpCodeUtil.OK).json(users); }
            } catch (e) {
                console.error(e);
            } finally { res.status(HttpCodeUtil.BAD_REQUEST).end(); }
    });

    // POST /users  ===> Create one user
    app.post('/users', bodyParser.json(), UserStatusMiddleware.checkStatusForUsers(),
        async (req, res, next) => {
            try {
                if (req.body.name || req.body.email || req.body.login || req.body.password) {
                    const result = await UserController.createUser(req.body.name, req.body.email,
                        req.body.login, req.body.password);
                    if (result) { res.status(HttpCodeUtil.CREATED).end(); }
                }
            } catch (e) {
                console.error(e);
            } finally { res.status(HttpCodeUtil.BAD_REQUEST).end(); }
        });

    // GET  /users/:id  ===> Get one user from id
    app.get('/users/:id', async (req, res, next) => {
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
    app.delete('/users/:id', (req, res, next) => {
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end(); // TODO: not implemented!
    });

    // UPDATE   /users/:id  ===> Update one user from id
    app.set('/users/:id', bodyParser.json(), (req, res, next) => {
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end(); // TODO: not implemented!
    });

};