module.exports = () => {
    require('./admin.controller.test')();
    require('./user.controller.test')();
    require('./user_status.controller.test')();
};
