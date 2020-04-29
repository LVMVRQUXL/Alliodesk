module.exports = (app) => {
    require('./admin.router')(app);
    require('./user.router')(app);
};
