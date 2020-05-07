const bodyParser = require('body-parser');
const emailValidator = require('email-validator');

const UserStatusMiddleware = require('../middlewares').UserStatusMiddleware;
const HttpCodeUtil = require('../utils').HttpCodeUtil;
const AdminController = require('../controllers').AdminController;

const routes = {
    AdminsId: '/admins/:id',
    Admins: '/admins'
};

module.exports = (app) => {

    app.use(UserStatusMiddleware.checkStatusForAdmins());

    // GET      /admins/:id ===> Get one administrator from id
    app.get(routes.AdminsId, async (req, res) => { // TODO: not implemented!
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end();
    });

    // DELETE   /admins/:id ===> Delete one administrator from id
    app.delete(routes.AdminsId, async (req, res) => { // TODO: not implemented!
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end();
    });

    // PUT   /admins/:id ===> Update one administrator from id
    app.put(routes.AdminsId, async (req, res) => { // TODO: not implemented!
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end();
    });

    // GET      /admins     ===> Get all administrators
    app.get(routes.Admins, async (req, res) => { // TODO: not implemented!
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end();
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
