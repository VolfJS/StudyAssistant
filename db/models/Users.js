module.exports = (sequelize, DataTypes) => {
  return sequelize.define("Users", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tgId: DataTypes.BIGINT, //uid
    name: DataTypes.STRING,
    username: DataTypes.STRING, // может быть null
    type: DataTypes.INTEGER,
    admin: DataTypes.BOOLEAN,
  });
};
