import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema({
  bookingId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Booking",
    required: true,
  },
  amount: { type: Number, required: true },
  date: { type: Date, required: true },
  method: {
    type: String,
    enum: ["Cash", "Check", "Online"],
    required: true,
  },
  status: { type: String, enum: ["Successful", "Failed"], required: true },
}, { timestamps: true });


export default module.exports("Payment", paymentSchema);
