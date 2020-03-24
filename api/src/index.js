// REQUIRES
require('dotenv').config();

const express = require('express');
const app = express();

const routes = require('./routes');

// CONFIG
// routes(app);

// SERVE
app.listen(process.env.API_PORT,
    () => console.log(`Server listening on http://${ process.env.API_HOST }:${ process.env.API_PORT }/...`));
