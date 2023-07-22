const express = require("express");
const router = express.Router();
const orderController = require("../controllers/order.controller");
const authMiddlewares = require("../middlewares/auth.middlewares");

router.post("/", authMiddlewares.verifyTokenAndUserAuthorization, orderController.addOrderItems);

router.get("/myorders", authMiddlewares.verifyTokenAndUserAuthorization, orderController.getMyOrder);

router.get("/:id", authMiddlewares.verifyTokenAndAdmin, orderController.getOrderById);

router.put("/:id/pay", authMiddlewares.verifyTokenAndUserAuthorization, orderController.updateOrderToPaid);

router.get("/", authMiddlewares.verifyToken, authMiddlewares.verifyTokenAndAdmin, orderController.getOrders);

router.put(
	"/:id/deliver",
	authMiddlewares.verifyToken,
	authMiddlewares.verifyTokenAndAdmin,
	orderController.updateOrderToDelivered
);

module.exports = router;
