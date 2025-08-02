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
        .status(400)
        .json({ success: false, message: "Refresh token ausente!" });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      const newAccessToken = jwt.sign(
        { id: decoded.id, email: decoded.email, nameUser: decoded.nameUser },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION }
      );

      return res.status(200).json({
        success: true,
        accessToken: newAccessToken,
      });
    } catch (err) {
      return res.status(401).json({
        success: false,
        message: "Refresh token inválido ou expirado!",
      });
    }
  },

  //Login do usuário
  async Login(req, res) {
    const { email, password } = req.body;

    if (!email.trim() || !password.trim()) {
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
          id: user.id,
          email: user.email,
          nameUser: user.nameUser,
        },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRATION }
      );

      const refreshToken = jwt.sign(
        {
          id: user.id,
          email: user.email,
          nameUser: user.nameUser,
        },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRATION }
      );

      // Define o refreshToken em um cookie HTTP-only seguro
      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: true, // garante envio apenas por HTTPS
        sameSite: "Strict", // evita envio entre domínios
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 dias
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
  async Logout(res) {
    res.clearCookie("refreshToken", {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
    });

    return res.status(200).json({
      success: true,
      message: "Logout realizado com sucesso!",
    });
  },
};

module.exports = AuthController;
