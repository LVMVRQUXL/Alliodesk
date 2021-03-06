module.exports = (sequelize, DataTypes) => {

    const User_status = sequelize.define('User_status', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        }
    });

    User_status.associate = (models) => {
        User_status.hasMany(models.User);
    };

    return User_status;

};
