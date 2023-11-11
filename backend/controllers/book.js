const { Book } = require("../../backend/models/Book");

async function modifyBook(req, res) {
  const id = req.params.id;
  console.log("req.body.book:", req.body.book);
  const book = JSON.parse(req.body.book);
  const bookDeleted = await Book.findById(id);
    if (bookDeleted == null) {
      res.status(404).send("Livre non trouvé");
      return;
    }
    const userDb = bookDeleted.userId;
    const userToken = req.result.userId;
    if (userDb != userToken) {
      res.status(403).send("Interdiction de modifier un livre publié par une autre personne");
      return;
    }
  const newBook = {};
  if (book.title) newBook.title = book.title;
  if (book.author) newBook.author = book.author;
  if (book.year) newBook.year = book.year; 
  if (book.genre) newBook.genre = book.genre;
  if (req.file != null) newBook.imageUrl = req.file.filename;

  await Book.findByIdAndUpdate(id, newBook);
  res.send("Livre modifié !")
}

async function deleteBook(req, res) {
  console.log("token payload on request", req.result)
  const id = req.params.id; 
  try {
    const bookDeleted = await Book.findById(id);
    if (bookDeleted == null) {
      res.status(404).send("Livre non trouvé");
      return;
    }
    const userDb = bookDeleted.userId;
    const userToken = req.result.userId;
    if (userDb != userToken) {
      res.status(403).send("Interdiction de supprimer un livre publié par une autre personne");
      return;
    }
    await Book.findByIdAndDelete(id);
    res.send("Livre supprimé !")
  } catch (e) {
    console.error(e);
    res.status(500).send("Erreur de saisie" + e.message);
  }
}

async function getBookById(req, res) {
  const id = req.params.id;
  try {

    const book = await Book.findById(id);
    if (book == null) {
      res.status(404).send("Livre non trouvé");
      return;
    }
    book.imageUrl = process.env.PUBLIC_URL + "/" + process.env.IMAGES_FOLDER_PATH + "/" + book.imageUrl;
    res.send(book);
  } catch (e) {
    console.error(e);
    res.status(500).send("Erreur de saisie" + e.message);
  }
}

async function getBooks (req, res) {
  const books = await Book.find();
  books.forEach((book) => {
    book.imageUrl = getImagePath(book.imageUrl);
  });
  res.send(books);
}

function getImagePath(fileName) {
  return process.env.PUBLIC_URL + "/" + process.env.IMAGES_FOLDER_PATH + "/" + fileName;
}

 async function postBook (req, res){
  const stringBook = req.body.book;
  const book = JSON.parse(stringBook);
  const filename = req.file.filename;
  book.imageUrl = filename;
  try {
    const result = await Book.create(book);
    res.send({message: "Avis publié", book: result});
  } catch (e) {
    console.error(e);
    res.status(500).send("Erreur sur un champ de saisie")
  }
}

module.exports = { modifyBook, deleteBook, getBookById, getBooks, postBook, getImagePath }