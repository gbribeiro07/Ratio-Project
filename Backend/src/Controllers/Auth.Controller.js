const User = require("../Models/User.Model");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const AuthController = {
  async refreshAccessToken(req, res) {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res
        .status(400)
        .json({ success: false, message: "Refresh token ausente!" });
    }

    try {
      const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);

      const newAccessToken = jwt.sign(
        { id: decoded.id },
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

      return res.status(200).json({
        success: true,
        message: "Login realizado com sucesso!",
        accessToken,
        refreshToken,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Erro ao realizar login",
        error: err.message,
      });
    }
  },
};

module.exports = AuthController;
