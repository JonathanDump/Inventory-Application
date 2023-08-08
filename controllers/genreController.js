const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const Game = require("../models/game");
const Genre = require("../models/genre");

exports.genresList = asyncHandler(async (req, res, next) => {
  const genres = await Genre.find().exec();

  res.render("genresList", {
    genres,
  });
});

exports.genreDetail = asyncHandler(async (req, res, next) => {
  const [genre, games] = await Promise.all([
    Genre.findById(req.params.id),
    Game.find({ genre: req.params.id }),
  ]);

  res.render("genreDetail", {
    genre,
    games,
  });
});

exports.genreCreateGet = asyncHandler(async (req, res, next) => {
  res.render("genreForm", {
    title: "Add genre",
  });
});

exports.genreCreatePost = [
  body("name", "Name should be provided").trim().isLength({ min: 1 }).escape(),
  asyncHandler(async (res, req, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("genreCreate", {
        errors: errors.errors,
      });
    } else {
      const genre = new Genre({ name: req.body.name });
      await genre.save();
      res.redirect("/catalog/genres");
    }
  }),
];

exports.genreUpdateGet = asyncHandler(async (req, res, next) => {
  const genre = Genre.findById(req.params.id).exec();

  res.render("genreForm", {
    title: "Update genre",
    genre,
  });
});

exports.genreUpdatePost = [
  body("name", "Name should be provided").trim().isLength({ min: 1 }).escape(),
  asyncHandler(async (res, req, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("genreCreate", {
        errors: errors.errors,
      });
    } else {
      const genre = new Genre({ _id: req.params.id, name: req.body.name });
      await genre.save();
      res.redirect("/catalog/genres");
    }
  }),
];

exports.genreDeleteGet = asyncHandler(async (req, res, next) => {
  await Genre.findByIdAndDelete(req.body.genreID);
});

exports.genreDeletePost = asyncHandler(async (req, res, next) => {
  const [genre, games] = await Promise.all([
    Genre.findById(req.params.id).exec(),
    Game.find({ genre: req.params.id }),
  ]);

  res.render("genreDelete", {
    genre,
    games,
  });
});
