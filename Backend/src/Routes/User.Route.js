const express = require("express");
const router = express.Router();
const UserController = require("../Controllers/User.Controller");
const authMiddleware = require("../Middlewares/Auth.Middleware");

router.post("/Cadastro", UserController.Register);
router.post("/Verificar-Email", UserController.VerifyEmail);
router.get("/UserBasics", authMiddleware, UserController.getUserBasics);
module.exports = router;
