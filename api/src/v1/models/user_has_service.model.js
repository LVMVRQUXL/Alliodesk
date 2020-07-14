module.exports = (sequelize) => {

    const User_has_Service = sequelize.define('User_has_Service', {});

    User_has_Service.associate = (models) => {
        User_has_Service.belongsTo(models.User, {
            foreignKey: {
                name: 'user_id',
                allowNull: false
            }
        });
        User_has_Service.belongsTo(models.Service, {
            foreignKey: {
                name: 'service_id',
                allowNull: false
            }
        });
    };

    return User_has_Service;

};
