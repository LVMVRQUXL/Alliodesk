module.exports = (sequelize, DataTypes) => {

    const Workspace = sequelize.define('Workspace', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        paranoid: true,
        freezeTableName: true,
        underscored: true,
        timestamps: true
    });

    Workspace.associate = (models) => {
        Workspace.belongsTo(models.User, {
            foreignKey: {
                name: 'user_id',
                allowNull: false
            }
        });

        Workspace.belongsToMany(models.Service, { through: 'Workspace_contains_Service' });
    };

    return Workspace;

};
