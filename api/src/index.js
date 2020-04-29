// REQUIRES
require('dotenv').config();

const express = require('express');

// const routes = require('./routes');
const sequelize = require('./models').sequelize;

// CONFIG
const bootstrap = async () => {

    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: true });
    } catch (error) {
        console.error('An error has occured:', error);
    }

};

// SERVE
bootstrap().then(() => {
    const app = express();

    app.set("host", process.env.API_HOST || "localhost");
    app.set("port", process.env.API_PORT || process.env.PORT || 3000);

    // routes(app)

    app.listen(app.get("port"),
        () => console.log(`Server listening on http://${ app.get("host") }:${ app.get("port") }/...`));
});
