const { DataTypes } = require("sequelize");
const sequelize = require("../Config/Db");

const GameAssignments = sequelize.define(
  "GameAssignments",
  {
    idAssignment: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idGame: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    idProfile: { type: DataTypes.INTEGER, allowNull: false },
    dateAssigned: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "GameAssignments",
    freezeTableName: true,
    timestamps: false,
  }
);

const Games = require("./Games.Model");
GameAssignments.belongsTo(Games, { foreignKey: "idGame" });

const Profiles = require("../Profiles.Model");
GameAssignments.belongsTo(Profiles, { foreignKey: "idProfile" });

module.exports = GameAssignments;
