const mongoose = require("mongoose");

const sponsorshipSchema = new mongoose.Schema({
  brandName: { type: String, required: true },
  image_url: { type: String, required: true },
  adLocation: {
    type: String,
    enum: ["home", "home_two", "explore"],
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
});

const Sponsor = mongoose.model("Sponsorship", sponsorshipSchema);
module.exports = Sponsor;
