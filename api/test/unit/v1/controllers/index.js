module.exports = () => {
    require('./admin.controller.unit-test')();
    require('./error.controller.unit-test')();
    require('./feedback.controller.unit-test')();
    require('./service.controller.unit-test')();
    require('./user.controller.unit-test')();
    require('./user_status.controller.unit-test')();
    require('./workspace.controller.unit-test')();
};
