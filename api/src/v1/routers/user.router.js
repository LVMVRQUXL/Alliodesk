const router = require('express').Router();
const bodyParser = require('body-parser');
const emailValidator = require('email-validator');

const UserController = require('../controllers').UserController;
const {UserStatusMiddleware, UserMiddleware} = require('../middlewares');
const HttpCodeUtil = require('../utils').HttpCodeUtil;

// noinspection JSUnresolvedFunction
router.use(UserStatusMiddleware.checkStatusForUsers());

// noinspection JSUnresolvedFunction
/**
 * @swagger
 *
 * '/users/me/infos':
 *   get:
 *     description: Get information of the user currently logged in
 *     tags:
 *       - Users
 *     security:
 *       - bearerToken: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Ok
 *       400:
 *         description: Invalid token session
 *       401:
 *         description: Unauthorized operation
 *       500:
 *         description: An internal error has occurred
 */
router.get('/me/infos', async (req, res) => {
    try {
        const userToken = UserMiddleware.extractTokenFromHeaders(req.headers);
        if (userToken && userToken !== '') {
            const user = await UserController.findOneUserFromToken(userToken);
            if (user) {
                res.status(HttpCodeUtil.OK).json(user);
            } else {
                res.status(HttpCodeUtil.UNAUTHORIZED).end();
            }
        } else {
            res.status(HttpCodeUtil.BAD_REQUEST).end();
        }
    } catch (e) {
        console.error(e);
        res.status(HttpCodeUtil.INTERNAL_SERVER_ERROR).end();
    }
});

// noinspection JSUnresolvedFunction
/**
 * @swagger
 *
 * '/users/login':
 *   put:
 *     description: "Login one user"
 *     tags:
 *       - Users
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
router.put('/login', bodyParser.json(), async (req, res) => {
    try {
        const userLogin = req.body.login;
        const userPassword = req.body.password;
        if (userLogin && userLogin !== "" && userPassword && userPassword !== "") {
            const token = await UserController.loginOneUser(userLogin, userPassword);
            if (token) {
                res.status(HttpCodeUtil.OK).json({token_session: token});
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

// noinspection JSUnresolvedFunction
/**
 * @swagger
 *
 * '/users/{id}/workspaces':
 *   get:
 *     description: Get all workspaces of one user from id
 *     tags:
 *       - Users
 *       - Workspaces
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: User's id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Ok
 *       204:
 *         description: No workspaces to return
 *       400:
 *         description: Invalid user's id
 *       404:
 *         description: Can't find user from id
 *       500:
 *         description: An internal error has occurred
 */
