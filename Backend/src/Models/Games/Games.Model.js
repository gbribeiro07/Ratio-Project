const { DataTypes } = require("sequelize");
const sequelize = require("../Config/Db");

const Games = sequelize.define(
  "Games",
  {
    idGame: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idUser: { type: DataTypes.INTEGER, allowNull: false },
    nameGame: {
      type: DataTypes.ENUM("Lógica", "Aritmética", "Geometria"),
      allowNull: false,
    },
    totalPhases: { type: DataTypes.INTEGER, defaultValue: 5 },
    isPreset: { type: DataTypes.BOOLEAN, defaultValue: true },
    namePreset: { type: DataTypes.STRING(100) },
    dateCreated: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "Games",
    freezeTableName: true,
    timestamps: false,
  }
);

const User = require("./User.Model");
Games.belongsTo(User, { foreignKey: "idUser" });

module.exports = Games;
