import mongoose from "mongoose";

const BedSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: [true, "Room Id is required for bed"],
    },
    tenantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Tenant",
      default: null,
    },
    bednumber: {
      type: String,
      required: [true, "Bed number is required"],
    },
    price: { type: Number, required: [true, "Price for Bed is required"] },
  },
  { timestamps: true }
);

BedSchema.pre("save", async function (next) {
  const { roomId, bednumber } = this;
  try {
    //import model
    const bed = mongoose.model("Bed");
    const Room = mongoose.model("Room");

    // Validate roomId
    const roomExists = await Room.findOne({ _id: roomId });
    if (!roomExists) {
      throw {
        message: "Invalid roomId: Room does not exist",
        status: 400,
        isCustomError: true,
      };
    }

    //ensure unique bedId
    const isBedExist = await bed.exists({ roomId, bednumber });
    if (isBedExist) {
      throw {
        message:
          "A bed with this number already exists in the room. Please provide a unique bed number.",
        status: 400,
        isCustomError: true,
      };
    }

    //ensure in room only proceed allowed bed.
    const { roomType } = roomExists;
    const numberOfBeds = await bed.countDocuments({ roomId });

    const maxBedsAllowed = {
      Single: 1,
      Double: 2,
      Triple: 3,
    };

    if (numberOfBeds >= maxBedsAllowed[roomType]) {
      throw {
        message: `Room has been filled with beds. Maximum allowed for ${roomType} room is ${maxBedsAllowed[roomType]}.`,
        status: 400,
        isCustomError: true,
      };
    }

    next(); // Proceed to save the document
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
});

BedSchema.pre("findOneAndUpdate", async function (next) {
  const { roomId, bednumber } = this;
  try {
    //import model
    const bed = mongoose.model("Bed");
    const Room = mongoose.model("Room");

    // Validate roomId
    const roomExists = await Room.findOne({ _id: roomId });
    if (!roomExists) {
      throw {
        message: "Invalid roomId: Room does not exist",
        status: 400,
        isCustomError: true,
      };
    }

    //ensure unique bedId
    const isBedExist = await bed.exists({ roomId, bednumber });
    if (isBedExist) {
      throw {
        message:
          "A bed with this number already exists in the room. Please provide a unique bed number.",
        status: 400,
        isCustomError: true,
      };
    }

    //ensure in room only proceed allowed bed.
    const { roomType } = roomExists;
    const numberOfBeds = await bed.countDocuments({ roomId });

    const maxBedsAllowed = {
      Single: 1,
      Double: 2,
      Triple: 3,
    };

    if (numberOfBeds >= maxBedsAllowed[roomType]) {
      throw {
        message: `Room has been filled with beds. Maximum allowed for ${roomType} room is ${maxBedsAllowed[roomType]}.`,
        status: 400,
        isCustomError: true,
      };
    }

    next(); // Proceed to save the document
  } catch (error) {
    next(error); // Pass the error to the error-handling middleware
  }
});

export default mongoose.model("Bed", BedSchema);
