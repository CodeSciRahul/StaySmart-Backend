import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    pgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HostelPG",
      required: true,
    },
    roomNumber: { type: String, required: true },
    roomType: {
      type: String,
      enum: ["Single", "Double", "Triple", "Multiple"],
      required: true,
    },
    occupancyStatus: { type: Boolean, default: false },
    price: { type: Number, required: true },
    features: [{ type: String }],
  },
  { timestamps: true }
);

export default mongoose.model("Room", roomSchema);
