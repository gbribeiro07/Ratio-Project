const { DataTypes } = require("sequelize");
const sequelize = require("../Config/Db");

const CollectionItems = sequelize.define(
  "CollectionItems",
  {
    idCollectionItem: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    idCollection: { type: DataTypes.INTEGER, allowNull: false },
    idContent: { type: DataTypes.INTEGER, allowNull: false },
    dateSaved: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  },
  {
    tableName: "Collection_Items",
    freezeTableName: true,
    timestamps: false,
  }
);

const Collections = require("./Collections.Model");
Contents.belongsTo(Collections, { foreignKey: "idCollection" });

const Contents = require("./Contents.Model");
CollectionItems.belongsTo(Contents, { foreignKey: "idContent" });

module.exports = CollectionItems;
