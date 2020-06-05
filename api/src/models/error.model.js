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
                allowNull: true // TODO: update to 'false' when implementing logic between User, Error and Service
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
