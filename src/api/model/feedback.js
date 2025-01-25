import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    pgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HostelPG",
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      required: true,
    },
    rating: { type: Number, min: 1, max: 5, required: true },
    comments: { type: String },
    date: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export default module.exports("Feedback", feedbackSchema);
