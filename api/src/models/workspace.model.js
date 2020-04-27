module.exports = (sequelize, DataTypes) => {

    return sequelize.define('Workspace', {
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

};
