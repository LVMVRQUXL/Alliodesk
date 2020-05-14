const bodyParser = require('body-parser');

const HttpCodeUtil = require('../utils').HttpCodeUtil;

const routes = {
    WorkspacesId: '/workspaces/:id',
    Workspaces: '/workspaces'
};

module.exports = (app) => {
    // GET '/workspaces/:id' ===> Get one workspace from id TODO
    app.get(routes.WorkspacesId, async (req, res) => {
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end();
    });

    // DELETE '/workspaces/:id' ===> Remove one workspace from id TODO
    app.delete(routes.WorkspacesId, async (req, res) => {
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end();
    });

    // PUT '/workspaces/:id' ===> Update one workspace from id TODO
    app.put(routes.WorkspacesId, async (req, res) => {
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end();
    });

    // GET '/workspaces' ===> Get all workspaces TODO
    app.get(routes.Workspaces, async (req, res) => {
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end();
    });

    // POST '/workspaces' ===> Create a new workspace TODO
    app.post(routes.Workspaces, async (req, res) => {
        res.status(HttpCodeUtil.NOT_IMPLEMENTED).end();
    });
};
