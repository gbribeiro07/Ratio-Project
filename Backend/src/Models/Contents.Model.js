const { DataTypes } = require("sequelize");
const sequelize = require("../Config/Db");

const Contents = sequelize.define(
  "Contents",
  {
    idContent: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idUser: { type: DataTypes.INTEGER, allowNull: false },
    contentType: { type: DataTypes.ENUM("post", "video"), allowNull: false },
    title: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    content: { type: DataTypes.TEXT, allowNull: false },
    dateCreated: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "Contents",
    freezeTableName: true,
    timestamps: false,
  }
);

const User = require("./User.Model");
Contents.belongsTo(User, { foreignKey: "idUser" });

module.exports = Contents;
