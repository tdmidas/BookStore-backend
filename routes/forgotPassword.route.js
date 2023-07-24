const express = require("express");
const router = express.Router();
const passwordRecovery = require("../controllers/forgotPassword.controller");

router.post("/recover_password", passwordRecovery.sendEmail);
