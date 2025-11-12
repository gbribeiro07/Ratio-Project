const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/Db");

const GameAnswers = sequelize.define(
  "GameAnswers",
  {
    idGameAnswer: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idGameQuestion: { type: DataTypes.INTEGER, allowNull: false },
    modelAnswer: { type: DataTypes.TEXT, allowNull: false },
  },
  {
    tableName: "GameAnswers",
    freezeTableName: true,
    timestamps: false,
  }
);

// const Question = require("./GameQuestions.Model");
// GameAnswers.belongsTo(Question, { foreignKey: "idGameQuestion" });

module.exports = GameAnswers;
