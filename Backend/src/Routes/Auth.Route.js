const express = require("express");
const router = express.Router();
const AuthController = require("../Controllers/Auth.Controller");

router.post("/Login", AuthController.Login);
router.post("/Refresh", AuthController.refreshAccessToken);
router.post("/Logout", AuthController.Logout);

module.exports = router;
