const { Sequelize } = require("sequelize");
require("dotenv").config();

const sequelize = new Sequelize(
  process.env.DB_NAME, // Nome do banco
  process.env.DB_USER, // Usuário
  process.env.DB_PASSWORD, // Senha
  {
    host: process.env.DB_HOST,
    dialect: "mysql", // Define o banco de dados
    logging: false, // Evita exibir logs de SQL no terminal
  }
);

// Testa a conexão
sequelize
  .authenticate()
  .then(() => console.log("Conectado ao MySQL com Sequelize!"))
  .catch((err) => console.error("Erro ao conectar ao MySQL:", err));

module.exports = sequelize;
