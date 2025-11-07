const express = require("express");
const router = express.Router();
const GameProgressController = require("../Controllers/GameProgress.Controller");
const authMiddleware = require("../Middlewares/Auth.Middleware");

//Lista todos os jogos que foram enviados para o perfil logado
router.get(
  "/Jogo/Lista/Atribuidos",
  authMiddleware,
  GameProgressController.ListAssignedGames
);

//Inicia ou retorna o progresso atual do aluno em um jogo
router.get(
  "/Jogo/Iniciar/:idAssignment",
  authMiddleware,
  GameProgressController.StartOrResumeGame
);

//Processa a resposta do aluno e atualiza o progresso/ranking
router.post(
  "/Jogo/Responder",
  authMiddleware,
  GameProgressController.SubmitAnswer
);

//Retorna o ranking global dos 10 melhores perfis
router.get("/Jogo/Ranking", authMiddleware, GameProgressController.GetRanking);

module.exports = router;
