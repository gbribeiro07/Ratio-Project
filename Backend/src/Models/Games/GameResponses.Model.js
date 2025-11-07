const { DataTypes } = require("sequelize");
const sequelize = require("../Config/Db");

const GameResponses = sequelize.define(
  "GameResponses",
  {
    idResponse: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idAssignment: { type: DataTypes.INTEGER, allowNull: false },
    idGameQuestion: { type: DataTypes.INTEGER, allowNull: false },
    customAnswer: { type: DataTypes.TEXT },
    isCorrect: { type: DataTypes.BOOLEAN, defaultValue: false },
    dateAnswered: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "GameResponses",
    freezeTableName: true,
    timestamps: false,
  }
);

const Assignment = require("./GameAss.Model");
GameResponses.belongsTo(Assignment, { foreignKey: "idAssignment" });

const Question = require("./GameQuestions.Model");
GameResponses.belongsTo(Question, { foreignKey: "idGameQuestion" });

module.exports = GameResponses;
