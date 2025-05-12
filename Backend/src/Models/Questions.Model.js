const { DataTypes } = require("sequelize");
const sequelize = require("../Config/Db");

const Questions = sequelize.define(
  "Questions",
  {
    idQuestion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idUser: { type: DataTypes.INTEGER, allowNull: false },
    title: { type: DataTypes.STRING(255), allowNull: false },
    description: { type: DataTypes.TEXT, allowNull: false },
    status: {
      type: DataTypes.ENUM("aberta", "respondida"),
      allowNull: false,
      defaultValue: "aberta",
    },
    dateCreated: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "Questions",
    freezeTableName: true,
    timestamps: false,
  }
);

const User = require("./User.Model");
Questions.belongsTo(User, { foreignKey: "idUser" });

module.exports = Questions;
