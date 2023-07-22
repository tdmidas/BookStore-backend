const express = require("express");
const router = express.Router();
const authorController = require("../controllers/author.controller");
//ADD AUTHOR
router.post("/", authorController.addAuthor);

//GET ALL AUTHORS
router.get("/", authorController.getAllAuthors);

//GET AN AUTHOR
router.get("/:id", authorController.getAnAuthor);

//UPDATE AN AUTHOR
router.put("/:id", authorController.updateAuthor);

//DELETE AUTHOR
router.delete("/:id", authorController.deleteAuthor);

module.exports = router;
