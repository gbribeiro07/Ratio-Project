const { DataTypes } = require("sequelize");
const sequelize = require("../Config/Db");

const Favorites = sequelize.define(
  "Favorites",
  {
    idFavorite: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idUser: { type: DataTypes.INTEGER, allowNull: false },
    idContent: { type: DataTypes.INTEGER, allowNull: false },
    dateSaved: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "Favorites",
    freezeTableName: true,
    timestamps: false,
  }
);

const User = require("./User.Model");
Favorites.belongsTo(User, { foreignKey: "idUser" });

const Contents = require("./Contents.Model");
Favorites.belongsTo(Contents, { foreignKey: "idContent" });

module.exports = Favorites;
