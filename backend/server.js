const { app, checkToken} = require("../backend/middleware/auth");
const { upload } = require("../backend/middleware/upload");
const { signUp, loginUser } = require("../backend/controllers/user");
const { modifyBook, deleteBook, getBookById, getBooks, postBook } = require("../backend/controllers/book");
const { postRating, getBestRating } = require("../backend/controllers/rating");

app.post("/api/auth/signup", signUp);
app.get("/api/books/bestrating", getBestRating);
app.post("/api/auth/login", loginUser);
app.get("/api/books/:id", getBookById);
app.get("/api/books", getBooks);
app.post("/api/books", checkToken, upload.single("image"), postBook);
app.delete("/api/books/:id", checkToken, deleteBook);
app.put("/api/books/:id", checkToken, upload.single("image"), modifyBook);
app.post("/api/books/:id/rating", checkToken, postRating);