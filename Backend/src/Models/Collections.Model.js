const { DataTypes } = require("sequelize");
const sequelize = require("../Config/Db");

const Collections = sequelize.define(
  "Collections",
  {
    idCollection: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idUser: { type: DataTypes.INTEGER, allowNull: false },
    nameCollection: { type: DataTypes.STRING(255), allowNull: false },
    dateSaved: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "Collections",
    freezeTableName: true,
    timestamps: false,
  }
);

const User = require("./User.Model");
Collections.belongsTo(User, { foreignKey: "idUser" });

module.exports = Collections;
