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

    if (age && (age < 0 || age > 120)) {
      return res.status(400).json({
        success: false,
        message: "Idade inválida.",
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

  //listar perfil
  async ListProfile(req, res) {
    try {
      const { orderBy = "dateCreated", order = "ASC" } = req.query;

      const validFields = ["nameProfile", "dateCreated"];
      const validOrders = ["ASC", "DESC"];

      if (
        !validFields.includes(orderBy) ||
        !validOrders.includes(order.toUpperCase())
      ) {
        return res.status(400).json({
          success: false,
          message: "Parâmetros de ordenação inválidos.",
        });
      }

      const allProfiles = await Profiles.findAll({
        where: { idUser: req.user.id },
        order: [[orderBy, order.toUpperCase()]],
      });

      return res.json({ success: true, data: allProfiles });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Erro ao buscar perfis.",
        error: err.message,
      });
    }
  },

  //deletar perfil
  async DeleteProfile(req, res) {
    const { id } = req.params;

    try {
      const profile = await Profiles.findOne({ where: { idProfile: id } });

      // Verifica se o perfil existe e se pertence ao usuário logado
      if (!profile || profile.idUser !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Ação não permitida.",
        });
      }

      await Profiles.destroy({ where: { idProfile: id } });

      res
        .status(200)
        .json({ success: true, message: "Perfil deletado com sucesso." });
    } catch (error) {
      res
        .status(500)
        .json({ success: false, message: "Erro ao deletar perfil." });
    }
  },

  // atualizar perfil
  async UpdateProfile(req, res) {
    const { id } = req.params;
    const { nameProfile, age, avatar } = req.body;

    if (!req.user || !req.user.id) {
      return res.status(401).json({
        success: false,
        message: "Usuário não autenticado",
      });
    }

    if (age && (age < 0 || age > 120)) {
      return res.status(400).json({
        success: false,
        message: "Idade inválida.",
      });
    }

    try {
      const profile = await Profiles.findOne({ where: { idProfile: id } });

      if (!profile || profile.idUser !== req.user.id) {
        return res.status(403).json({
          success: false,
          message: "Ação não permitida ou perfil inexistente.",
        });
      }

      // Atualiza os campos apenas se foram enviados
      profile.nameProfile = nameProfile ?? profile.nameProfile;
      profile.age = age ?? profile.age;
      profile.avatar = avatar ?? profile.avatar;

      await profile.save();

      return res.status(200).json({
        success: true,
        message: "Perfil atualizado com sucesso!",
        data: profile,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Erro ao atualizar o perfil.",
        error: err.message,
      });
    }
  },
};

module.exports = ProfileController;
