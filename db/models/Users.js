module.exports = (sequelize, DataTypes) => {
    return sequelize.define('Users', {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tgId: DataTypes.BIGINT,
      name: DataTypes.STRING,
      username: DataTypes.STRING,
      type: DataTypes.INTEGER,
      admin: DataTypes.BOOLEAN
    });
  };
  