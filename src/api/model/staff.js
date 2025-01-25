import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: {
    type: String,
    enum: ["Manager", "Cook", "Cleaner", "Security", "Electrician"],
    required: true,
  },
  contact: { type: String, required: true },
  address: { type: String },
  salary: { type: Number, required: true },
  pgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HostelPG",
    required: true,
  },
  joinedDate: { type: Date, default: Date.now },
  status: { type: String, enum: ["Active", "Resigned"], default: "Active" },
});

export default mongoose.model("Staff", staffSchema);
