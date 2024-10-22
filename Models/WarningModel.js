const mongoose = require("mongoose");

const warningSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  warningCount: { type: Number, default: 0 },
  warnings: [
    {
      message: String,
      date: { type: Date, default: Date.now },
    },
  ],
  suspended: { type: Boolean, default: false },
});

const Warning = mongoose.model("Warning", warningSchema);
module.exports = Warning;
