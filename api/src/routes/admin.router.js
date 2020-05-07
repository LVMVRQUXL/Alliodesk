const bodyParser = require('body-parser');
const emailValidator = require('email-validator');

const UserStatusMiddleware = require('../middlewares').UserStatusMiddleware;
const HttpCodeUtil = require('../utils').HttpCodeUtil;
const AdminController = require('../controllers').AdminController;

const routes = {
    AdminsLogin: '/admins/login',
    AdminsIdLogout: '/admins/:id/logout',
    AdminsId: '/admins/:id',
    Admins: '/admins'
};

module.exports = (app) => {

    app.use(UserStatusMiddleware.checkStatusForAdmins());

    /**
     * @swagger
     *
     * '/admins/login':
     *   put:
     *     description: "Login one administrator"
     *     tags:
     *       - admins
     *     parameters:
     *       - name: login
     *         description: "Administrator's login"
     *         in: body
     *         required: true
     *       - name: password
     *         description: "Administrator's password"
     *         in: body
     *         required: true
     *     responses:
     *       200:
     *         description: "Ok"
     *       404:
     *         description: "Can't find administrator"
     *       400:
     *         description: "Invalid login and/or password"
     *       500:
     *         description: "An internal error has occurred"
     */
    app.put(routes.AdminsLogin, bodyParser.json(), async (req, res) => { // TODO: integration tests!
        try {
            const adminLogin = req.body.login;
            const adminPassword = req.body.password;
            if (adminLogin && adminLogin !== "" && adminPassword && adminPassword !== "") {
                const token = await AdminController.loginOneAdmin(adminLogin, adminPassword);
                if (token) { res.status(HttpCodeUtil.OK).json({ token_session: token }); }
                else { res.status(HttpCodeUtil.NOT_FOUND).end(); }
            } else { res.status(HttpCodeUtil.BAD_REQUEST).end(); }
        } catch (e) {
            console.error(e);
            res.status(HttpCodeUtil.INTERNAL_SERVER_ERROR).end();
        }
    });

    /**
     * @swagger
     *
     * '/admins/{id}/logout':
     *   put:
     *     description: "Logout one administrator from id"
     *     tags:
     *       - admins
     *     parameters:
     *       - name: id
     *         description: "Administrator's id"
     *         in: path
     *         required: true
     *       - name: token_session
     *         description: "Administrator's token session"
     *         in: body
     *         required: true
     *     responses:
     *       200:
     *         description: "Ok"
     *       404:
     *         description: "Can't find administrator"
     *       400:
     *         description: "Invalid id and/or token session"
     *       500:
     *         description: "An internal error has occurred"
     */
    app.put(routes.AdminsIdLogout, async (req, res) => { // TODO: integration tests!
        try {
            const userId = parseInt(req.params.id);
            const userTokenSession = req.body.token_session;
            if (!isNaN(userId) && userTokenSession && userTokenSession !== "") {
                const result = await AdminController.logoutOneAdmin(userId, userTokenSession);
                if (result) { res.status(HttpCodeUtil.OK).end(); }
                else { res.status(HttpCodeUtil.NOT_FOUND).end(); }
            } else { res.status(HttpCodeUtil.BAD_REQUEST).end(); }
        } catch (e) {
            console.error(e);
            res.status(HttpCodeUtil.INTERNAL_SERVER_ERROR).end();
        }
    });

    /**
     * @swagger
     *
     * '/admins/{id}':
     *   get:
     *     description: "Get one administrator from id"
     *     tags:
     *       - admins
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: id
     *         description: "Administrator's id"
     *         in: path
     *         required: true
     *     responses:
     *       200:
     *         description: "Ok"
     *       404:
     *         description: "Can't find administrator"
     *       400:
     *         description: "Invalid id"
     *       500:
     *         description: "An internal error has occurred"
     */
    app.get(routes.AdminsId, async (req, res) => { // TODO: integration tests!
        try {
            const adminId = parseInt(req.params.id);
            if (!isNaN(adminId)) {
                const admin = await AdminController.findOneAdminFromId(adminId);
                if (admin) { res.status(HttpCodeUtil.OK).json(admin); }
                else { res.status(HttpCodeUtil.NOT_FOUND).end(); }
            } else { res.status(HttpCodeUtil.BAD_REQUEST).end(); }
        } catch (e) {
            console.error(e);
            res.status(HttpCodeUtil.INTERNAL_SERVER_ERROR).end();
        }
    });

    /**
     * @swagger
     *
     * '/admins/{id}':
     *   delete:
     *     description: "Delete one administrator from id"
     *     tags:
     *       - admins
     *     parameters:
     *       - name: id
     *         description: "Administrator's id"
     *         in: path
     *         required: true
     *     responses:
     *       200:
     *         description: "Ok"
     *       404:
     *         description: "Can't find administrator"
     *       400:
     *         description: "Invalid id"
     *       500:
     *         description: "An internal error has occurred"
     */
    app.delete(routes.AdminsId, async (req, res) => { // TODO: integration tests!
        try {
            const adminId = parseInt(req.params.id);
            if (!isNaN(adminId)) {
                const result = await AdminController.removeAdminFromId(adminId);
                if (result) { res.status(HttpCodeUtil.OK).end(); }
                else { res.status(HttpCodeUtil.NOT_FOUND).end(); }
            } else { res.status(HttpCodeUtil.BAD_REQUEST).end(); }
        } catch (e) {
            console.error(e);
            res.status(HttpCodeUtil.INTERNAL_SERVER_ERROR).end();
        }
    });

    // PUT   /admins/:id ===> Update one administrator from id
    app.put(routes.AdminsId, async (req, res) => { // TODO: not implemented!
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end();
    });

    /**
     * @swagger
     *
     * '/admins':
     *   get:
     *     description: "Get all administrators"
     *     tags:
     *       - admins
     *     produces:
     *       - application/json
     *     responses:
     *       200:
     *         description: "Ok"
     *       204:
     *         description: "No administrators to return"
     *       500:
     *         description: "An internal error has occurred"
     */
    app.get(routes.Admins, async (req, res) => { // TODO: integration tests!
        try {
            const admins = await AdminController.findAllAdmins();
            if (admins.length > 0) { res.status(HttpCodeUtil.OK).json(admins); }
            else { res.status(HttpCodeUtil.NO_CONTENT).end(); }
        } catch (e) {
            console.error(e);
            res.status(HttpCodeUtil.INTERNAL_SERVER_ERROR).end();
        }
    });

    /**
     * @swagger
     *
     * '/admins':
     *   post:
     *     description: "Create one administrator"
     *     tags:
     *       - admins
     *     produces:
     *       - application/json
     *     parameters:
     *       - name: name
     *         description: "Administrator's name"
     *         in: body
     *         required: true
     *       - name: email
     *         description: "Administrator's email"
     *         in: body
     *         required: true
     *       - name: login
     *         description: "Administrator's login"
     *         in: body
     *         required: true
     *       - name: password
     *         description: "Administrator's password"
     *         in: body
     *         required: true
     *     responses:
     *       201:
     *         description: "Created"
     *       409:
     *         description: "Administrator is already existing"
     *       400:
     *         description: "Invalid inputs"
     *       500:
     *         description: "An internal error has occurred"
     */
    app.post(routes.Admins, bodyParser.json(), async (req, res) => { // TODO: integration tests!
        try {
            const adminName = req.body.name;
            const adminEmail = req.body.email;
            const adminLogin = req.body.login;
            const adminPassword = req.body.password;
            if (adminName && adminName !== ""
                && emailValidator.validate(adminEmail)
                && adminLogin && adminLogin !== ""
                && adminPassword && adminPassword !== "") {
                const result = await AdminController.createAdmin(adminName, adminEmail, adminLogin, adminPassword);
                if (result) { res.status(HttpCodeUtil.CREATED).end(); }
                else { res.status(HttpCodeUtil.CONFLICT).end(); }
            } else { res.status(HttpCodeUtil.BAD_REQUEST).end(); }
        } catch (e) {
            console.error(e);
            res.status(HttpCodeUtil.INTERNAL_SERVER_ERROR).end();
        }
    });

};
