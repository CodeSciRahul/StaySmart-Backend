import mongoose from "mongoose";

const mealSchema = new mongoose.Schema(
  {
    pgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HostelPG",
      required: true,
    },
    day: {
      type: String,
      enum: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      required: true,
    },
    type: {
      type: String,
      enum: ["Breakfast", "Lunch", "Dinner", "Snack"],
      required: true,
    },
    dishes: [
      {
        name: { type: String, required: true },
        description: { type: String },
        image: { type: String },
        isVegetarian: { type: Boolean, default: true },
      },
    ],
    tenantPreferences: [
      {
        tenantId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Tenant",
        },
        optedIn: { type: Boolean, default: true }, // Whether the tenant opts in for this meal
        customPrice: { type: Number }, // Optional custom price for this tenant
      },
    ],
    price: {
      type: Number, // Price for the meal
      required: false,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Meal", mealSchema)