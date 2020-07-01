const router = require('express').Router();
const swaggerUi = require('swagger-ui-express');
const cors = require('cors');

const SwaggerSpec = require('../utils').SwaggerSpec;

// noinspection JSUnresolvedFunction
router.use(cors());

// noinspection JSUnresolvedFunction
router.use('/admins', require('./admin.router'));
// noinspection JSUnresolvedFunction
router.use('/errors', require('./error.router'));
// noinspection JSUnresolvedFunction,SpellCheckingInspection
router.use('/feedbacks', require('./feedback.router'));
// noinspection JSUnresolvedFunction
router.use('/services', require('./service.router'));
// noinspection JSUnresolvedFunction
router.use('/users', require('./user.router'));
// noinspection JSUnresolvedFunction
router.use('/workspaces', require('./workspace.router'));

// noinspection JSUnresolvedFunction
router.use('/swagger', swaggerUi.serve, swaggerUi.setup(SwaggerSpec));

module.exports = router;
