import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    pgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HostelPG",
      required: [true, "PG ID is required"],
    },
    roomNumber: { type: Number, required: [true, "Room is required"], unique: true },
    roomType: {
      type: String,
      enum: ["Single", "Double", "Triple", "Multiple"],
      required: [true, "Room type is require"],
    },
    features: [{ type: String }],
  },
  { timestamps: true }
);

roomSchema.index({ pgId: 1, roomNumber: 1 }, { unique: true });



export default mongoose.model("Room", roomSchema);
