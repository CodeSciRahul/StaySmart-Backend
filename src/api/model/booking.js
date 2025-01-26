import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema({
   bedId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bed",
    required: true,
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date },
  status: {
    type: String,
    enum: ["Pending", "Confirmed", "Cancelled", "Completed"],
    default: "Pending",
  },
}, { timestamps: true });


module.exports("Booking", bookingSchema);
