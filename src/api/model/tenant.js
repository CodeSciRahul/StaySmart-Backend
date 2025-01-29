import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
      minlength: [3, "Name must be at least 3 characters."],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      match: [
        /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
        "Enter a valid email.",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required."],
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "Password must contain at least 8 characters, including at least one lowercase letter, one uppercase letter, one special character, and one number.",
      ],
    },
    phone: {
      type: String,
      required: [true, "Phone number is required."],
      match: [/^\d{10}$/, "Phone number must be 10 digits."],
    },
    isEmailVerified: { type: Boolean, default: false },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
      required: [true, "Gender is required."],
    },
    maritalStatus: { type: String, required: [true, "Marital status is required."] },
    dob: { type: Date, required: [true, "Date of birth is required."] },
    address: { type: String, required: [true, "Address is required."] },
    state: { type: String, required: [true, "State is required."] },
    district: { type: String, required: [true, "District is required."] },
    course: { type: String },
    organization: { type: String },
    accommodationDate: {
      type: Date,
      required: [true, "Accommodation date is required."],
    },
    policeStation: { type: String },
    pinCode: { type: String, required: [true, "Pin code is required."] },
    aadharNo: {
      type: String,
      required: [true, "Aadhar number is required."],
      unique: true,
    },
    workingProfessional: {
      type: String,
      enum: ["Student", "Working", "Other"],
      required: [true, "Working professional status is required."],
    },
    images: {
      profileImage: { type: String },
      idProof1: { type: String, required: [true, "ID proof 1 is required."] },
      idProof2: { type: String, required: [true, "ID proof 2 is required."] },
    },
    guardianDetails: {
      fatherName: { type: String, required: [true, "Father's name is required."] },
      fatherContact: { type: String, required: [true, "Father's contact is required."] },
      motherName: { type: String, required: [true, "Mother's name is required."] },
      motherContact: { type: String, required: [true, "Mother's contact is required."] },
    },
    pgId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "HostelPG",
      required: [true, "PG ID is required."],
    },
    meal: {
      type: String,
      enum: ["Include", "Not Include"],
      required: [true, "Meal status is required."],
    },
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

// Hash password before saving
tenantSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, properties?.SALT_ROUND);
  next();
});

// Compare password method
tenantSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};


export default mongoose.model("Tenant", tenantSchema);
