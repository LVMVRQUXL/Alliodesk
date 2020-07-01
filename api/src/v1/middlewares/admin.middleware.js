const HttpCodeUtil = require('../utils').HttpCodeUtil;
const UserMiddleware = require('./user.middleware');
const AdminController = require('../controllers').AdminController;

class AdminMiddleware {
    /**
     * Check if is admin from token session
     *
     * @returns {Function}
     */
    checkIfIsAdminFromToken() {
        return async (req, res, next) => {
            try {
                const token = UserMiddleware.extractTokenFromHeaders(req.headers);
                if (token && token !== "") {
                    const admin = await AdminController.findOneAdminFromToken(token);
                    if (admin) {
                        next();
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
        };
    }
}

module.exports = new AdminMiddleware();
