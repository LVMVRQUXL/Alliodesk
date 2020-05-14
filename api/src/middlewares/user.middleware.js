class UserMiddleware {
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
