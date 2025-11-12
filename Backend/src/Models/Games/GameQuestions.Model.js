const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/Db");

const GameQuestions = sequelize.define(
  "GameQuestions",
  {
    idGameQuestion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idPhase: { type: DataTypes.INTEGER, allowNull: false },
    questionText: { type: DataTypes.TEXT, allowNull: false },
  },
  {
    tableName: "GameQuestions",
    freezeTableName: true,
    timestamps: false,
  }
);

// const Phase = require("./GamePhases.Model");
// GameQuestions.belongsTo(Phase, { foreignKey: "idPhase" });

module.exports = GameQuestions;
