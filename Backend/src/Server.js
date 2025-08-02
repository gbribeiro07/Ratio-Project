const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
const port = process.env.port || 3001;
const sequelize = require("./Config/Db");
const cookieParser = require("cookie-parser");

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

//middleware express

app.use(express.json({ limit: "16kb" })); //permite que o servidor entenda requisições JSON (o express não as entende por padrão)
//o limite de 16kb permite define o limite máximo de tamanho para o corpo da requisição JSON, previnindo uma sobrecarga do servidor.
app.use(express.urlencoded({ extended: true, limit: "16kb" })); //permite que o servidor entenda requisições no formato padrão dos forms do HTML

app.listen(port, () => {
  console.log(`Servidor iniciado na porta ${port}`);
});

app.use(cookieParser());
