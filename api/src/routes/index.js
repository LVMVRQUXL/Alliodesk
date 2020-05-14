const swaggerUi = require('swagger-ui-express');
const SwaggerSpec = require('../utils').SwaggerSpec;

module.exports = (app) => {
    require('./admin.router')(app);
    require('./service.router')(app);
    require('./user.router')(app);

    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(SwaggerSpec));
};
