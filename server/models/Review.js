const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    code: { type: String, required: true },
    language: { type: String, required: true },
    feedback: { type: String, required: true },
  },
  { timestamps: true }
);

// Every history read filters by userId and sorts by createdAt desc —
// this compound index makes that query index-only instead of a full scan
// once the collection grows past a handful of documents.
reviewSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Review", reviewSchema);
