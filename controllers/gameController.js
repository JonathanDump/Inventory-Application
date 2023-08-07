const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const Game = require("../models/game");
const Genre = require("../models/genre");
const Developer = require("../models/developer");
const Store = require("../models/store");

exports.index = asyncHandler(async (req, res, next) => {
  res.redirect("/catalog/games");
});

exports.gamesList = asyncHandler(async (req, res, next) => {
  const games = await Game.find().exec();

  res.render("games", {
    games,
  });
});

exports.gameDetail = asyncHandler(async (req, res, next) => {
  console.log("123");
  const game = await Game.findById(req.params.id)
    .populate("genre")
    .populate("developer")
    .populate("store")
    .exec();

  if (game === null) {
    // No results.
    const err = new Error("Game not found");
    err.status = 404;
    return next(err);
  }

  res.render("gameDetail", {
    title: game.title,
    game,
  });
});

exports.gameCreateGet = asyncHandler(async (req, res, next) => {
  const [genres, developers, stores] = await Promise.all([
    Genre.find().exec(),
    Developer.find().exec(),
    Store.find().exec(),
  ]);
  const game = null;

  res.render("gameForm", {
    title: "Create game",
    genres,
    developers,
    stores,
    game,
  });
});
