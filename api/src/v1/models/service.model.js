module.exports = (sequelize, DataTypes) => {

    const Service = sequelize.define('Service', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true
        },
        version: {
            type: DataTypes.STRING,
            allowNull: true
        },
        source_url: {
            type: DataTypes.STRING,
            allowNull: false
        },
        update_config_link: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        freezeTableName: true,
        underscored: true,
        timestamps: true
    });

    Service.associate = (models) => {
        Service.belongsTo(models.User, {
            foreignKey: {
                name: 'user_id',
                allowNull: false
            }
        });
        Service.belongsTo(models.Service_status, {
            foreignKey: {
                name: 'service_status_id',
                allowNull: false
            }
        });

        Service.hasMany(models.Error);
        Service.hasMany(models.Log);
        Service.hasMany(models.Feedback);

        Service.belongsToMany(models.User, {through: 'User_has_Service'});
        Service.belongsToMany(models.Workspace, {through: 'Workspace_contains_Service'});
    };

    return Service;

};
