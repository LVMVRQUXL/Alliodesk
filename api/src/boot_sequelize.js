const sequelize = require('./models').sequelize;

module.exports = async () => {

    try {
        await sequelize.authenticate();
        await sequelize.sync({ force: true });
    } catch (error) {
        console.error('An error has occured:', error);
    }

};
