// const Games = require("./Games.Model");
// const GamePhases = require("./GamePhases.Model");
// const GameQuestions = require("./GameQuestions.Model");
// const GameAnswers = require("./GameAnswers.Model");
// const GameAssignments = require("./GameAss.Model");
// const GameResponses = require("./GameResponses.Model");
// const GameProgress = require("./GameProgress.Model");
// const Ranking = require("./Ranking.Model");
// const User = require("../User.Model");
// const Profiles = require("../Profiles.Model");

// function setupAssociations() {
//   // 🔹 Games ↔ User
//   Games.belongsTo(User, { foreignKey: "idUser" });

//   // 🔹 Games ↔ GamePhases
//   Games.hasMany(GamePhases, { foreignKey: "idGame" });
//   GamePhases.belongsTo(Games, { foreignKey: "idGame" });

//   // 🔹 GamePhases ↔ GameQuestions
//   GamePhases.hasMany(GameQuestions, { foreignKey: "idPhase" });
//   GameQuestions.belongsTo(GamePhases, { foreignKey: "idPhase" });

//   // 🔹 GameQuestions ↔ GameAnswers
//   GameQuestions.hasMany(GameAnswers, { foreignKey: "idGameQuestion" });
//   GameAnswers.belongsTo(GameQuestions, { foreignKey: "idGameQuestion" });

//   // 🔹 Games ↔ GameAssignments
//   Games.hasMany(GameAssignments, { foreignKey: "idGame" });
//   GameAssignments.belongsTo(Games, { foreignKey: "idGame" });

//   // 🔹 GameResponses ↔ GameAssignments & GameQuestions
//   GameResponses.belongsTo(GameAssignments, { foreignKey: "idAssignment" });
//   GameResponses.belongsTo(GameQuestions, { foreignKey: "idGameQuestion" });

//   // 🔹 GameProgress ↔ GameAssignments
//   GameProgress.belongsTo(GameAssignments, { foreignKey: "idAssignment" });

//   // 🔹 Ranking ↔ Profiles
//   Ranking.belongsTo(Profiles, { foreignKey: "idProfile" });
// }

// module.exports = setupAssociations;
