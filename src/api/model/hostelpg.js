import mongoose from "mongoose";

const hostelPGSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Owner",
      required: true,
    },
    features: [{ type: String }],
    images: [{ type: String }],
    meal: {
      type: String,
      enum: ["Available", "Not Available"],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("HostelPG", hostelPGSchema);
