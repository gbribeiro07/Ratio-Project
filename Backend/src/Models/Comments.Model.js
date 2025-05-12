const { DataTypes } = require("sequelize");
const sequelize = require("../Config/Db");

const Comments = sequelize.define(
  "Comments",
  {
    idComment: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idUser: { type: DataTypes.INTEGER, allowNull: false },
    idContent: { type: DataTypes.INTEGER, allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: true },
    dateCreated: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "Comments",
    freezeTableName: true,
    timestamps: false,
  }
);

const User = require("./User.Model");
Comments.belongsTo(User, { foreignKey: "idUser" });

const Contents = require("./Contents.Model");
Comments.belongsTo(Contents, { foreignKey: "idContent" });

module.exports = Comments;
