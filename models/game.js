const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const GameSchema = new Schema({
  title: { type: String, required: true, maxLength: 100 },
  developer: { type: Schema.Types.ObjectId, ref: "Developer" },
  description: { type: String },
  genre: [{ type: Schema.Types.ObjectId, ref: "Genre", required: true }],
  price: { type: String, required: true },
  store: [{ type: Schema.Types.ObjectId, ref: "Store", required: true }],
  img: { data: Buffer, contentType: String },
});

GameSchema.virtual("url").get(function () {
  return `/catalog/game/${this._id}`;
});

module.exports = mongoose.model("Game", GameSchema);
