const { DataTypes } = require("sequelize");
const sequelize = require("../Config/Db");

const Answers = sequelize.define(
  "Answers",
  {
    idAnswer: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idQuestion: { type: DataTypes.INTEGER, allowNull: false },
    idAdmin: { type: DataTypes.INTEGER, allowNull: false },
    response: { type: DataTypes.TEXT, allowNull: false },
    dateCreated: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "Answers",
    freezeTableName: true,
    timestamps: false,
  }
);

const Questions = require("./Questions.Model");
Questions.belongsTo(User, { foreignKey: "idQuestion" });

const Admin = require("./User.Model");
Admin.belongsTo(User, { foreignKey: "idUser" });

module.exports = Answers;
