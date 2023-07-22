const express = require("express");
const router = express.Router();
const bookController = require("../controllers/book.controller");
const authMiddlewares = require("../middlewares/auth.middlewares");

//*Get all book
router.get("/", bookController.getBooks);

//*Create a review
router.post("/:id/review", authMiddlewares.verifyToken, bookController.createBookReview);

//*Get top book
router.get("/top", bookController.getTopBooks);

//*Get book by id
router.get("/:id", bookController.getBookById);

//*Create a book
router.post("/", authMiddlewares.verifyToken, authMiddlewares.verifyTokenAndAdmin, bookController.createBook);

//*Delete a book
router.delete("/:id", authMiddlewares.verifyToken, authMiddlewares.verifyTokenAndAdmin, bookController.deleteBook);

//*Update a book
router.put("/:id", authMiddlewares.verifyToken, authMiddlewares.verifyTokenAndAdmin, bookController.updateBook);

module.exports = router;
