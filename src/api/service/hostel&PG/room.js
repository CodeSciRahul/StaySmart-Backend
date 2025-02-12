import Room from "../../model/room.js";
import HostelPG from "../../model/hostelpg.js"
import { handleError } from "../../../util/handleError.js";
import room from "../../model/room.js";

// Create a Room
export const addRoom = async (req, res) => {
  try {
    const { pgId, roomNumber, roomType, features } = req.body;


    const room = new Room({ pgId, roomNumber, roomType, features });
    await room.save();

    res.status(201).send({ message: "Room created successfully", data: room });
  } catch (error) {
    handleError(error, res);
  }
};

// Get All Rooms
export const getAllRooms = async (req, res) => {
  try {
    const {pgId} = req.params
    const hostelPgId = new Object(pgId);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    // Aggregate pipeline
    const rooms = await Room.aggregate([
      {
        $match: {pgId: hostelPgId}
      },
      {
        $lookup: {      //lookup is use to joing the bed collection
          from: "Bed", // Collection name of Bed
          localField: "_id", // room ki _id
          foreignField: "roomId", //room ki id bed ki roomId field se match hogi
          as: "beds",
        },
      },
      {
        $unwind: { path: "$beds", preserveNullAndEmptyArrays: true }, // Flatten beds array
      },
      {
        $lookup: {
          from: "Tenant", // Collection name of Tenant
          localField: "beds.tenantId",
          foreignField: "_id",
          as: "beds.tenant",
        },
      },
      {
        $unwind: { path: "$beds.tenant", preserveNullAndEmptyArrays: true }, // Flatten tenant array
      },
      {
        $group: {
          _id: "$_id",
          pgId: { $first: "$pgId" },
          roomNumber: { $first: "$roomNumber" },
          roomType: { $first: "$roomType" },
          features: { $first: "$features" },
          createdAt: { $first: "$createdAt" },
          updatedAt: { $first: "$updatedAt" },
          beds: {
            $push: {
              _id: "$beds._id",
              bednumber: "$beds.bednumber",
              price: "$beds.price",
              tenant: {
                _id: "$beds.tenant._id",
                name: "$beds.tenant.name",
                email: "$beds.tenant.email",
              },
            },
          },
        },
      },
      {$sort: {roomNumber: 1}},
      { $skip: skip },
      { $limit: limit },
    ]);

    const totalRooms = await Room.countDocuments()

    //meta data about pagination.
    const totalPages = Math.ceil(totalRooms / limit);
    const previousPage = page - 1 === 0 ? null : page - 1;
    const nextPage = page >= totalPages ? null : page + 1;
    res.status(200).send({
      data: rooms,
      meta: {
        totalRooms,
        totalPages,
        currentPage: page,
        itemsPerPage: limit,
        previousPage,
        nextPage,
      },
    });
  } catch (error) {
    handleError(error, res);
  }
};

//Get Room by ID
export const getSignleRoom = async (req, res) => {
  try {
    const { id } = req.params;

    const roomObjectId = new Object(id);

    const room = await Room.aggregate([
      {
        $match: { _id: roomObjectId },
      },
      {
        $lookup: {
          from: "beds",
          localField: "_id",
          foreignField: "roomId",
          as: "beds",
        },
      },
      {
        $lookup: {
          from: "tenants",
          localField: "beds.tenantId",
          foreignField: "_id",
          pipeline: [
            {
              $project: {
                _id: 1,
                name: 1,
                email: 1,
              },
            },
          ],
          as: "tenantDetails",
        },
      },
      {
        $addFields: {
          beds: {
            $map: {
              input: "$beds",
              as: "bed",
              in: {
                _id: "$$bed._id",
                bednumber: "$$bed.bednumber",
                price: "$$bed.price",
                tenant: {
                  $arrayElemAt: [
                    {
                      $filter: {
                        input: "$tenantDetails",
                        as: "tenant",
                        cond: { $eq: ["$$tenant._id", "$$bed.tenantId"] },
                      },
                    },
                    0,
                  ],
                },
              },
            },
          },
        },
      },
      {
        $project: {
          tenantDetails: 0,
        },
      },
    ]);

    if (!room.length) {
      return res.status(404).send({ message: "Room not found" });
    }

    res.status(200).send({ data: room[0] });
  } catch (error) {
    handleError(error, res);
  }
};

// Update a Room
export const updateRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const {roomNumber, roomType, features} = req.body;

    const room = await Room.findById(id);

    if (!room) {
      return res.status(404).send({ message: "Room not found" });
    }

     //update room
     room.roomNumber = roomNumber || room.roomNumber;
     room.roomType = roomType || room.roomType;
     room.features = features || room.features;

     await room.save();

    res
      .status(200)
      .send({ message: "Room updated successfully", data: room });
  } catch (error) {
    handleError(error, res);
  }
};

// Delete a Room
export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedRoom = await Room.findByIdAndDelete(id);

    if (!deletedRoom) {
      return res.status(404).send({ message: "Room not found" });
    }

    res.status(200).send({ message: "Room deleted successfully" });
  } catch (error) {
    handleError(error, res);
  }
};
