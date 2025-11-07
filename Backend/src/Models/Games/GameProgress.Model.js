const { DataTypes } = require("sequelize");
const sequelize = require("../Config/Db");

const GameProgress = sequelize.define(
  "GameProgress",
  {
    idGameProgress: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idAssignment: { type: DataTypes.INTEGER, allowNull: false },
    currentPhase: { type: DataTypes.INTEGER, defaultValue: 1 },
    totalCorrectAnswers: { type: DataTypes.INTEGER, defaultValue: 0 },
    dateUpdated: { type: DataTypes.DATE },
  },
  {
    tableName: "GameProgress",
    freezeTableName: true,
    timestamps: false,
  }
);

const Assignment = require("./GameAss.Model");
GameProgress.belongsTo(Assignment, { foreignKey: "idAssignment" });

module.exports = GameProgress;
