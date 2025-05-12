const { DataTypes } = require("sequelize");
const sequelize = require("../Config/Db");

const User = sequelize.define(
  "User",
  {
    idUser: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    nameUser: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false, unique: true },
    password: { type: DataTypes.STRING, allowNull: false },
    image_profile: { type: DataTypes.STRING, allowNull: true }, // URL da imagem de perfil
    status_permission: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1,
    }, // Permissão do usuário (ex: 1 = padrão, 2 = admin)
    date_at_create: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    isVerified: {
      type: DataTypes.BOOLEAN,
      allownull: false,
      defaultValue: false,
    },
    verificationToken: { type: DataTypes.STRING, allowNull: true },
  },
  {
    tableName: "User",
    freezeTableName: true,
    timestamps: false,
  }
);

module.exports = User;
