const bodyParser = require('body-parser');

const UserController = require('../controllers').UserController;
const UserStatusMiddleware = require('../middlewares').UserStatusMiddleware;
const HttpCodeUtil = require('../utils').HttpCodeUtil;

const routes = {
    Users: '/users',
    UsersId: '/users/:id'
};

module.exports = (app) => { // TODO: refactor all routes and update all docs!

    app.use(UserStatusMiddleware.checkStatusForUsers());

    /**
     * @swagger
     *
     * '/users/{id}':
     *   delete:
     *     description: "Delete one user from id"
     *     parameters:
     *       - name: id
     *         description: "User's id"
     *         in: path
     *         required: true
     *     responses:
     *       200:
     *         description: "Ok"
     *       404:
     *         description: "Can't find user"
     *       400:
     *         description: "Invalid id"
     *       500:
     *         description: "An internal error has occurred"
     */
    app.delete(routes.UsersId, async (req, res, next) => {
        try {
            const userId = parseInt(req.params.id);
            if (!isNaN(userId)) {
                const result = await UserController.removeUserFromId(userId);
                if (result) { res.status(HttpCodeUtil.OK).end(); }
                else { res.status(HttpCodeUtil.NOT_FOUND).end(); }
            } else { res.status(HttpCodeUtil.BAD_REQUEST).end(); }
        } catch (e) { console.error(e); }
        finally { res.status(HttpCodeUtil.INTERNAL_SERVER_ERROR).end(); }
    });

    /**
     * @swagger
     *
     * '/users/{id}':
     *   get:
     *     description: "Get one user from id"
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: "User's id"
     *         in: path
     *         required: true
     *     responses:
     *       200:
     *         description: "Ok"
     *       404:
     *         description: "Can't find user"
     *       400:
     *         description: "Invalid id"
     */
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

    /**
     * @swagger
     *
     * '/users/{id}':
     *   put:
     *     description: "Update one user from id"
     *     parameters:
     *       - name: id
     *         description: "User's id"
     *         in: path
     *         required: true
     *       - name: name
     *         description: "New user's name"
     *         in: body
     *       - name: email
     *         description: "New user's email address"
     *         in: body
     *       - name: password
     *         description: "New user's password"
     *         in: body
     *     responses:
     *       200:
     *         description: "Ok"
     *       404:
     *         description: "Can't find user"
     *       400:
     *         description: "Invalid input(s)"
     */
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

    /**
     * @swagger
     *
     * '/users':
     *   get:
     *     description: "Get all users"
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: "Ok"
     *       204:
     *         description: "No users to return"
     *       500:
     *         description: "An internal error has occurred"
     */
    app.get(routes.Users, async (req, res, next) => {
        try {
            const users = await UserController.findAllUsers();
            if (users.length > 0) { res.status(HttpCodeUtil.OK).json(users); }
            else { res.status(HttpCodeUtil.NO_CONTENT).end(); }
        } catch (e) {
            console.error(e);
        } finally { res.status(HttpCodeUtil.INTERNAL_SERVER_ERROR).end(); }
    });

    /**
     * @swagger
     *
     * '/users':
     *   post:
     *     description: "Create one user"
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: name
     *         description: "User's name"
     *         in: body
     *         required: true
     *       - name: email
     *         description: "User's email"
     *         in: body
     *         required: true
     *       - name: login
     *         description: "User's login"
     *         in: body
     *         required: true
     *       - name: password
     *         description: "User's password"
     *         in: body
     *         required: true
     *     responses:
     *       201:
     *         description: "Created"
     *       409:
     *         description: "User is already existing"
     *       400:
     *         description: "Invalid inputs"
     */
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
