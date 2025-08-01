const User = require("../Models/User.Model");
const nodemailer = require("nodemailer");
const otpGenerator = require("otp-generator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const Transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const UserController = {
  //Cadastrar usuário
  async Register(req, res) {
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
      }); // gera um código numérico de 6 dígitos para verificar o usuário

      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({
          success: false,
          message: "Usuário já cadastrado com este email!",
        });
      } //verifica se já existe um usuário cadastrado com o email informado

      const hashedPassword = await bcrypt.hash(password, 10); //faz o hash da senha informada pelo usuário para armazenar de forma segura

      const newUser = await User.create({
        nameUser,
        email,
        password: hashedPassword,
        isVerified: false,
        verificationToken: VerificationCode,
      });
      //cria um novo usuário com os dados informados, incluindo o código de verificação

      await Transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Código de verificação",
        html: `<p>Seu código de verificação é: <strong>${VerificationCode}</strong></p>`,
      }); //envia o código de verificação por email

      return res.status(201).json({
        success: true,
        message: "Cadastro realizado! Verifique seu Email para ativar a conta.",
        data: newUser,
      });
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: "Erro ao cadastrar",
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
      } //se a const user (que está acima) for falsa ou nula, retorna erro com a menssagem "Código inválido"

      //Atualiza o status para verificado e remove o código
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
};

module.exports = UserController;
