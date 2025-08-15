const jwt = require("jsonwebtoken");
require("dotenv").config();

const authMiddleware = (req, res, next) => {
  // Primeiro tenta pegar do cookie
  const token =
    req.cookies.accessToken || req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      success: false,
      message: "Token de autenticação não fornecido!",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decodificado:", decoded);
    req.user = {
      id: decoded.id,
      email: decoded.email,
      nameUser: decoded.nameUser,
    };
    console.log("req.user antes do next():", req.user);
    next();
    console.log("Token decodificado:", decoded);
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Token inválido ou expirado!",
    });
  }
};

module.exports = authMiddleware;
