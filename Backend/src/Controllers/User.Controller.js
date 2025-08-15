const User = require("../Models/User.Model");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_SUPPORT,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

// Teste de conexão SMTP
Transporter.verify(function (error, success) {
  if (error) {
    console.error("Erro SMTP:", error);
  } else {
    console.log("Servidor SMTP pronto");
  }
});

const UserController = {
  //Cadastrar usuário
  async Register(req, res) {
    console.log("Dados recebidos:", req.body);
    const { nameUser, email, password } = req.body;
    if (!nameUser?.trim() || !email?.trim() || !password?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Todos os campos são obrigatórios!",
      });
    }

    try {
      const VerificationCode = otpGenerator.generate(6, {
        digits: true,
        upperCaseAlphabets: false,
        specialChars: false,
      });

      // Verifica se já existe um usuário VERIFICADO com este email
      const verifiedUser = await User.findOne({
        where: {
          email,
          isVerified: true,
        },
      });

      if (verifiedUser) {
        return res.status(400).json({
          success: false,
          message: "Usuário já cadastrado com este email!",
        });
      }

      // Remove registros não verificados anteriores do mesmo email
      await User.destroy({
        where: {
          email,
          isVerified: false,
        },
      });

      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = await User.create({
        nameUser,
        email,
        password: hashedPassword,
        isVerified: false,
        verificationToken: VerificationCode,
      });

      await Transporter.sendMail({
        from: process.env.EMAIL_SUPPORT,
        to: email,
        subject: "Código de verificação",
        html: `<h1>Bem-vindo a Ratio!</h1>
        <p>Para prosseguir com o cadastro da sua nova conta, verifique o seu e-mail utilizando o código de 6 dígitos abaixo:</p>
        <h2 style="color:blue;">${VerificationCode}</h2>
        <p>Obs.: se você não fez esta requisição, ignore este e-mail.</p>`,
      });

      return res.status(201).json({
        success: true,
        message:
          "Código de verificação enviado! Verifique seu Email para completar o cadastro.",
        data: {
          email: newUser.email, // Retorna apenas o email por segurança
        },
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Erro ao processar cadastro",
        error: err.message,
      });
    }
  },

  //verificar email do usuário
  async VerifyEmail(req, res) {
    const { email, VerificationCode } = req.body;

    try {
      const user = await User.findOne({
        where: { email, verificationToken: VerificationCode },
      }); //busca o usuário onde o vericationToken contém o VerificationCode referente ao email em questão

      if (!user) {
        return res
          .status(400)
          .json({ success: false, message: "Código inválido!" });
      }
      user.isVerified = true;
      user.verificationToken = null;
      await user.save();

      return res.status(200).json({
        success: true,
        message: "Email verificado com sucesso!",
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Erro ao verificar Email!",
        error: err.message,
      });
    }
  },

  async getUserBasics(req, res) {
    console.log("Buscando usuário com ID:", req.user?.id);
    try {
      const user = await User.findOne({
        where: { idUser: req.user.id },
        attributes: ["idUser", "nameUser", "email", "image_profile"],
      });

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "Usuário não encontrado!",
        });
      }

      return res.status(200).json({
        success: true,
        data: user,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Erro ao buscar dados do usuário!",
        error: err.message,
      });
    }
  },
};

module.exports = UserController;
