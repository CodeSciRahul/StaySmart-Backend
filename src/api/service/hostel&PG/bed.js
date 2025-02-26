import Bed from "../../model/bed.js";
import { handleError } from "../../../util/handleError.js";
import { handleSuccessRes } from "../../../util/handleRes.js";
import mongoose from "mongoose";

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
    const populatedData = Bed.findById(newBed?._id).populate("roomId");
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
      { new: true }
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
    const {pgId} = req.params;
    const objectPgId = new mongoose.Types.ObjectId(pgId);
    if (!pgId) {
      throw {
        message: "PgId is required.",
        status: 400,
        isCustomError: true,
      };
    }
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const matchStage = { "roomDetail.pgId": objectPgId };
    //notes: lookup me jo bhi collection name likhte h use plural and small letter me likhte h even collection name capital or singular ho.
  const Beds = await Bed.aggregate([
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
        $lookup: {
          from: "hostelpgs",
          localField: "roomDetail.pgId",
          foreignField: "_id",
          as: "hostelpgDetail",
        },
      },
      {
        $unwind: {
          path: "$hostelpgDetail",
          preserveNullAndEmptyArrays: true,
        },
      },

      {
        $lookup: {
          from: "tenants",
          localField: "tenantId",
          foreignField: "_id",
          as: "tenantDetail",
        },
      },
      {
        $unwind: {
          path: "$tenantDetail",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $match: matchStage,
      },
      {
        $group: {
          _id: "$roomDetail._id",
          roomNumber: { $first: "$roomDetail.roomNumber" },
          roomType: { $first: "$roomDetail.roomType" },
          features: { $first: "$roomDetail.features" },
          pgId: { $first: "$hostelpgDetail" },
          beds: {
            $push: {
              _id: "$_id",
              bedNumber: "$bednumber",
              price: "$price",
              createdAt: "$createdAt",
              updatedAt: "$updatedAt",
              tenant: {
                _id: "$tenantDetail._id",
                name: "$tenantDetail.name",
                email: "$tenantDetail.email",
                phone: "$tenantDetail.phone",
                meal: "$tenantDetail.meal",
                images: "$tenantDetail.images",
              },
            },
          },
          totalBeds: {$sum: 1},
          vacantBeds: {
            $sum: {
              $cond: [{$eq: ['$tenantId', null]}, 1, 0]
            }
          }
        },
      },

      {
        $group: {
          _id: "$pgId._id",
          name: { $first: "$pgId.name" },
          ownerId: { $first: "$pgId.ownerId" },
          address: { $first: "$pgId.address" },
          features: { $first: "$pgId.features" },
          totalRooms: {$sum: 1},
          vacantRooms:{
            $sum: {
              $cond: [{$eq: ['$vacantBeds', '$totalBeds']}, 1,0]
            }
          },
          rooms: {
            $push: {
              _id: "$_id",
              roomNumber: "$roomNumber",
              roomType: "$roomType",
              features: "$features",
              totalBeds: "$totalBeds",
              vacantBeds: "$vacantBeds",
              beds: "$beds",
            },
          },
        },
      },

      {
        $project: {
          _id: 0,
            _id: "$_id",
            name: "$name",
            ownerId: "$ownerId",
            address: "$address",
            features: "$features",
            totalRooms: "$totalRooms",
            vacantRooms: "$vacantRooms", 
            rooms: "$rooms",
        },
      },
      {
        $skip: skip,
      },
      {
        $limit: limit,
      },
      {
        $sort: { bedNumber: -1 },
      },
    ]);
    handleSuccessRes(Beds[0], res, "Beds reterived successfully");
  } catch (error) {
    handleError(error, res);
  }
};

