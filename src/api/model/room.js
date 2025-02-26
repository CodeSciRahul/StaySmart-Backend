import mongoose from "mongoose";

const roomSchema = new mongoose.Schema(
  {
    pgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HostelPG",
      required: [true, "PG ID is required"],
    },
    roomNumber: { 
      type: Number, 
      required: [true, "Room is required"],
      min: [1, "Room number must be at least 1"],
    },
    roomType: {
      type: String,
      enum: ["Single", "Double", "Triple", "Multiple"],
      required: [true, "Room type is require"],
    },
    features: [{ type: String }],
  },
  { timestamps: true }
);

// Ensure unique room numbers within the same PG (pgId)
roomSchema.index({ pgId: 1, roomNumber: 1 }, { unique: true });

roomSchema.pre("save", async function (next) {
  const {pgId, roomNumber} = this
  try {
    const Hostel_PG = mongoose.model("HostelPG");
    const isHostelExist = await Hostel_PG.exists({_id: pgId});
    if(!isHostelExist) {
      throw {
        message: "Hostel or PG does not exist",
        status: 400,
        isCustomError: true

      }
    }

    const Room = mongoose.model("Room")
    const isRoomExist = await Room.exists({pgId, roomNumber})
    if(isRoomExist) {
      throw {
        message: "Room is already created",
        status: 400,
        isCustomError: true
      }
    }
    next()
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
})


export default mongoose.model("Room", roomSchema);
