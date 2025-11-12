const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();
const sequelize = require("./Config/Db");
const cookieParser = require("cookie-parser");

const setupAssociations = require("./Models/Games/Associations.Model");

const userRoutes = require("./Routes/User.Route");
const authRoutes = require("./Routes/Auth.Route");
const profileRoutes = require("./Routes/Profile.Route");
const gameContentRoutes = require("./Routes/Games/GameContent.Route");
const gameProgressRoutes = require("./Routes/Games/GameProgress.Route");

const port = process.env.PORT || 3001;

app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

app.use("/Ratio", userRoutes);
app.use("/Ratio", authRoutes);
app.use("/Ratio", profileRoutes);
app.use("/Ratio", gameContentRoutes);
app.use("/Ratio", gameProgressRoutes);

sequelize
  .authenticate()
  .then(() => {
    console.log("Conexão com o banco de dados estabelecida com sucesso!");

    setupAssociations();
    console.log("Associações do Sequelize definidas com sucesso!");

    app.listen(port, () => {
      console.log(`Servidor iniciado na porta ${port}`);
    });
  })
  .catch((err) => {
    console.error("Não foi possível conectar ao banco de dados:", err.message);
  });
