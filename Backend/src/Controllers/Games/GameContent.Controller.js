const { Op } = require("sequelize"); // Para futuras consultas
const sequelize = require("../../Config/Db"); // Instância do Sequelize
const { isPreset } = require("../../Models/Games/Games.Model");

// Importação dos Models
const Games = require("../../Models/Games/Games.Model");
const GamePhases = require("../../Models/Games/GamePhases.Model");
const GameQuestions = require("../../Models/Games/GameQuestions.Model");
const GameAnswers = require("../../Models/Games/GameAnswers.Model");
const GameAssignments = require("../../Models/Games/GameAss.Model");
const GameProgress = require("../../Models/Games/GameProgress.Model"); // Necessário para exclusão

const GameContentController = {
  async CreateGame(req, res) {
    // Assume-se que req.user.id contém o idUser do professor logado
    const idUser = req.user.id;
    const { nameGame, totalPhases, namePreset, phases } = req.body;

    if (!idUser || !nameGame || !namePreset || !phases || phases.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Dados obrigatórios (idUser, nome do jogo/preset e conteúdo) faltando.",
      });
    }

    const transaction = await sequelize.transaction();
    let idGame;

    try {
      // 1. Cria a entrada principal na tabela Games (que será o Preset)
      const newGame = await Games.create(
        {
          idUser,
          nameGame,
          totalPhases: totalPhases || phases.length,
          isPreset: true, // É sempre true ao criar um Preset
          namePreset,
        },
        { transaction }
      );

      idGame = newGame.idGame;

      // 2. Adiciona o Conteúdo (Fases, Questões e Respostas Modelo)
      for (const phaseData of phases) {
        // 2.1. Cria a Fase
        const newPhase = await GamePhases.create(
          {
            idGame: idGame,
            phaseNumber: phaseData.phaseNumber,
            // Garante que a regra 'repetir questões erradas' possa ser aplicada
            requiredCorrectAnswers: phaseData.requiredCorrectAnswers || 1,
          },
          { transaction }
        );

        // 2.2. Itera sobre as Questões da Fase
        for (const questionData of phaseData.questions) {
          const newQuestion = await GameQuestions.create(
            {
              idPhase: newPhase.idPhase,
              questionText: questionData.questionText,
            },
            { transaction }
          );

          // 2.3. Itera sobre as Respostas (Modelo) da Questão
          for (const answerData of questionData.answers) {
            await GameAnswers.create(
              {
                idGameQuestion: newQuestion.idGameQuestion,
                modelAnswer: answerData.modelAnswer,
              },
              { transaction }
            );
          }
        }
      }

      await transaction.commit();

      return res.status(201).json({
        success: true,
        message: `Preset '${namePreset}' e seu conteúdo criados com sucesso.`,
        data: { idGame: idGame },
      });
    } catch (error) {
      await transaction.rollback();
      return res.status(500).json({
        success: false,
        message: "Erro ao criar Preset do Jogo. Transação desfeita.",
        error: error.message,
      });
    }
  },

  async UpdatePreset(req, res) {
    const idGame = req.params.idGame;
    const idUser = req.user.idUser;
    const updates = req.body;

    try {
      const [rowsAffected] = await Games.update(updates, {
        where: {
          idGame: idGame,
          idUser: idUser, // Garante que apenas o criador possa editar
          isPreset: true, // Garante que só Presets possam ser atualizados por esta rota
        },
      });

      if (rowsAffected === 0) {
        return res.status(404).json({
          success: false,
          message:
            "Preset não encontrado ou você não tem permissão para editá-lo.",
        });
      }

      // Nota: Atualização de Fases/Questões/Respostas exigiria lógica mais complexa (transação de deleção/criação)

      return res.status(200).json({
        success: true,
        message: `Preset ID ${idGame} atualizado com sucesso.`,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Erro ao atualizar Preset.",
        error: error.message,
      });
    }
  },

  async DeletePreset(req, res) {
    const idGame = req.params.idGame;
    const idUser = req.user.id;
    const transaction = await sequelize.transaction();

    try {
      // 1. Exclui GameProgress e GameResponses (necessário antes de excluir Assignments)
      // Busca GameAssignments para o jogo.
      const assignments = await GameAssignments.findAll(
        {
          attributes: ["idAssignment"],
          where: { idGame: idGame },
        },
        { transaction }
      );

      const idAssignments = assignments.map((a) => a.idAssignment);

      // Deleta progressos (e respostas) associados, se houver
      if (idAssignments.length > 0) {
        await GameProgress.destroy(
          { where: { idAssignment: { [Op.in]: idAssignments } } },
          { transaction }
        );
        // GameResponses é ligado a GameAssignments, mas é mais seguro limpar GameProgress primeiro.
      }

      // 2. O CASCADE do SQL cuidará de GameAssignments, GamePhases, GameQuestions e GameAnswers
      const rowsDeleted = await Games.destroy(
        {
          where: {
            idGame: idGame,
            idUser: idUser,
            isPreset: true,
          },
        },
        { transaction }
      );

      if (rowsDeleted === 0) {
        await transaction.rollback();
        return res.status(404).json({
          success: false,
          message:
            "Preset não encontrado ou você não tem permissão para excluí-lo.",
        });
      }

      await transaction.commit();
      return res.status(200).json({
        success: true,
        message: `Preset ID ${idGame} e todo conteúdo relacionado excluídos com sucesso.`,
      });
    } catch (error) {
      await transaction.rollback();
      return res.status(500).json({
        success: false,
        message: "Erro ao excluir Preset.",
        error: error.message,
      });
    }
  },

  // 3. ATRIBUIÇÃO/ENVIO DE JOGOS (GameAssignments)

  async AssignGameToProfiles(req, res) {
    const { idGame, idProfiles } = req.body;
    const idUser = req.user.id; // Professor que está enviando

    if (!idGame || !idProfiles || idProfiles.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "IDs do Jogo ou Perfis faltando." });
    }

    try {
      // 1. Verifica se o jogo existe e pertence ao professor (ou é um Preset global, se aplicável)
      const game = await Games.findOne({
        where: { idGame: idGame, idUser: idUser, isPreset: true },
      });

      if (!game) {
        return res.status(404).json({
          success: false,
          message: "Preset não encontrado ou não pertence a você.",
        });
      }

      // 2. Cria as atribuições
      const assignments = idProfiles.map((idProfile) => ({
        idGame: idGame,
        idProfile: idProfile,
      }));

      // Cria múltiplas atribuições (GameAssignments) de uma vez
      await GameAssignments.bulkCreate(assignments, { ignoreDuplicates: true });

      return res.status(200).json({
        success: true,
        message: `${idProfiles.length} Atribuições criadas com sucesso.`,
        data: { idGame, profilesCount: idProfiles.length },
      });
    } catch (error) {
      // Loga o erro exato do Sequelize/MySQL no console do servidor
      console.error("ERRO DE INSERÇÃO NO BANCO (bulkCreate):", error.message);
      return res.status(500).json({
        success: false,
        message:
          "Falha ao salvar as atribuições no banco de dados. (Verifique o log do servidor)",
        error: error.message,
      });
    }
  },

  // 4. LISTAGEM DE CONTEÚDO E ATRIBUIÇÕES

  async ListPresets(req, res) {
    const idUser = req.user.id;

    try {
      const presets = await Games.findAll({
        where: {
          idUser: idUser,
          isPreset: true,
        },
        attributes: [
          "idGame",
          "nameGame",
          "namePreset",
          "totalPhases",
          "dateCreated",
        ],
        order: [["dateCreated", "DESC"]],
      });

      return res.status(200).json({ success: true, data: presets });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Erro ao listar Presets.",
        error: error.message,
      });
    }
  },

  async ListAssignmentsByGame(req, res) {
    const idGame = req.params.idGame;

    try {
      const assignments = await GameAssignments.findAll({
        where: { idGame: idGame },
        // Inclui os dados do perfil (aluno) associado à atribuição
        include: [
          {
            model: Profiles, // Importar Profiles no GameContent.Controller.js é necessário
            attributes: ["idProfile", "nameUser", "imageProfile"],
          },
        ],
      });

      return res.status(200).json({ success: true, data: assignments });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Erro ao listar atribuições do jogo.",
        error: error.message,
      });
    }
  },
};

module.exports = GameContentController;
