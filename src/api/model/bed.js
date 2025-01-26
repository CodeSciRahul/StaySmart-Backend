import mongoose from "mongoose";

const BedSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: true
    },
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tenant",
        default: null,
    },
    bednumber: {
        type: Number,
        required: true,
        unique: true,
    },
    price: { type: Number, required: true },
},
{ timestamps: true }
)

BedSchema.index({ roomId: 1, bednumber: 1 }, { unique: true });

export default mongoose.model("Bed", BedSchema);
