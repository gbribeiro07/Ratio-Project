const User = require("../Models/User.Model");
const nodemailer = require("nodemailer");
const otpGenerator = reuquire("otp-generator");
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
    if (!nameUser.trim() || !email.trim() || !password.trim()) {
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

      const newUser = await User.create({
        nameUser,
        email,
        password,
        isVerified: false,
        verificationToken: VerificationCode, //salva o código gerado no banco
      });

      await Transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "Código de verificação",
        html: `<p>Seu código de verificação é: <strong>${verificationCode}</strong></p>`,
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
