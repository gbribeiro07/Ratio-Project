const { Op } = require("sequelize");
const sequelize = require("../../Config/Db");

// Importação dos Models
const GameAssignments = require("../../Models/Games/GameAss.Model");
const GameProgress = require("../../Models/Games/GameProgress.Model");
const GameResponses = require("../../Models/Games/GameResponses.Model");
const GameQuestions = require("../../Models/Games/GameQuestions.Model");
const GameAnswers = require("../../Models/Games/GameAnswers.Model");
const GamePhases = require("../../Models/Games/GamePhases.Model");
const Ranking = require("../../Models/Games/Ranking.Model");
const Profiles = require("../../Models/Profiles.Model");
const User = require("../../Models/User.Model");
const Games = require("../../Models/Games/Games.Model");

const GameProgressController = {
  // LISTAGEM DE JOGOS ATRIBUÍDOS (Visão do Aluno)

  async ListAssignedGames(req, res) {
    const idProfile = req.params.idProfile;
    const idUser = req.user.id;

    if (!idProfile || !idUser) {
      return res.status(400).json({ success: false, message: "IDs ausentes." });
    }

    try {
      const profile = await Profiles.findOne({
        where: { idProfile, idUser: idUser },
      });

      if (!profile) {
        return res.status(403).json({
          success: false,
          message: "Acesso negado. Perfil não pertence ao usuário.",
        });
      }
      const assignedGames = await GameAssignments.findAll({
        where: { idProfile: idProfile },
        attributes: ["idAssignment", "dateAssigned"],

        include: [
          {
            model: Games, // Inclui o nome e tipo do jogo
            attributes: ["idGame", "nameGame", "namePreset", "totalPhases"],
          },
          {
            model: GameProgress, // Inclui o progresso atual do aluno
            attributes: ["currentPhase", "totalCorrectAnswers"],
            required: false, // O progresso pode não existir (se o aluno nunca iniciou)
          },
        ],
        order: [["dateAssigned", "DESC"]],
      });

      return res.status(200).json({ success: true, data: assignedGames });
    } catch (error) {
      console.error("ERRO NO CONTROLLER ListAssignedGames:", error);
      return res.status(500).json({
        success: false,
        message: "Erro ao listar jogos atribuídos.",
        error: error.message,
      });
    }
  },

  // 1. INICIAR E OBTER O PROGRESSO DO JOGO

  async StartOrResumeGame(req, res) {
    const idAssignment = req.params.idAssignment;
    const idProfile = req.user.idProfile; // Assumindo que o perfil está no req.user

    try {
      // 1. Verifica se a atribuição existe e pertence ao perfil
      const assignment = await GameAssignments.findOne({
        where: { idAssignment, idProfile },
      });

      if (!assignment) {
        return res.status(404).json({
          success: false,
          message: "Atribuição de jogo não encontrada para este perfil.",
        });
      }

      // 2. Busca ou Cria o GameProgress
      const [progress, created] = await GameProgress.findOrCreate({
        where: { idAssignment },
        defaults: { currentPhase: 1, totalCorrectAnswers: 0 },
      });

      // 3. Busca a próxima Questão para o aluno
      const nextQuestion = await GameProgressController.getNextQuestion(
        progress,
        assignment
      );

      if (!nextQuestion) {
        return res.status(200).json({
          success: true,
          message: "Parabéns! O jogo foi concluído!",
          data: { progress, nextQuestion: null },
        });
      }

      return res.status(200).json({
        success: true,
        message: "Progresso do jogo retornado com sucesso.",
        data: { progress, nextQuestion },
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Erro ao iniciar/retomar o jogo.",
        error: error.message,
      });
    }
  },

  /**
   * Função auxiliar para determinar a próxima questão a ser respondida.
   * Implementa a lógica de "repetir erradas".
   */
  async getNextQuestion(progress, assignment) {
    const idAssignment = progress.idAssignment;
    const currentPhaseNumber = progress.currentPhase;

    // 1. Lógica: Buscar Questões ERRADAS na fase atual que AINDA NÃO foram acertadas.
    const allQuestionsInPhase = await GamePhases.findOne({
      where: { idGame: assignment.idGame, phaseNumber: currentPhaseNumber },
      include: [
        {
          model: GameQuestions,
          attributes: ["idGameQuestion", "questionText"],
        },
      ],
    });

    if (
      !allQuestionsInPhase ||
      !allQuestionsInPhase.GameQuestions ||
      allQuestionsInPhase.GameQuestions.length === 0
    ) {
      // Caso não encontre a fase, pode ser o fim do jogo.
      return null;
    }

    const allQuestionIdsInPhase = allQuestionsInPhase.GameQuestions.map(
      (q) => q.idGameQuestion
    );

    // A. Busca todas as respostas do aluno para as questões desta fase.
    const responses = await GameResponses.findAll({
      where: {
        idAssignment,
        idGameQuestion: { [Op.in]: allQuestionIdsInPhase },
      },
      attributes: ["idGameQuestion", "isCorrect"],
    });

    // B. Identifica as Questões que o aluno ainda não acertou
    const incorrectQuestionIds = allQuestionIdsInPhase.filter((questionId) => {
      // Verifica se a questão já foi respondida e se a ÚLTIMA resposta foi incorreta
      const attempts = responses.filter((r) => r.idGameQuestion === questionId);
      if (attempts.length === 0) {
        // Se nunca respondeu, é a próxima
        return true;
      }
      // Se a última tentativa foi false, precisa repetir
      return attempts[attempts.length - 1].isCorrect === false;
    });

    if (incorrectQuestionIds.length > 0) {
      // REPETIR ERRADAS: Retorna a primeira questão que o aluno ainda não acertou.
      const nextQuestionId = incorrectQuestionIds[0];
      return allQuestionsInPhase.GameQuestions.find(
        (q) => q.idGameQuestion === nextQuestionId
      );
    }

    // Se todas as questões foram acertadas, o aluno pode passar de fase (se atingiu o requiredCorrectAnswers)
    return null; // Sinaliza que não há mais questões para repetir/iniciar nesta fase
  },

  // 2. PROCESSAR RESPOSTA E ATUALIZAR PROGRESSO/RANKING

  async SubmitAnswer(req, res) {
    const { idAssignment, idGameQuestion, customAnswer } = req.body;
    const idProfile = req.user.idProfile; // Perfil logado

    const transaction = await sequelize.transaction();
    let isAnswerCorrect = false;

    try {
      // 1. Segurança: Verifica se a atribuição existe e pertence ao perfil
      const assignment = await GameAssignments.findOne({
        where: { idAssignment, idProfile },
      });
      if (!assignment) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message: "Atribuição de jogo não encontrada.",
        });
      }

      // 2. Busca a resposta modelo para a questão (A resposta é considerada correta se bater com ALGUMA resposta modelo)
      const modelAnswer = await GameAnswers.findOne({
        where: { idGameQuestion },
      });

      if (
        modelAnswer &&
        customAnswer.toLowerCase().trim() ===
          modelAnswer.modelAnswer.toLowerCase().trim()
      ) {
        isAnswerCorrect = true;
      }

      // 3. Registra a resposta do aluno (GameResponses)
      await GameResponses.create(
        {
          idAssignment,
          idGameQuestion,
          customAnswer,
          isCorrect: isAnswerCorrect,
        },
        { transaction }
      );

      // 4. Se a resposta for correta, atualiza o GameProgress e Ranking
      if (isAnswerCorrect) {
        // A. Atualiza o progresso local (incrementa totalCorrectAnswers)
        const progress = await GameProgress.findOne({
          where: { idAssignment },
        });
        if (progress) {
          await progress.increment("totalCorrectAnswers", {
            by: 1,
            transaction,
          });

          // B. Lógica de Passagem de Fase
          const phaseInfo = await GamePhases.findOne({
            where: {
              idGame: assignment.idGame,
              phaseNumber: progress.currentPhase,
            },
          });

          // Verifica se o aluno já acertou o número requerido para *todas* as questões.
          // (Esta lógica é complexa, vou simplificar, assumindo que se ele acertou a errada, o getNextQuestion fará o resto)

          // Para simplificar a passagem de fase nesta função:
          // Se não há mais questões para repetir (getNextQuestion retorna null), a fase está completa.

          // Após o incremento, checa novamente a regra de progressão
          const nextQAfterUpdate = await GameProgressController.getNextQuestion(
            progress,
            assignment
          );

          if (!nextQAfterUpdate && phaseInfo) {
            // Se não há mais questões (todas foram acertadas)
            await progress.increment("currentPhase", { by: 1, transaction });
            // Reseta o contador, se necessário (depende da sua lógica)
            // await progress.update({ totalCorrectAnswers: 0 }, { transaction });
          }
        }

        // C. Atualiza o Ranking Global (ou insere)
        const [rankingEntry] = await Ranking.findOrCreate({
          where: { idProfile },
          defaults: { totalCorrectAnswers: 0 },
        });
        await rankingEntry.increment("totalCorrectAnswers", {
          by: 1,
          transaction,
        });
        await rankingEntry.update(
          { lastUpdated: DataTypes.NOW },
          { transaction }
        ); // Atualiza o timestamp
      }

      await transaction.commit();
      return res.status(200).json({
        success: true,
        message: "Resposta registrada.",
        data: { isCorrect: isAnswerCorrect },
      });
    } catch (error) {
      await transaction.rollback();
      return res.status(500).json({
        success: false,
        message: "Erro ao processar resposta e atualizar progresso.",
        error: error.message,
      });
    }
  },

  // 3. RANKING

  async GetRanking(req, res) {
    try {
      const topRankings = await Ranking.findAll({
        limit: 10,
        order: [
          ["totalCorrectAnswers", "DESC"], // Mais acertos primeiro
          ["lastUpdated", "ASC"], // Desempate: quem atualizou primeiro (ou o critério que você preferir)
        ],
        include: [
          {
            model: Profiles, // Assumindo que o Model Profiles está ligado ao Ranking
            attributes: ["idProfile", "nameUser", "imageProfile"], // Dados básicos do perfil
          },
        ],
      });

      return res.status(200).json({ success: true, data: topRankings });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Erro ao buscar o Ranking.",
        error: error.message,
      });
    }
  },
};

module.exports = GameProgressController;