router.get('/:id/workspaces', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (!isNaN(userId) && userId > 0) {
            const workspaces = await UserController.findAllWorkspacesOfOneUserFromId(userId);
            if (workspaces && workspaces.length > 0) {
                res.status(HttpCodeUtil.OK).json(workspaces);
            } else if (workspaces) {
                res.status(HttpCodeUtil.NO_CONTENT).end();
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

// noinspection JSUnresolvedFunction
/**
 * TODO: fix bug
 * @swagger
 *
 * '/users/{id}/services/{service_id}':
 *   get:
 *     description: Get a service of one user from id
 *     tags:
 *       - Users
 *       - Services
 *     security:
 *       - bearerToken: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: User's id
 *         in: path
 *         required: true
 *       - name: service_id
 *         description: Service's id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Ok
 *       400:
 *         description: Invalid user id or service id
 *       401:
 *         description: Invalid user's token session
 *       404:
 *         description: Can't find user or service from id
 *       500:
 *         description: An internal error has occurred
 */
router.get('/:id/services/:service_id', UserMiddleware.checkIfUserIsLoggedInFromToken(),
    async (req, res) => {
        try {
            const userId = parseInt(req.params.id);
            const serviceId = parseInt(req.params.service_id);
            if (!isNaN(userId) && !isNaN(serviceId)) {
                const service = await UserController.findOneServiceOfOneUserFromId(userId, serviceId);
                if (service && service.length > 0) {
                    res.status(HttpCodeUtil.OK).json(service[0]);
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
    }
);

// noinspection JSUnresolvedFunction
/**
 * @swagger
 *
 * '/users/{id}/services/{service_id}':
 *   delete:
 *     description: Remove a service of one user from id
 *     tags:
 *       - Users
 *       - Services
 *     security:
 *       - bearerToken: []
 *     parameters:
 *       - name: id
 *         description: User's id
 *         in: path
 *         required: true
 *       - name: service_id
 *         description: Service's id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Ok
 *       400:
 *         description: Invalid user id or service id
 *       401:
 *         description: Invalid user's token session
 *       404:
 *         description: Can't find user or service from id
 *       500:
 *         description: An internal error has occurred
 */
router.delete('/:id/services/:service_id', UserMiddleware.checkIfUserIsLoggedInFromToken(),
    async (req, res) => {
        try {
            const userId = parseInt(req.params.id);
            const serviceId = parseInt(req.params.service_id);
            if (!isNaN(userId) && !isNaN(serviceId)) {
                const result = await UserController.removeServiceOfOneUserFromId(userId, serviceId);
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
    }
);

// noinspection JSUnresolvedFunction
/**
 * @swagger
 *
 * '/users/{id}/services':
 *   post:
 *     description: Add a service in one user's account from id
 *     tags:
 *       - Users
 *       - Services
 *     security:
 *       - bearerToken: []
 *     parameters:
 *       - name: id
 *         description: User's id
 *         in: path
 *         required: true
 *       - name: service_id
 *         description: Service's id
 *         in: body
 *         required: true
 *     responses:
 *       200:
 *         description: Ok
 *       400:
 *         description: Invalid user id or service id
 *       401:
 *         description: Invalid user's token session
 *       404:
 *         description: Can't find user or service from id
 *       500:
 *         description: An internal error has occurred
 */
router.post('/:id/services', UserMiddleware.checkIfUserIsLoggedInFromToken(),
    bodyParser.json(), async (req, res) => {
        try {
            const userId = parseInt(req.params.id);
            const serviceId = req.body.service_id;
            if (!isNaN(userId) && serviceId) {
                const result = await UserController.addServiceInOneUserAccountFromId(userId, serviceId);
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
    }
);

// noinspection JSUnresolvedFunction
/**
 * @swagger
 *
 * '/users/{id}/services':
 *   get:
 *     description: Get all services of one user from id
 *     tags:
 *       - Users
 *       - Services
 *     security:
 *       - bearerToken: []
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: id
 *         description: User's id
 *         in: path
 *         required: true
 *     responses:
 *       200:
 *         description: Ok
 *       204:
 *         description: No services to return
 *       400:
 *         description: Invalid id
 *       401:
 *         description: Invalid user's token session
 *       404:
 *         description: Can't find user from id
 *       500:
 *         description: An internal error has occurred
 */
router.get('/:id/services', UserMiddleware.checkIfUserIsLoggedInFromToken(),
    async (req, res) => {
        try {
            const userId = parseInt(req.params.id);
            if (!isNaN(userId)) {
                const services = await UserController.findAllServicesOfOneUserFromId(userId);
                if (services && services.length > 0) {
                    res.status(HttpCodeUtil.OK).json(services);
                } else if (services) {
                    res.status(HttpCodeUtil.NO_CONTENT).end();
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
    }
);

// noinspection JSUnresolvedFunction
/**
 * @swagger
 *
 * '/users/{id}/logout':
 *   put:
 *     description: "Logout one user from id"
 *     tags:
 *       - Users
 *     security:
 *       - bearerToken: []
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
 *         description: "Invalid id and/or token session"
 *       500:
 *         description: "An internal error has occurred"
 */
router.put('/:id/logout', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        const userTokenSession = UserMiddleware.extractTokenFromHeaders(req.headers);
        if (!isNaN(userId) && userTokenSession && userTokenSession !== "") {
            const result = await UserController.logoutOneUser(userId, userTokenSession);
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

// noinspection JSUnresolvedFunction
/**
 * @swagger
 *
 * '/users/{id}':
 *   delete:
 *     description: "Delete one user from id"
 *     tags:
 *       - Users
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
router.delete('/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (!isNaN(userId)) {
            const result = await UserController.removeUserFromId(userId);
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

// noinspection JSUnresolvedFunction
/**
 * @swagger
 *
 * '/users/{id}':
 *   get:
 *     description: "Get one user from id"
 *     tags:
 *       - Users
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
router.get('/:id', async (req, res) => {
    try {
        const userId = parseInt(req.params.id);
        if (!isNaN(userId)) {
            const user = await UserController.findOneUserFromId(userId);
            if (user) {
                res.status(HttpCodeUtil.OK).json(user);
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

// noinspection JSUnresolvedFunction
/**
 * @swagger
 *
 * '/users/{id}':
 *   put:
 *     description: "Update one user from id"
 *     tags:
 *       - Users
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
router.put('/:id', bodyParser.json(), async (req, res) => {
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

// noinspection JSUnresolvedFunction
/**
 * @swagger
 *
 * '/users':
 *   get:
 *     description: "Get all users"
 *     tags:
 *       - Users
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
router.get('/', async (req, res) => {
    try {
        const users = await UserController.findAllUsers();
        if (users.length > 0) {
            res.status(HttpCodeUtil.OK).json(users);
        } else {
            res.status(HttpCodeUtil.NO_CONTENT).end();
        }
    } catch (e) {
        console.error(e);
        res.status(HttpCodeUtil.INTERNAL_SERVER_ERROR).end();
    }
});

// noinspection JSUnresolvedFunction
/**
 * @swagger
 *
 * '/users':
 *   post:
 *     description: "Create one user"
 *     tags:
 *       - Users
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
router.post('/', bodyParser.json(), async (req, res) => {
    try {
        const userName = req.body.name;
        const userEmail = req.body.email;
        const userLogin = req.body.login;
        const userPassword = req.body.password;
        if (userName && userName !== ""
            && emailValidator.validate(userEmail)
            && userLogin && userLogin !== ""
            && userPassword && userPassword !== "") {
            const user = await UserController.createUser(userName, userEmail, userLogin, userPassword);
            if (user) {
                res.status(HttpCodeUtil.CREATED).json(user);
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

module.exports = router;
