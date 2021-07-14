const express = require("express");
const router = express.Router();

const axios = require("axios");

const dotenv = require("dotenv");
dotenv.config();

router.get("/popular", async (req, res, next) => {
  // GET /book/popular
  try {
    const nytBookData = await axios.get(`https://api.nytimes.com/svc/books/v3/lists/current/combined-print-and-e-book-fiction.json?api-key=${process.env.NYT_API_KEY}`);

    const bookDataOnly =nytBookData.data.results;

    
    res.status(200).json(bookDataOnly);
  } catch (error) {
    console.error(error);
    next(error);
  }
});

module.exports = router;
