const express = require("express");
const router = express.Router();

const gameController = require("../controllers/gameController");
const genreController = require("../controllers/genreController");

var multer = require("multer");

var storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/controllers/uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });

/// GAME ROUTES ///
// router.get("/", gameController.index);

router.get("/games", gameController.gamesList);

router.get("/game/create", gameController.gameCreateGet);
router.post(
  "/game/create",
  upload.single("img"),
  gameController.gameCreatePost
);

router.get("/game/:id/update", gameController.gameUpdateGet);
router.post("/game/:id/update", gameController.gameUpdatePost);

router.get("/game/:id/delete", gameController.gameDeleteGet);
router.post("/game/:id/delete", gameController.gameDeletePost);

router.get("/game/:id", gameController.gameDetail);

// /// GENRE ROUTES ///

router.get("/genres", genreController.genresList);

router.get("/genre/create", genreController.genreCreateGet);
router.post("/genre/create", genreController.genreCreatePost);

router.get("/genre/:id/update", genreController.genreUpdateGet);
router.post("/genre/:id/update", genreController.genreUpdatePost);

router.get("/genre/:id/delete", genreController.genreDeleteGet);
router.post("/genre/:id/delete", genreController.genreDeletePost);

router.get("/genre/:id", genreController.genreDetail);

module.exports = router;
