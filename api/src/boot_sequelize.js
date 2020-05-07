const Sequelize = require('./models');

module.exports = async () => {

    try {
        const sequelize = Sequelize.connect();
        Sequelize.loadModels(sequelize);
        await sequelize.authenticate();
        await sequelize.sync({ force: true });
    } catch (error) {
        console.error('An error has occured:', error);
    }

};
