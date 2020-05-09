module.exports = (sequelize, DataTypes) => {

    const Error = sequelize.define('Error', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        message: {
            type: DataTypes.STRING,
            allowNull: false
        }
    }, {
        freezeTableName: true,
        underscored: true,
        timestamps: true
    });

    Error.associate = (models) => {
        Error.belongsTo(models.User, {
            foreignKey: {
                name: 'user_id',
                allowNull: false
            }
        });
        Error.belongsTo(models.Service, {
            foreignKey: {
                name: 'service_id',
                allowNull: true
            }
        });
    };

    return Error;

};
