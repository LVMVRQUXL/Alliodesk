const Sequelize = require('./v1/models');

module.exports = async () => {
    try {
        const sequelize = Sequelize.connect();

        console.log('Loading models...');
        // noinspection JSUnresolvedFunction
        Sequelize.loadModels(sequelize);
        // noinspection JSUnresolvedFunction
        await sequelize.authenticate();
        // noinspection JSUnresolvedFunction
        await sequelize.sync({force: true});

        console.log('All models were synchronized successfully!');
    } catch (error) {
        console.error('An error has occurred:', error);
    }
};
