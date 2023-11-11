const express = require("express");
const { upload } = require("./middleware/upload");
const { checkToken } = require("./middleware/auth");
const { postRating, getBestRating } = require("./controllers/rating");
const { signUp, loginUser } = require("./controllers/user");
const { modifyBook, deleteBook, getBookById, getBooks, postBook } = require("./controllers/book");

const router = express.Router();

// Routes pour les utilisateurs
router.post("/api/auth/signup", signUp);
router.post("/api/auth/login", loginUser);

// Routes pour les livres
router.get("/api/books/bestrating", getBestRating);
router.get("/api/books/:id", getBookById);
router.get("/api/books", getBooks);
router.post("/api/books", checkToken, upload.single("image"), postBook);
router.delete("/api/books/:id", checkToken, deleteBook);
router.put("/api/books/:id", checkToken, upload.single("image"), modifyBook);
router.post("/api/books/:id/rating", checkToken, postRating);

module.exports = router;