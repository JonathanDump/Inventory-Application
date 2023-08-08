const { body, validationResult } = require("express-validator");
const asyncHandler = require("express-async-handler");
const Game = require("../models/game");
const Genre = require("../models/genre");
const Developer = require("../models/developer");
const Store = require("../models/store");
const fs = require("fs");
var path = require("path");

exports.index = asyncHandler(async (req, res, next) => {
  res.redirect("/catalog/games");
});

exports.gamesList = asyncHandler(async (req, res, next) => {
  const games = await Game.find().exec();

  res.render("gamesList", {
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
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") {
        req.body.genre = [];
      } else {
        req.body.genre = new Array(req.body.genre);
      }
    }
    next();
  },
  (req, res, next) => {
    if (!(req.body.store instanceof Array)) {
      if (typeof req.body.store === "undefined") {
        req.body.store = [];
      } else {
        req.body.store = new Array(req.body.store);
      }
    }
    next();
  },
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body(
    "genre",
    "Pick at least one genre or create one needed before creating a game."
  )
    .isArray({ min: 1 })
    .escape(),
  body("store", "Pick at least one store").isArray({ min: 1 }).escape(),
  body("price", "Price must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("developer").trim().escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);

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
      img: {
        data: fs.readFileSync(path.join(__dirname + "/uploads/" + Date.now())),
        contentType: "image/png",
      },
    });

    if (!errors.isEmpty()) {
      const [genres, stores, developers] = await Promise.all([
        Genre.find().exec(),
        Store.find().exec(),
        Developer.find().exec(),
      ]);

      for (const genre of genres) {
        if (game.genre.indexOf(genre._id) > -1) {
          genre.checked = true;
        }
      }

      for (const store of stores) {
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
      if (typeof developer === "object") {
        await developer.save();
      }
      await game.save();
      res.redirect(game.url);
    }
  }),
];

exports.gameUpdateGet = asyncHandler(async (req, res, next) => {
  const [game, developers, genres, stores] = await Promise.all([
    Game.findById(req.params.id).populate("developer").exec(),
    Developer.find().exec(),
    Genre.find().exec(),
    Store.find().exec(),
  ]);

  for (const genre of genres) {
    if (game.genre.indexOf(genre._id) > -1) {
      genre.checked = true;
    }
  }

  for (const store of stores) {
    if (game.store.indexOf(store._id) > -1) {
      store.checked = true;
    }
  }

  const errors = null;
  res.render("gameForm", {
    title: "Update game",
    game,
    errors,
    developers,
    genres,
    stores,
  });
});

exports.gameUpdatePost = [
  (req, res, next) => {
    if (!(req.body.genre instanceof Array)) {
      if (typeof req.body.genre === "undefined") {
        req.body.genre = [];
      } else {
        req.body.genre = new Array(req.body.genre);
      }
    }
    next();
  },
  (req, res, next) => {
    if (!(req.body.store instanceof Array)) {
      if (typeof req.body.store === "undefined") {
        req.body.store = [];
      } else {
        req.body.store = new Array(req.body.store);
      }
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

    const developer =
      req.body.developer === ""
        ? undefined
        : Developer.find({ name: req.body.developer })
        ? Developer.find({ name: req.body.developer })._id
        : new Developer({ name: req.body.developer });

    const game = new Game({
      _id: req.params.id,
      title: req.body.title,
      genre: req.body.genre,
      price: req.body.price,
      store: req.body.store,
      developer: developer,
      description: req.body.description,
      img: { data: req.file.buffer, contentType: req.file.mimetype },
    });

    if (!errors.isEmpty()) {
      const [genres, stores, developers] = await Promise.all([
        Genre.find().exec(),
        Store.find().exec(),
        Developer.find().exec(),
      ]);

      for (const genre of genres) {
        if (game.genre.indexOf(genre._id) > -1) {
          genre.checked = true;
        }
      }

      for (const store of stores) {
        if (game.store.indexOf(store._id) > -1) {
          store.checked = true;
        }
      }

      res.render("gameForm", {
        title: "Update game",
        genres,
        developers,
        stores,
        game,
        errors: errors.errors,
      });
    } else {
      if (typeof developer === "object") {
        await developer.save();
      }
      const updatedGame = await Game.findByIdAndUpdate(req.params.id, game, {});

      res.redirect(updatedGame.url);
    }
  }),
];

exports.gameDeleteGet = asyncHandler(async (req, res, next) => {
  const game = Game.findById(req.params.id, "title").exec();

  res.render("gameDelete", {
    game,
  });
});

exports.gameDeletePost = asyncHandler(async (req, res, next) => {
  await Game.findByIdAndRemove(req.params.id);
  res.redirect("/catalog/games");
});
