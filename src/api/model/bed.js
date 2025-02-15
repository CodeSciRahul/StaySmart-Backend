import mongoose from "mongoose";

const BedSchema = new mongoose.Schema({
    roomId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Room",
        required: [true, "Room Id is required for bed"]
    },
    tenantId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Tenant",
        default: null,
    },
    bednumber: {
        type: String,
        required: [true, "Bed number is required"],
        unique: true,
    },
    price: { type: Number, required: [true, "Price for Bed is required"] },
},
{ timestamps: true }
)

BedSchema.index({ roomId: 1, bednumber: 1 }, { unique: true });

BedSchema.pre("save", async function (next) {
    const bed = this;
  
    try {
      // Validate roomId
      if (bed.roomId) {
        const Room = mongoose.model("Room");
        const roomExists = await Room.exists({ _id: bed.roomId });
        if (!roomExists) {
          throw { 
            message: "Invalid roomId: Room does not exist", 
            status: 400, 
            isCustomError: true 
          };
        }
      }
  
      // Validate tenantId (if provided)
      if (bed.tenantId) {
        const Tenant = mongoose.model("Tenant");
        const tenantExists = await Tenant.exists({ _id: bed.tenantId });
        if (!tenantExists) {
          throw { 
            message: "Invalid tenantId: Tenant does not exist", 
            status: 400, 
            isCustomError: true 
          };
        }
      }
  
      next(); // Proceed to save the document
    } catch (error) {
      next(error); // Pass the error to the error-handling middleware
    }
  });

BedSchema.pre("findOneAndUpdate", async function (next) {
    try {
      const update = this.getUpdate(); // Get the update object
      const { roomId, tenantId } = update;
  
      // Validate roomId (if provided in the update)
      if (roomId) {
        const Room = mongoose.model("Room");
        const isRoomExist = await Room.exists({ _id: roomId });
        if (!isRoomExist) {
          throw { 
            message: "Invalid roomId: Room does not exist", 
            status: 400, 
            isCustomError: true 
          };
        }
      }
  
      // Validate tenantId (if provided in the update)
      if (tenantId) {
        const Tenant = mongoose.model("Tenant");
        const isTenantExist = await Tenant.exists({ _id: tenantId });
        if (!isTenantExist) {
          throw { 
            message: "Invalid tenantId: Tenant does not exist", 
            status: 400, 
            isCustomError: true 
          };
        }
      }
  
      next(); // Proceed to the next middleware or save the document
    } catch (error) {
      next(error); // Pass the error to the error-handling middleware
    }
  });



export default mongoose.model("Bed", BedSchema);
