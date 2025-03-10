import mongoose from "mongoose";

const tenantHistorySchema = new mongoose.Schema({
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: [true, "Tenant ID is required"] },
    pgId: { type: mongoose.Schema.Types.ObjectId, ref: "HostelPG", required: [true, "Pg ID is required"] },
    roomId: { type: mongoose.Schema.Types.ObjectId, ref: "Room" },
    bedId: { type: mongoose.Schema.Types.ObjectId, ref: "Bed" },
    startDate: { type: Date, required: true },
    endDate: { type: Date },
});

export default mongoose.model("TenantHistory", tenantHistorySchema)