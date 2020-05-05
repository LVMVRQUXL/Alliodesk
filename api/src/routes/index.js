const swaggerUi = require('swagger-ui-express');
const SwaggerSpec = require('../utils').SwaggerSpec;

module.exports = (app) => {
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(SwaggerSpec));

    require('./admin.router')(app);
    require('./user.router')(app);
};
