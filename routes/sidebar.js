var express = require("express");
var router = express.Router();
const asyncHandler = require("express-async-handler");
const Genre = require("../models/genre");

router.get(
  "/",
  asyncHandler(async (req, res, next) => {
    const genres = await Genre.find({}).exec();

    res.render("sidebar", {
      title: "Genres",
      genres: genres,
    });
  })
);

module.exports = router;
