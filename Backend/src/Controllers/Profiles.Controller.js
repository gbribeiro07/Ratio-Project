const Profiles = require("../Models/Profiles.Model");
require("dotenv").config();

const ProfileController = {
  //Cadastrar perfil
  async RegisterProfile(req, res) {
    const { nameProfile } = req.body;
    if (!nameProfile?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Este campo é obrigatório!",
      });
    }

    try {
      const newProfile = await Profiles.create({
        nameProfile,
      });
      return res.status(201).json({
        success: true,
        message: "Perfil cadastrado com sucesso!",
        data: newProfile,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Erro ao cadastrar",
        error: err.message,
      });
    }
  },
};

module.exports = ProfileController;
