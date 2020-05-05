const swaggerJSDoc = require('swagger-jsdoc');

const definition = {
    info: {
        title: 'Alliodesk API',
        version: '0.1.0'
    },
    basePath: '/'
};

const options = {
    definition,
    apis: ['../routes/*.router.js']
};

module.exports = swaggerJSDoc(options);
