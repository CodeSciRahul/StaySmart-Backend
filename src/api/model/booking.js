import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
   bedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bed",
    required: [true, "Bed id is required"],
  },
  startDate: { type: Date, required: [true, "Start date is required"] },
  endDate: { type: Date, required: [true, "End date is required"]},
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled"],
    default: "Pending",
  },
  createdAt: { type: Date, default: Date.now, expires: 900 },
}, { timestamps: true });


export default mongoose.model("Booking", bookingSchema)