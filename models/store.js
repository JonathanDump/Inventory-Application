const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const StoreSchema = new Schema({
  name: { type: String, required: true, maxLength: 100 },
});

StoreSchema.virtual("url").get(function () {
  return `/catalog/developer/${this._id}`;
});

module.exports = mongoose.model("Store", StoreSchema);
