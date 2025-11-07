const express = require("express");
const router = express.Router();
const GameContentController = require("../../Controllers/Games/GameContent.Controller");
const authMiddleware = require("../../Middlewares/Auth.Middleware");

// Cria um novo Preset completo
router.post("/Jogo/Criar", authMiddleware, GameContentController.CreateGame);

// Atualiza as informações básicas do Preset
router.put(
  "/Jogo/Atualizar/:idGame",
  authMiddleware,
  GameContentController.UpdatePreset
);

// Exclui o Preset e todo o conteúdo relacionado
router.delete(
  "/Jogo/Deletar/:idGame",
  authMiddleware,
  GameContentController.DeletePreset
);

// Envia um Preset existente para um ou mais Perfis (alunos)
router.post(
  "/Jogo/Atribuir",
  authMiddleware,
  GameContentController.AssignGameToProfiles
);

// Lista todos os Presets criados pelo professor logado
router.get(
  "/Jogo/Lista/Presets",
  authMiddleware,
  GameContentController.ListPresets
);

// Lista todos os perfis que receberam um jogo específico
router.get(
  "/Jogo/Lista/Atribuicoes/:idGame",
  authMiddleware,
  GameContentController.ListAssignmentsByGame
);

module.exports = router;
