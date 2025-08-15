const User = require("../Models/User.Model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const AuthController = {
  //Atualizar access token
  async refreshAccessToken(req, res) {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "Refresh token ausente!" });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      // Opcional: checar se o usuário ainda existe no banco
      const user = await User.findOne({ where: { id: decoded.idUser } });
      if (!user) {
        return res
          .status(401)
          .json({ success: false, message: "Usuário não encontrado!" });
      }

      // Gera novo access token
      const newAccessToken = jwt.sign(
        { id: user.idUser, email: user.email, nameUser: user.nameUser },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION }
      );

      return res
        .status(200)
        .json({ success: true, accessToken: newAccessToken });
    } catch (err) {
      // Se o token for inválido ou expirado, retorna explicitamente sucesso falso
      return res.status(401).json({
        success: false,
        message: "Refresh token inválido ou expirado!",
      });
    }
  },

  //Login do usuário
  async Login(req, res) {
    const { email, password } = req.body;

    if (!email || !password || !email.trim() || !password.trim()) {
      return res.status(400).json({
        success: false,
        message: "Todos os campos são obrigatórios!",
      });
    }

    try {
      const user = await User.findOne({ where: { email } });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuário não encontrado!",
        });
      }

      if (!user.isVerified) {
        return res.status(403).json({
          success: false,
          message: "Email não verificado!",
        });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Senha incorreta!",
        });
      }

      const accessToken = jwt.sign(
        {
          id: user.idUser,
          email: user.email,
          nameUser: user.nameUser,
          path: "/",
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION }
      );

      const refreshToken = jwt.sign(
        {
          id: user.idUser,
          email: user.email,
          nameUser: user.nameUser,
          path: "/",
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRATION }
      );

      res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
        maxAge: process.env.JWT_EXPIRATION * 1000,
        path: "/",
      });

      // Define o refreshToken em um cookie HTTP-only seguro
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
        maxAge: process.env.JWT_REFRESH_EXPIRATION * 1000,
      });

      return res.status(200).json({
        success: true,
        message: "Login realizado com sucesso!",
        accessToken,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Erro ao realizar login",
        error: err.message,
      });
    }
  },

  //Logout
  async Logout(_, res) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: process.env.NODE_ENV === "production" ? "Strict" : "Lax",
    });

    return res.status(200).json({
      success: true,
      message: "Logout realizado com sucesso!",
    });
  },
};

module.exports = AuthController;
