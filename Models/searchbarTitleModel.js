const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const searchBarTitleSchema = new Schema({
  title: { type: String, required: true, maxLength: 25 },
  country: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
});

const SearchBarTitle = mongoose.model("SearchBarTitle", searchBarTitleSchema);

module.exports = SearchBarTitle;
