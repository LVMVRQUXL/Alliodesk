const router = require('express').Router();

const routers = require('./routers');

module.exports.baseUri = '/v1';
module.exports.config = () => {
    routers.config(router);

    return router;
};
