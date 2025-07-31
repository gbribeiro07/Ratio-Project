const Profiles = require("../Models/Profiles.Model");
require("dotenv").config();

const ProfileController = {
  // Cadastrar perfil
  async RegisterProfile(req, res) {
    const { nameProfile, age, avatar } = req.body;

    // Garante que o usuário está autenticado
    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Usuário não autenticado",
      });
    }

    if (!nameProfile?.trim()) {
      return res.status(400).json({
        success: false,
        message: "O nome do perfil é obrigatório.",
      });
    }

    try {
      const newProfile = await Profiles.create({
        nameProfile,
        age,
        avatar,
        idUser: req.user.id,
      });

      return res.status(201).json({
        success: true,
        message: "Perfil cadastrado com sucesso!",
        data: newProfile,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Erro ao cadastrar o perfil.",
        error: err.message,
      });
    }
  },
};

module.exports = ProfileController;
