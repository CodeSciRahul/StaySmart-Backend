import mongoose from "mongoose";

const staffSchema = new mongoose.Schema({
  name: { type: String, required: [true, "name is required"], minlength: [3, "Name must be atleast 3 characters" ], trim: true},
  role: {
    type: String,
    enum: ["Manager", "Cook", "Cleaner", "Security", "Electrician"],
    required: [true, "Role is required"],
  },
  contact: { type: String, required: [true, "contact is required"] },
  address: { type: String },
  salary: { type: Number, required: [true, "Salary is required"] },
  pgId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "HostelPG",
    required: [true, "PG ID is required"],
  },
  joinedDate: { type: Date, default: Date.now },
  status: { type: String, enum: ["Active", "Resigned"], default: "Active" },
});

export default mongoose.model("Staff", staffSchema);
