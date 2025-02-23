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

    // Check if bed number already exists in the same room
    const isBedExistInRoom = await bed.findOne({ roomId, bednumber });
    if (isBedExistInRoom) {
      throw {
        message: `A bed with this number already exists in the Room ${roomExists?.roomNumber}. Please provide a unique bed number.`,
        status: 400,
        isCustomError: true,
      };
    }

    //ensure unique bedId
    const isBedExistInPg = await bed.aggregate([
      {
        $lookup: {
          from: "rooms",
          localField: "roomId",
          foreignField: "_id",
          as: "roomDetail",
        },
      },
      {
        $unwind: {
          path: "$roomDetail",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          "roomDetail.pgId": roomExists?.pgId,
          bednumber: bednumber
        },
      },
    ]);

    if (isBedExistInPg.length > 0) {
      throw {
        message:
          "A bed with this number already exists in another room within the same PG. Please provide a unique bed number.",
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
    next({ message: error.message || "Something went wrong", status: 500 });
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

    // Check if bed number already exists in the same room
    const isBedExistInRoom = await bed.findOne({ roomId, bednumber });
    if (isBedExistInRoom) {
      throw {
        message: `A bed with this number already exists in the Room ${roomExists?.roomNumber}. Please provide a unique bed number.`,
        status: 400,
        isCustomError: true,
      };
    }

    //ensure unique bedId
    const isBedExistInPg = await bed.aggregate([
      {
        $lookup: {
          from: "rooms",
          localField: "roomId",
          foreignField: "_id",
          as: "roomDetail",
        },
      },
      {
        $unwind: {
          path: "$roomDetail",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: {
          "roomDetail.pgId": roomExists?.pgId,
          bednumber: bednumber,
        },
      },
    ]);

    if (isBedExistInPg.length > 0) {
      throw {
        message:
          "A bed with this number already exists in another room within the same PG. Please provide a unique bed number.",
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
