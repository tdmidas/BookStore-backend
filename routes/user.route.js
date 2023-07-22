const express = require("express");
const router = express.Router();
const authMiddlewares = require("../middlewares/auth.middlewares");
const userController = require("../controllers/user.controller");

////* USER ROUTE

//* Get user profile
router.get(
	"/profile",
	authMiddlewares.verifyToken,
	authMiddlewares.verifyTokenAndUserAuthorization,
	userController.getUserProfile
);

//* Update user profile
router.put(
	"/profile",
	authMiddlewares.verifyToken,
	authMiddlewares.verifyTokenAndUserAuthorization,
	userController.updateUserProfile
);

////* ADMIN ROUTE

//* Get all users
router.get("/", authMiddlewares.verifyToken, authMiddlewares.verifyTokenAndAdmin, userController.getAllUsers);

//* Delete user
router.delete("/:id", authMiddlewares.verifyToken, authMiddlewares.verifyTokenAndAdmin, userController.deleteUser);

//* Get user by id
router.get("/:id", authMiddlewares.verifyToken, authMiddlewares.verifyTokenAndAdmin, userController.getUserById);

//* Update user
router.put("/:id", authMiddlewares.verifyToken, authMiddlewares.verifyTokenAndAdmin, userController.updateUser);

module.exports = router;
