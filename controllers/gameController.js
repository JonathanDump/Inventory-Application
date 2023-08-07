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
  const errors = null;

  res.render("gameForm", {
    title: "Create game",
    genres,
    developers,
    stores,
    game,
    errors,
  });
});

exports.gameCreatePost = [
  (req, res, next) => {
    console.log(req.body.title);
    console.log(req.body.description);
    console.log(req.body.developer);
    console.log(req.body.genre);
    console.log(req.body.store);
    console.log(req.body.price);
    next();
  },
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") req.body.genre = [];
      else req.body.genre = new Array(req.body.genre);
    }
    next();
  },
  (req, res, next) => {
    if (!(req.body.store instanceof Array)) {
      if (typeof req.body.store === "undefined") req.body.store = [];
      else req.body.store = new Array(req.body.store);
    }
    next();
  },
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body(
    "genre.*",
    "Pick at least one genre or create one needed before creating a game."
  )
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("store.*", "Pick at least one store")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("price", "Price must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("developer").trim().escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    console.log(errors.array());
    console.log("creating new game");

    const developer =
      req.body.developer === ""
        ? undefined
        : Developer.find({ name: req.body.developer })
        ? Developer.find({ name: req.body.developer })._id
        : new Developer({ name: req.body.developer });

    const game = new Game({
      title: req.body.title,
      genre: req.body.genre,
      price: req.body.price,
      store: req.body.store,
      developer: developer,
      description: req.body.description,
      img: req.body.img,
    });
    console.log("new game has been created");
    if (!errors.isEmpty()) {
      const [genres, stores, developers] = await Promise.all([
        Genre.find().exec(),
        Store.find().exec(),
        Developer.find().exec(),
      ]);

      for (genre of genres) {
        console.log(game.genre.indexOf(genre._id));
        if (game.genre.indexOf(genre._id) > -1) {
          genre.checked = true;
        }
      }

      for (store of stores) {
        if (game.store.indexOf(store._id) > -1) {
          store.checked = true;
        }
      }

      res.render("gameForm", {
        title: "Create game",
        genres,
        developers,
        stores,
        game,
        errors: errors.errors,
      });
    } else {
      await game.save();
      if (typeof developer === "object") {
        await developer.save();
      }
      res.redirect(game.url);
    }
  }),
];
