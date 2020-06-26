const swaggerUi = require('swagger-ui-express');
const cors = require('cors');
const SwaggerSpec = require('../utils').SwaggerSpec;

module.exports = (app) => {
    app.use(cors());

    require('./admin.router')(app);
    require('./error.router')(app);
    require('./feedback.router')(app);
    require('./service.router')(app);
    require('./user.router')(app);
    require('./workspace.router')(app);

    app.use('/swagger', swaggerUi.serve, swaggerUi.setup(SwaggerSpec));
};
