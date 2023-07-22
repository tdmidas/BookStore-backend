const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddlewares = require("../middlewares/auth.middlewares");
//REGISTER
router.post("/register", authController.registerUser);

//REFRESH TOKEN
router.post("/refresh", authController.requestRefreshToken);

//LOG IN
router.post("/login", authController.loginUser);

//LOG OUT
router.post("/logout", authMiddlewares.verifyToken, authController.logOut);

module.exports = router;
