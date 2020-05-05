const bodyParser = require('body-parser');
const emailValidator = require('email-validator');

const UserController = require('../controllers').UserController;
const UserStatusMiddleware = require('../middlewares').UserStatusMiddleware;
const HttpCodeUtil = require('../utils').HttpCodeUtil;

const routes = {
    Login: '/users/login',
    Logout: '/users/:id/logout',
    UsersId: '/users/:id',
    Users: '/users'
};

module.exports = (app) => {

    app.use(UserStatusMiddleware.checkStatusForUsers());

    /**
     * @swagger
     *
     * '/users/login':
     *   put:
     *     description: "Login one user"
     *     tags:
     *       - users
     *     parameters:
     *       - name: login
     *         description: "User's login"
     *         in: body
     *         required: true
     *       - name: password
     *         description: "User's password"
     *         in: body
     *         required: true
     *     responses:
     *       200:
     *         description: "Ok"
     *       404:
     *         description: "Can't find user"
     *       400:
     *         description: "Invalid login and/or password"
     *       500:
     *         description: "An internal error has occurred"
     */
    app.put(routes.Login, bodyParser.json(), async (req, res) => {
        try {
            const userLogin = req.body.login;
            const userPassword = req.body.password;
            if (userLogin && userLogin !== "" && userPassword && userPassword !== "") {
                const token = await UserController.loginOneUser(userLogin, userPassword);
                if (token) { res.status(HttpCodeUtil.OK).json({ token_session: token }); }
                else { res.status(HttpCodeUtil.NOT_FOUND).end(); }
            } else { res.status(HttpCodeUtil.BAD_REQUEST).end(); }
        } catch (e) { console.error(e); }
        finally { res.status(HttpCodeUtil.NOT_IMPLEMENTED).end(); }
    });

    // PUT /users/:id/logout   ===> Logout one user from id
    app.put(routes.Logout, async (req, res) => { // TODO: not implemented
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end();
    });

    /**
     * @swagger
     *
     * '/users/{id}':
     *   delete:
     *     description: "Delete one user from id"
     *     tags:
     *       - users
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
    app.delete(routes.UsersId, async (req, res) => {
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
     *     tags:
     *       - users
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
     *       500:
     *         description: "An internal error has occurred"
     */
    app.get(routes.UsersId, async (req, res) => {
        try {
            const userId = parseInt(req.params.id);
            if (!isNaN(userId)) {
                const user = await UserController.findOneUserFromId(userId);
                if (user) { res.status(HttpCodeUtil.OK).json(user); }
                else { res.status(HttpCodeUtil.NOT_FOUND).end(); }
            } else { res.status(HttpCodeUtil.BAD_REQUEST).end(); }
        } catch (e) { console.error(e); }
        finally { res.status(HttpCodeUtil.INTERNAL_SERVER_ERROR).end(); }
    });

    /**
     * @swagger
     *
     * '/users/{id}':
     *   put:
     *     description: "Update one user from id"
     *     tags:
     *       - users
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
     *         description: "Invalid inputs"
     *       500:
     *         description: "An internal error has occurred"
     */
    app.put(routes.UsersId, bodyParser.json(), async (req, res) => {
        try {
            const userId = parseInt(req.params.id);
            const userName = req.body.name;
            const userEmail = req.body.email;
            const userPassword = req.body.password;
            if (!isNaN(userId)
                && ((userName && userName !== "")
                    || emailValidator.validate(userEmail)
                    || (userPassword && userPassword !== ""))) {
                const result = await UserController.updateUserInfosFromId(userId, userName, userEmail, userPassword);
                if (result) { res.status(HttpCodeUtil.OK).end(); }
                else { res.status(HttpCodeUtil.NOT_FOUND).end(); }
            } else { res.status(HttpCodeUtil.BAD_REQUEST).end(); }
        } catch (e) { console.error(e); }
        finally { res.status(HttpCodeUtil.INTERNAL_SERVER_ERROR).end(); }
    });

    /**
     * @swagger
     *
     * '/users':
     *   get:
     *     description: "Get all users"
     *     tags:
     *       - users
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
    app.get(routes.Users, async (req, res) => {
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
     *     tags:
     *       - users
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
     *       500:
     *         description: "An internal error has occurred"
     */
    app.post(routes.Users, bodyParser.json(), async (req, res) => {
        try {
            const userName = req.body.name;
            const userEmail = req.body.email;
            const userLogin = req.body.login;
            const userPassword = req.body.password;
            if (userName && userName !== ""
                && emailValidator.validate(userEmail)
                && userLogin && userLogin !== ""
                && userPassword && userPassword !== "") {
                const result = await UserController.createUser(userName, userEmail, userLogin, userPassword);
                if (result) { res.status(HttpCodeUtil.CREATED).end(); }
                else { res.status(HttpCodeUtil.CONFLICT).end(); }
            } else { res.status(HttpCodeUtil.BAD_REQUEST).end(); }
        } catch (e) { console.error(e); }
        finally { res.status(HttpCodeUtil.INTERNAL_SERVER_ERROR).end(); }
    });

};
