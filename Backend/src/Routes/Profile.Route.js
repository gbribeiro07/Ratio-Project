const express = require("express");
const router = express.Router();
const ProfileController = require("../Controllers/Profile.Controller");
const authMiddleware = require("../Middlewares/Auth.Middleware");

router.post(
  "/Cadastro/Perfil/:id",
  authMiddleware,
  ProfileController.RegisterProfile
);

router.get("/Lista/Perfis", authMiddleware, ProfileController.ListProfile);

router.put(
  "/Atualizar/Perfil/:id",
  authMiddleware,
  ProfileController.UpdateProfile
);

router.delete(
  "/Deletar/Perfil/:id",
  authMiddleware,
  ProfileController.DeleteProfile
);

module.exports = router;
