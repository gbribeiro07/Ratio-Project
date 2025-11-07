const { DataTypes } = require("sequelize");
const sequelize = require("../Config/Db");

const Ranking = sequelize.define(
  "Ranking",
  {
    idRanking: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idProfile: { type: DataTypes.INTEGER, allowNull: false },
    totalCorrectAnswers: { type: DataTypes.INTEGER, defaultValue: 0 },
    lastUpdated: { type: DataTypes.DATE },
  },
  {
    tableName: "Ranking",
    freezeTableName: true,
    timestamps: false,
  }
);

const Profiles = require("../Profiles.Model");
Ranking.belongsTo(Profiles, { foreignKey: "idProfile" });

module.exports = Ranking;
