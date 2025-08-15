const { DataTypes } = require("sequelize");
const sequelize = require("../Config/Db");
const bcrypt = require("bcryptjs");

const User = sequelize.define(
  "User",
  {
    idUser: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nameUser: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    image_profile: { type: DataTypes.TEXT, allowNull: true },
    status_permission: {
      type: DataTypes.ENUM("SuperAdmin", "Admin", "User"),
      allowNull: false,
      defaultValue: "User",
    },
    date_at_create: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false,
    },
    verificationToken: { type: DataTypes.STRING(6), allowNull: true },
  },
  {
    tableName: "User",
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = User;
