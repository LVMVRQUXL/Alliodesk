const Sequelize = require('./v1/models');

module.exports = async () => {

    try {
        const sequelize = Sequelize.connect();

        console.log('Loading models...');
        Sequelize.loadModels(sequelize);
        await sequelize.authenticate();
        await sequelize.sync({ force: true });
        console.log('All models were synchronized successfully!');
    } catch (error) {
        console.error('An error has occured:', error);
    }

};
