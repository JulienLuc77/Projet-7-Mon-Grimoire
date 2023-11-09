const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs').promises; 

const app = express();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.toLowerCase() + ".webp";
    cb(null, Date.now() + "-" + fileName);
  }
});

const upload = multer({
  storage: storage
});

app.use(express.static("./uploads"));

app.post("/images", upload.single("image"), async (req, res) => {
  try {
    await fs.access("uploads");
  } catch (error) {
    if (error) {
      await fs.mkdir("uploads");
    }
  }

  const { buffer, originalname } = req.file;
  const timestamp = new Date().toISOString();
  const ref = `${timestamp}-${originalname}.webp`;

  try {
    const resizedImage = await sharp(buffer)
      .webp({ quality: 20 })
      .toBuffer();

    await fs.writeFile("uploads/" + ref, resizedImage);

    const link = `/uploads/${ref}`;
    return res.json({ link });
  } catch (error) {
    console.error(error);
    return res.status(500).send("Erreur lors de l'optimisation de l'image.");
  }
});

module.exports = { upload };