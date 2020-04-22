// REQUIRES
require('dotenv').config();

const express = require('express');
const app = express();

const routes = require('./routes');

// CONFIG
app.set("host", process.env.API_HOST || "localhost");
app.set("port", process.env.API_PORT || process.env.PORT || 3000);
// routes(app);

// SERVE
app.listen(app.get("port"),
    () => console.log(`Server listening on http://${ app.get("host") }:${ app.get("port") }/...`));
