const { Book } = require("../../backend/app");
const { getImagePath } = require("../controllers/book");

async function postRating(req, res) {
  const id = req.params.id;
  if (id == null || id == "undefined") {
    res.status(400).send("Livre absent");
    return;
  }
  const rating = req.body.rating;
  const userId = req.tokenPayload.userId;
  const book = await Book.findById(id);
  if (book == null) {
    res.status(404).send("Livre non trouvé");
    return;
  }
  const ratingDb = book.ratings;
  const alreadyVoted = ratingDb.find((rating) => rating.userId == userId);
  if (alreadyVoted != null) {
    res.status(400).send("Vous avez déjà voté pour ce livre");
    return;
  }
  const newRating = { userId: userId, grade: rating };
  ratingDb.push(newRating);
  book.averageRating = calculateAverageRating(ratingDb);

  try {
    await book.save();
    
    const updatedBook = await Book.findById(id);
    updatedBook.imageUrl = getImagePath(updatedBook.imageUrl);
    
    res.send(updatedBook);
  } catch (error) {
    console.error(error);
    res.status(500).send("Erreur lors de la mise à jour du livre");
  }
}
function calculateAverageRating(ratings) {
  const calcul = ratings.length;
  const allGrades = ratings.reduce((sum, rating) => sum + rating.grade, 0);
  const averageRating = allGrades / calcul;
  return averageRating;
}

async function getBestRating(req, res) {
  try { 
    const booksBestRating = await Book.find().sort({ averageRating: -1 }).limit(3);
    booksBestRating.forEach((book) => {
      book.imageUrl = getImagePath(book.imageUrl);
    });
    res.send(booksBestRating);
  } catch (e) {
    console.error(e);
    res.status(500).send("Erreur" + e.message);
  }
}

module.exports = { postRating, getBestRating };