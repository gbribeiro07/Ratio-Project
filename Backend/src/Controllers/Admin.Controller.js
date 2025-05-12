const User = require("../Models/User.Model");
const nodemailer = require("nodemailer");
require("dotenv").config();

const Transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const AdminController = {
  async ModifyPermission(req, res) {
    const { userId, newPermission } = req.body;
  },
};
