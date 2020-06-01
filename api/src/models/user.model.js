module.exports = (sequelize, DataTypes) => {

    const User = sequelize.define('User', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        login: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        token_session: {
            type: DataTypes.STRING,
            unique: true,
            allowNull: true
        }
    }, {
        freezeTableName: true,
        underscored: true,
        timestamps: true
    });

    User.associate = (models) => {
        User.belongsTo(models.User_status, {
            foreignKey: {
                name: 'user_status_id',
                allowNull: false
            }
        });

        User.hasMany(models.Error);
        User.hasMany(models.Service);
        User.hasMany(models.Feedback);
        User.hasMany(models.Workspace);

        User.belongsToMany(models.Service, { through: 'User_has_Service' });
    };

    return User;

};
