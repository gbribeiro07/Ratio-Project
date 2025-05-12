const { DataTypes } = require("sequelize");
const sequelize = require("../Config/Db");

const Replies = sequelize.define(
  "Replies",
  {
    idReply: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idComment: { type: DataTypes.INTEGER, allowNull: false },
    idUser: { type: DataTypes.INTEGER, allowNull: false },
    response: { type: DataTypes.TEXT, allowNull: true },
    dateCreated: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "Replies",
    freezeTableName: true,
    timestamps: false,
  }
);

const Comments = require("./Comments.Model");
Replies.belongsTo(Comments, { foreignKey: "idComment" });

const User = require("./User.Model");
Replies.belongsTo(User, { foreignKey: "idUser" });

module.exports = Replies;
