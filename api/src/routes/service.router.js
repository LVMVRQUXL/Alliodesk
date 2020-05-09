const bodyParser = require('body-parser');

const HttpCodeUtil = require('../utils').HttpCodeUtil;

const routes = {
    ServicesId: '/services/:id',
    Services: '/services'
};

module.exports = (app) => {

    // GET '/services/:id' ===> Get one service from id
    app.get(routes.ServicesId, async (req, res) => {
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end(); // TODO: not implemented
    });

    // DELETE '/services/:id' ===> Remove one service from id
    app.delete(routes.ServicesId, async (req, res) => {
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end(); // TODO: not implemented
    });

    // PUT '/services/:id' ===> Update one service from id
    app.put(routes.ServicesId, bodyParser.json(), async (req, res) => {
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end(); // TODO: not implemented
    });

    // GET '/services' ===> Get all services
    app.get(routes.Services, async (req, res) => {
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end(); // TODO: not implemented
    });

    // POST '/services' ===> Create a new service
    app.post(routes.Services, bodyParser.json(), async (req, res) => {
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end(); // TODO: not implemented
    });

};
