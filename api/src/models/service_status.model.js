module.exports = (sequelize, DataTypes) => {

    const Service_status = sequelize.define('Service_status', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        status: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        freezeTableName: true,
        underscored: true,
        timestamps: true
    });

    Service_status.associate = (models) => {
        Service_status.hasMany(models.Service);
    };

    return Service_status;

};
