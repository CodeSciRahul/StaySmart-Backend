import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String, required: true },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    maritalStatus: { type: String, required: true },
    dob: { type: Date, required: true },
    address: { type: String, required: true },
    state: { type: String, required: true },
    district: { type: String, required: true },
    course: { type: String },
    organization: { type: String },
    accommodationDate: { type: Date, required: true },
    policeStation: { type: String },
    pinCode: { type: String, required: true },
    aadharNo: { type: String, required: true, unique: true },
    workingProfessional: {
      type: String,
      enum: ["Student", "Working", "Other"],
      required: true,
    },
    images: {
      profileImage: { type: String },
      idProof1: { type: String, required: true },
      idProof2: { type: String, required: true },
    },
    guardianDetails: {
      fatherName: { type: String },
      fatherContact: { type: String },
      motherName: { type: String },
      motherContact: { type: String },
    },
    pgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HostelPG",
      required: true,
    },
    meal: { type: String, enum: ["Include", "Not Include"], required: true },
  },
  { timestamps: true }
);

// Define custom validation function
tenantSchema.pre("save", async function (next) {
  const { workingProfessional, guardianDetails, course, organization } = this;

  if (workingProfessional === "Student") {
    if (
      !guardianDetails.fatherName ||
      !guardianDetails.fatherContact
    ) {
      return next(new Error("Guardian details required for Students."));
    }
    if (!course) {
      return next(new Error("course are required for Students."));
    }
  } else if (workingProfessional === "Working") {
    if (!organization) {
      return next(
        new Error("Organization is required for Working Professionals.")
      );
    }
  }

  next();
});

export default mongoose.model("Tenant", tenantSchema);
