import mongoose from "mongoose";

const tenantSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String },
    phone: { type: String },
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
    aadharNo: { type: String, required: true },
    workingProfessional: {
      type: String,
      enum: ["Student", "Working", "Other"],
      required: true,
    },
    images: {
      profileImage: { type: String },
      idProof1: { type: String },
      idProof2: { type: String },
    },
    guardianDetails: {
      fatherName: { type: String },
      fatherContact: { type: String },
      motherName: { type: String },
      motherContact: { type: String },
    },
    hostelName: { type: String, required: true },
    meal: { type: String, enum: ["Include", "Not Include"], required: true },
  },
  { timestamps: true }
);

module.exports("Tenant", tenantSchema);
