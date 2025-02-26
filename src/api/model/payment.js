import mongoose from "mongoose";

const paymentSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: [true, "Booking Id is required"],
    },
    paymentType: {
      type: String,
      enum: ["Full", "Partial", "PayLater"],
      required: [true, "Payment type is required"],
    },
    amount: { type: Number, required: [true, "Amount is required"] },
    amountPaid: { type: Number, default: 0 }, // Tracks how much has been paid
    amountDue: { type: Number, required: [true, "Amount due is required"] }, // Tracks remaining amount
    dueDate: { type: Date }, // For pay later or partial payments
    paymentMethod: {
      type: String,
      enum: ["Cash", "Online"],
      required: [true, "Payment method is required"],
    },
    status: {
      type: String,
      enum: ["Pending", "Successful", "Failed", "Cancelled"],
      default: "Pending",
    },
    paymentDetails: {
      // Store payment gateway response or cash payment details
      transactionId: { type: String }, // For online payments
      paidBy: { type: String }, // Name of the payer (for cash payments)
      paidAt: { type: Date }, // Timestamp of payment
    },
  },
  { timestamps: true }
);


// paymentSchema.pre(/^findOneAnd/, function (next) {
//   this.where({status: {$ne: ["Cancelled", "Failed"]}});
//   next();
// })
export default mongoose.model("Payment", paymentSchema);