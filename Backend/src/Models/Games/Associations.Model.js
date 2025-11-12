const Games = require("./Games.Model");
const GamePhases = require("./GamePhases.Model");
const GameQuestions = require("./GameQuestions.Model");
const GameAnswers = require("./GameAnswers.Model");
const GameAssignments = require("./GameAss.Model");
const GameResponses = require("./GameResponses.Model");
const GameProgress = require("./GameProgress.Model");
const Ranking = require("./Ranking.Model");
const User = require("../User.Model");
const Profiles = require("../Profiles.Model");

function setupAssociations() {
  Games.belongsTo(User, { foreignKey: "idUser" });

  Games.hasMany(GamePhases, { foreignKey: "idGame" });
  GamePhases.belongsTo(Games, { foreignKey: "idGame" });

  GamePhases.hasMany(GameQuestions, { foreignKey: "idPhase" });
  GameQuestions.belongsTo(GamePhases, { foreignKey: "idPhase" });

  GameQuestions.hasMany(GameAnswers, { foreignKey: "idGameQuestion" });
  GameAnswers.belongsTo(GameQuestions, { foreignKey: "idGameQuestion" });

  Games.hasMany(GameAssignments, { foreignKey: "idGame" });
  GameAssignments.belongsTo(Games, { foreignKey: "idGame" });

  GameResponses.belongsTo(GameAssignments, { foreignKey: "idAssignment" });
  GameResponses.belongsTo(GameQuestions, { foreignKey: "idGameQuestion" });

  GameProgress.belongsTo(GameAssignments, { foreignKey: "idAssignment" });
  GameAssignments.hasOne(GameProgress, { foreignKey: "idAssignment" });

  GameAssignments.belongsTo(Profiles, { foreignKey: "idProfile" });
  Profiles.hasMany(GameAssignments, { foreignKey: "idProfile" });

  Ranking.belongsTo(Profiles, { foreignKey: "idProfile" });
  Profiles.hasOne(Ranking, { foreignKey: "idProfile" });
}

module.exports = setupAssociations;
