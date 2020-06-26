module.exports = (sequelize, DataTypes) => {

    const Feedback = sequelize.define('Feedback', {
        id: {
            type: DataTypes.BIGINT,
            primaryKey: true,
            autoIncrement: true
        },
        score: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        description: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        freezeTableName: true,
        underscored: true,
        timestamps: true
    });

    Feedback.associate = (models) => {
        Feedback.belongsTo(models.User, {
            foreignKey: {
                name: 'user_id',
                allowNull: true // TODO: put true after testings
            }
        });
        Feedback.belongsTo(models.Service, {
            foreignKey: {
                name: 'service_id',
                allowNull: true // TODO: put true after testings
            }
        });
    };

    return Feedback;

};
