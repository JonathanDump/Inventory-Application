const userArgs = process.argv.slice(2);

const Game = require("./models/game");
const Developer = require("./models/developer");
const Genre = require("./models/genre");
const Store = require("./models/store");

const genres = [];
const developers = [];
const games = [];
const stores = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
  console.log("Debug: About to connect");
  await mongoose.connect(mongoDB);
  console.log("Debug: Should be connected?");
  await createGenres();
  await createDevelopers();
  await createStores();
  await createGames();

  console.log("Debug: Closing mongoose");
  mongoose.connection.close();
}

async function genreCreate(index, name) {
  const genre = new Genre({ name: name });
  await genre.save();
  genres[index] = genre;
  console.log(`Added genre: ${name}`);
}

async function storeCreate(index, name) {
  const store = new Store({ name: name });
  await store.save();
  stores[index] = store;
  console.log(`Added store: ${name}`);
}

async function developerCreate(index, name, description) {
  const developer = new Developer({ name: name });
  if (description !== false) {
    developer.description = description;
  }
  await developer.save();
  developers[index] = developer;
  console.log(`Added developer: ${name}`);
}

async function gameCreate(
  index,
  title,
  developer,
  description,
  genre,
  price,
  store
) {
  const game = new Game({
    index: index,
    title: title,
    developer: developer,
    description: description,
    genre: genre,
    price: price,
    store: store,
  });

  await game.save();
  games[index] = game;
  console.log(`Added game: ${title}`);
}

async function createStores() {
  console.log("Adding stores");
  await Promise.all([
    storeCreate(0, "Steam"),
    storeCreate(1, "EGS"),
    storeCreate(2, "GOG"),
    storeCreate(3, "Uplay"),
  ]);
}

async function createGenres() {
  console.log("Adding genres");
  await Promise.all([
    genreCreate(0, "RPG"),
    genreCreate(1, "Adventure"),
    genreCreate(2, "Action"),
    genreCreate(3, "Strategy"),
  ]);
}

async function createDevelopers() {
  console.log("Adding developers");
  await Promise.all([
    developerCreate(0, "Rockstar Games", false),
    developerCreate(
      1,
      "CD PROJEKT RED",
      "CD PROJEKT RED is a development studio founded in 2002. Our mission is to tell emotional stories riddled with meaningful choices and consequences, as well as featuring characters gamers can truly connect with."
    ),
    developerCreate(2, "Bethesda", false),
    developerCreate(
      3,
      "Larian Studios",
      "Larian Studios is an independent RPG developer founded in 1996 in Gent, Belgium."
    ),
    developerCreate(4, "Ubisoft", false),
  ]);
}

async function createGames() {
  console.log("Adding games");

  await Promise.all([
    gameCreate(
      0,
      "Baldur's Gate 3",
      developers[3],
      "Baldur’s Gate 3 is a story-rich, party-based RPG set in the universe of Dungeons & Dragons, where your choices shape a tale of fellowship and betrayal, survival and sacrifice, and the lure of absolute power.",
      [genres[0], genres[1], genres[3]],
      800,
      [stores[0], stores[1], stores[2]]
    ),
    gameCreate(
      1,
      "Divinity: Original Sin 2",
      developers[3],
      "The critically acclaimed RPG that raised the bar, from the creators of Baldur's Gate 3. Gather your party. Master deep, tactical combat. Venture as a party of up to four - but know that only one of you will have the chance to become a God.",
      [genres[0], genres[1], genres[3]],
      539,
      [stores[0], stores[1], stores[2]]
    ),
    gameCreate(
      2,
      "The Witcher® 3: Wild Hunt",
      developers[1],
      "You are Geralt of Rivia, mercenary monster slayer. Before you stands a war-torn, monster-infested continent you can explore at will. Your current contract? Tracking down Ciri — the Child of Prophecy, a living weapon that can alter the shape of the world.",
      [genres[0]],
      539,
      [stores[0], stores[1], stores[2]]
    ),
    gameCreate(
      3,
      "Red Dead redemption 2",
      developers[0],
      "Winner of over 175 Game of the Year Awards and recipient of over 250 perfect scores, RDR2 is the epic tale of outlaw Arthur Morgan and the infamous Van der Linde gang, on the run across America at the dawn of the modern age. Also includes access to the shared living world of Red Dead Online.",
      [genres[1], genres[2]],
      900,
      [stores[0], stores[1]]
    ),
    gameCreate(
      4,
      "The Elder Scrolls V: Skyrim Special Edition",
      developers[2],
      "Winner of more than 200 Game of the Year Awards, Skyrim Special Edition brings the epic fantasy to life in stunning detail. The Special Edition includes the critically acclaimed game and add-ons with all-new features like remastered art and effects, volumetric god rays, dynamic depth of field, screen-space...",
      [genres[0]],
      649,
      [stores[0], stores[1], stores[2]]
    ),
    gameCreate(
      5,
      "Assassin's Creed Brotherhood",
      developers[4],
      "It's time to join the Brotherhood.",
      [genres[1], genres[2]],
      299,
      [stores[0]]
    ),
    gameCreate(
      6,
      "Grand Theft Auto V",
      developers[0],
      "Grand Theft Auto V for PC offers players the option to explore the award-winning world of Los Santos and Blaine County in resolutions of up to 4k and beyond, as well as the chance to experience the game running at 60 frames per second.",
      [genres[1], genres[2]],
      348,
      [stores[0], stores[1]]
    ),
    gameCreate(
      7,
      "Cyberpunk 2077",
      developers[1],
      "Cyberpunk 2077 is an open-world, action-adventure RPG set in the dark future of Night City — a dangerous megalopolis obsessed with power, glamor, and ceaseless body modification.",
      [genres[0]],
      1099,
      [stores[0], stores[1], stores[2]]
    ),
  ]);
}
