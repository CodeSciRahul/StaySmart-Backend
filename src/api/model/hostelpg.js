import mongoose from "mongoose";

const hostelPGSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Hostel or PG name is required"], unique: true },
    address: { type: String, required: [true, "Address is required"] },
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
