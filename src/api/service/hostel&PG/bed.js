import Bed from "../../model/bed.js";
import { handleError } from "../../../util/handleError.js";
import { handleSuccessRes } from "../../../util/handleRes.js";

//create Bed
export const addBed = async (req, res) => {
  try {
    const { roomId, bednumber, price } = req.body;
    if (!roomId) {
      throw {
        message: "Room Id is required.",
        status: 400,
        isCustomError: true,
      };
    }
    // Validate and format bednumber
    if (!bednumber || !/^\d+[A-Z]$/.test(bednumber)) {
      throw {
        message: "Bed number must be in the format like 101A, 102B, etc.",
        status: 400,
        isCustomError: true,
      };
    }

    const newBed = new Bed({ roomId, bednumber, price });
    await newBed.save();
    const populatedData = Bed.findById(newBed?._id).populate("roomId")
    handleSuccessRes(populatedData, res, "Bed added successfully");
  } catch (error) {
    handleError(error, res);
  }
};

//update Bed
export const updateBed = async (req, res) => {
  try {
    const { bedId } = req.params; // Bed ID to update
    const { bednumber, price } = req.body;

      // Validate and format bednumber
      if (!bednumber || !/^\d+[A-Z]$/.test(bednumber)) {
        throw {
          message: "Bed number must be in the format like 101A, 102B, etc.",
          status: 400,
          isCustomError: true,
        };
      }

    const updatedBed = await Bed.findByIdAndUpdate(
      bedId,
      { bednumber, price },
      { new: true } // Return the updated document
    );

    if (!updatedBed) {
      throw {
        message: "Bed not found",
        status: 400,
        isCustomError: true,
      };
    }

    handleSuccessRes(updateBed, res, "Bed updated successfully");
  } catch (error) {
    handleError(error, res);
  }
};

//get all bed for room or hostel.
export const beds = async (req, res) => {
  try {
    const { roomId, pgId } = req.params;
    if (!(roomId || pgId)) {
      throw {
        message: "RoomId or PgId is required.",
        status: 400,
        isCustomError: true,
      };
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    let Beds;
    if (roomId) {
      Beds = await Bed.find({ roomId }).populate({
        path: "roomId",
        select: "pgId roomNumber roomType features _id",
        // populate: {
        //   path: "pgId",
        //   select: "name ownerId",
        //   populate: {
        //     path: "ownerId",
        //     select: "name email phone"
        //   }
        // }
      }).populate({
        path: 'tenantId',
        select: "name email phone meal images"
      })
        .skip(skip)
        .limit(limit)
        .sort({ bednumber: 1 });
    }
    if (pgId) {
      Beds = await Bed.aggregate([
        // Step 1: Lookup to join with the Room collection
        {
          $lookup: {
            from: "rooms", // The collection to join with (Room)
            localField: "roomId", // Field from the Bed collection
            foreignField: "_id", // Field from the Room collection
            as: "roomDetails", // Output array field
          },
        },
        // Step 2: Unwind the roomDetails array (since $lookup returns an array)
        {
          $unwind: "$roomDetails",
        },
        // Step 3: Match rooms that belong to the given pgId
        {
          $match: {
            "roomDetails.pgId": new mongoose.Types.ObjectId(pgId),
          },
        },
        // Step 4: Lookup to join with the Tenant collection (optional)
        {
          $lookup: {
            from: "tenants", // The collection to join with (Tenant)
            localField: "tenantId", // Field from the Bed collection
            foreignField: "_id", // Field from the Tenant collection
            as: "tenantDetails", // Output array field
          },
        },
        // Step 5: Unwind the tenantDetails array (optional)
        {
          $unwind: {
            path: "$tenantDetails",
            preserveNullAndEmptyArrays: true, // Preserve beds without tenants
          },
        },
        // Step 6: Project the desired fields
        {
          $project: {
            _id: 1,
            bednumber: 1,
            price: 1,
            createdAt: 1,
            updatedAt: 1,
            roomDetails: {
              _id: 1,
              roomNumber: 1,
              roomType: 1,
            },
            tenantDetails: {
              _id: 1,
              name: 1,
              email: 1,
            },
          },
        },
        //implement pagination
        { $skip: skip },
        { $limit: limit },
        { $sort: { bednumber: 1 } },
      ]);
    }
    if (!Beds) {
      throw {
        message: "RoomId or pgId is wrong",
        status: 400,
        isCustomError: true,
      };
    }
    handleSuccessRes(Beds, res, "Beds reterived successfully");
  } catch (error) {
    handleError(error, res);
  }
};

//get single bed.
export const bed = async (req, res) => {
  try {
    const { bedId } = req.params;
    const bed = await Bed.findById(bedId).populate("roomId", "tenantId");
    if (!bed) {
      throw {
        message: "Bed not found",
        status: 400,
        isCustomError: true,
      };
    }
    handleSuccessRes(bed, res, "Bed reterived successfully");
  } catch (error) {
    handleError(error, res);
  }
};
