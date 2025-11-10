const { DataTypes } = require("sequelize");
const sequelize = require("../../Config/Db");

const GamePhases = sequelize.define(
  "GamePhases",
  {
    idPhase: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idGame: { type: DataTypes.INTEGER, allowNull: false },
    phaseNumber: { type: DataTypes.INTEGER, allowNull: false },
    requiredCorrectAnswers: { type: DataTypes.INTEGER, allowNull: false },
  },
  {
    tableName: "GamePhases",
    freezeTableName: true,
    timestamps: false,
  }
);

const Game = require("./Games.Model");
GamePhases.belongsTo(Game, { foreignKey: "idGame" });

module.exports = GamePhases;
