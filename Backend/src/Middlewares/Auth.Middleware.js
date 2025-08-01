const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Token de autenticação não fornecido!",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // anexamos os dados ao req para uso posterior
    next();
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Token inválido ou expirado!",
    });
  }
};

module.exports = authMiddleware;
