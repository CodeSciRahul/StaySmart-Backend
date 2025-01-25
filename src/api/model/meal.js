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
  },
  { timestamps: true }
);

export default mongoose.model("Meal", mealSchema)