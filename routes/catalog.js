const express = require("express");
const router = express.Router();

const gameController = require("../controllers/gameController");
const genreController = require("../controllers/genreController");

/// GAME ROUTES ///
router.get("/", gameController.index);

router.get("/games", gameController.gamesList);

router.get("/game/create", gameController.gameCreateGet);
// router.post("/game/create", gameController.gameCreatePost);

// router.get("/game/:id/update", gameController.gameUpdateGet);
// router.post("/game/:id/update", gameController.gameUpdatePost);

// router.get("/game/:id/delete", gameController.gameUpdateGet);
// router.post("/game/:id/delete", gameController.gameUpdatePost);

router.get("/game/:id", gameController.gameDetail);

// /// GENRE ROUTES ///

// router.get("/genre/:id", genreController.genreDetail);

// router.get("/genre/create", genreController.genreCreateGet);
// router.post("/genre/create", genreController.genreCreatePost);

// router.get("/genre/:id/update", genreController.genreUpdateGet);
// router.post("/genre/:id/update", genreController.genreUpdatePost);

// router.get("/genre/:id/delete", genreController.genreUpdateGet);
// router.post("/genre/:id/delete", genreController.genreUpdatePost);

module.exports = router;
