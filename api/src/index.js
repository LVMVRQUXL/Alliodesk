require('dotenv').config();
const express = require('express');


const bootstrap = require('./boot_sequelize');
const routerV1 = require('./v1');

bootstrap().then(() => {
    const app = express();
    const stableRouter = routerV1;

    app.set("host", process.env.API_HOST || "localhost");
    app.set("port", process.env.API_PORT || process.env.PORT || 3000);

    app.use(routerV1.baseUri, routerV1.config());
    app.use('/', stableRouter.config());

    app.listen(app.get("port"),
        () => console.log(`Server listening on http://${ app.get("host") }:${ app.get("port") }/...`));
});
