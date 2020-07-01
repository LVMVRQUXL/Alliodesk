require('dotenv').config();
const express = require('express');


const bootstrap = require('./boot_sequelize');

bootstrap().then(() => {
    const app = express();

    app.set("host", process.env.API_HOST || "localhost");
    app.set("port", process.env.API_PORT || process.env.PORT || 3000);

    const apiV1 = require('./v1');
    app.use('/v1', apiV1);
    app.use('/', apiV1);

    app.listen(app.get("port"),
        () => console.log(`Server listening on http://${ app.get("host") }:${ app.get("port") }/...`));
});
