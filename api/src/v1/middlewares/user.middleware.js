const HttpCodeUtil = require('../utils').HttpCodeUtil;
const UserController = require('../controllers').UserController;

class UserMiddleware {
    /**
     * Check if user is logged in from token
     *
     * @returns {Function}
     */
    checkIfUserIsLoggedInFromToken() {
        return async (req, res, next) => {
            try {
                const token = this.extractTokenFromHeaders(req.headers);
                if (token && token !== "") {
                    const user = await UserController.findOneUserFromToken(token);
                    if (user) {
                        req.userLoggedIn = user;
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

    /**
     * Extract token session from headers
     *
     * @param headers {object}
     *
     * @return {string|undefined}
     */
    extractTokenFromHeaders(headers) {
        const authorization = headers.authorization;
        if (authorization && authorization.startsWith('Bearer ')) {
            return authorization.slice(7);
        }
    }
}

module.exports = new UserMiddleware();
