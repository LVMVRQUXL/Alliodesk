const swaggerJSDoc = require('swagger-jsdoc');

const definition = {
    info: {
        title: 'Alliodesk API',
        version: '0.1.0'
    }
};

const options = {
    definition: definition,
    apis: ['./src/routes/*.router.js']
};

module.exports = swaggerJSDoc(options);
