const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token || !token.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Token de autenticação não fornecido!",
    });
  }

  try {
    const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
    req.user = decoded; // salva os dados decodificados no req para uso posterior
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Token inválido ou expirado!",
    });
  }
};

module.exports = authMiddleware;
