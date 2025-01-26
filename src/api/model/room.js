import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    pgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HostelPG",
      required: true,
    },
    roomNumber: { type: Number, required: true, unique: true },
    roomType: {
      type: String,
      enum: ["Single", "Double", "Triple", "Multiple"],
      required: true,
    },
    features: [{ type: String }],
  },
  { timestamps: true }
);

roomSchema.index({ pgId: 1, roomNumber: 1 }, { unique: true });

export default mongoose.model("Room", roomSchema);
