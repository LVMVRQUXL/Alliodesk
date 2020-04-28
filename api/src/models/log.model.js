module.exports = (sequelize, DataTypes) => {

    const Log = sequelize.define('Log', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        content: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        paranoid: true,
        freezeTableName: true,
        underscored: true,
        timestamps: true
    });

    Log.associate = (models) => {
        Log.belongsTo(models.Service, {
            foreignKey: {
                name: 'service_id',
                allowNull: true
            }
        });
    };

    return Log;

};
